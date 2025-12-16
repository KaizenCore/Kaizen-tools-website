<?php

namespace App\Http\Controllers\Mods;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mods\ModIndexRequest;
use App\Http\Resources\ModResource;
use App\Jobs\SyncSingleMod;
use App\Models\Mod;
use App\Models\ModCategory;
use App\Services\ModAggregator\CurseForgeClient;
use App\Services\ModAggregator\LiveSearchService;
use App\Services\ModAggregator\ModMatcher;
use App\Services\ModAggregator\ModNormalizer;
use App\Services\ModAggregator\ModrinthClient;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ModController extends Controller
{
    public function __construct(
        private LiveSearchService $liveSearch,
        private ModrinthClient $modrinthClient,
        private CurseForgeClient $curseForgeClient,
        private ModNormalizer $normalizer,
        private ModMatcher $matcher,
    ) {}

    public function index(ModIndexRequest $request): Response
    {
        $categories = ModCategory::query()
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        // If there's a search query, perform live search from APIs
        if ($request->search && strlen($request->search) >= 2) {
            $liveResults = $this->liveSearch->search($request->search, 24);
            $liveModsFormatted = $this->liveSearch->formatForFrontend($liveResults);

            // Also get local results
            $localMods = Mod::query()
                ->with(['sources', 'categories'])
                ->where(function ($q) use ($request) {
                    $q->where('name', 'like', "%{$request->search}%")
                        ->orWhere('summary', 'like', "%{$request->search}%")
                        ->orWhere('author', 'like', "%{$request->search}%");
                })
                ->orderBy('total_downloads', 'desc')
                ->limit(24)
                ->get();

            // Merge local and live results, prioritizing local (which has more data)
            $mergedResults = $this->mergeLocalAndLiveResults($localMods, $liveModsFormatted);

            return Inertia::render('mods/index', [
                'mods' => [
                    'data' => $mergedResults,
                    'links' => [
                        'first' => null,
                        'last' => null,
                        'prev' => null,
                        'next' => null,
                    ],
                    'meta' => [
                        'current_page' => 1,
                        'from' => 1,
                        'last_page' => 1,
                        'per_page' => count($mergedResults),
                        'to' => count($mergedResults),
                        'total' => count($mergedResults),
                        'path' => url('/mods'),
                        'links' => [],
                    ],
                ],
                'categories' => $categories,
                'filters' => $request->only(['search', 'category', 'loader', 'version', 'sort', 'order']),
                'isLiveSearch' => true,
            ]);
        }

        // Standard database query when no search or search is too short
        $query = Mod::query()
            ->with(['sources', 'categories'])
            ->when($request->category, fn ($q, $category) => $q->whereHas('categories', fn ($cq) => $cq->where('slug', $category)))
            ->when($request->loader, fn ($q, $loader) => $q->whereHas('sources', fn ($sq) => $sq->whereJsonContains('supported_loaders', $loader)))
            ->when($request->version, fn ($q, $version) => $q->whereHas('sources', fn ($sq) => $sq->whereJsonContains('supported_versions', $version)));

        $sortField = match ($request->sort) {
            'downloads' => 'total_downloads',
            'updated' => 'last_updated_at',
            'name' => 'name',
            default => 'total_downloads',
        };

        return Inertia::render('mods/index', [
            'mods' => Inertia::scroll(
                fn () => ModResource::collection(
                    $query
                        ->orderBy($sortField, $request->order ?? 'desc')
                        ->paginate(24)
                        ->withQueryString()
                )
            ),
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'loader', 'version', 'sort', 'order']),
            'isLiveSearch' => false,
        ]);
    }

    public function show(string $mod): Response
    {
        // First try to find the mod in our database
        $existingMod = Mod::where('slug', $mod)->with(['sources', 'categories'])->first();

        if ($existingMod) {
            return Inertia::render('mods/show', [
                'mod' => (new ModResource($existingMod))->resolve(),
            ]);
        }

        // Mod not in database - try to fetch from APIs
        $modData = $this->fetchModFromApis($mod);

        if (! $modData) {
            abort(404, 'Mod not found');
        }

        // Queue a job to sync this mod for future requests
        SyncSingleMod::dispatch($modData)->onQueue('default');

        // Return the live data for now
        return Inertia::render('mods/show', [
            'mod' => $modData,
            'isLiveResult' => true,
        ]);
    }

    /**
     * Fetch mod from APIs by slug/id.
     *
     * @return array<string, mixed>|null
     */
    private function fetchModFromApis(string $slug): ?array
    {
        $modrinthData = null;
        $curseforgeData = null;

        // Try Modrinth first (uses slug)
        try {
            $modrinthData = $this->modrinthClient->getProject($slug);
        } catch (\Exception $e) {
            // Ignore, will try CurseForge
        }

        // Try CurseForge (search by slug since we don't have ID)
        try {
            $cfSearch = $this->curseForgeClient->search($slug, 5);
            $cfResults = $cfSearch['data'] ?? [];

            // Find exact slug match
            foreach ($cfResults as $result) {
                if (Str::slug($result['slug'] ?? '') === $slug || Str::slug($result['name'] ?? '') === $slug) {
                    $curseforgeData = $result;
                    break;
                }
            }
        } catch (\Exception $e) {
            // Ignore
        }

        if (! $modrinthData && ! $curseforgeData) {
            return null;
        }

        // Normalize and merge the data
        $normalizedMr = $modrinthData ? $this->normalizer->normalizeModrinth($modrinthData) : null;
        $normalizedCf = $curseforgeData ? $this->normalizer->normalizeCurseforge($curseforgeData) : null;

        // Prefer Modrinth data, merge with CurseForge if available
        $result = $normalizedMr ?? $normalizedCf;

        if ($normalizedMr && $normalizedCf) {
            $result['total_downloads'] = ($normalizedMr['downloads'] ?? 0) + ($normalizedCf['downloads'] ?? 0);
            $result['has_modrinth'] = true;
            $result['has_curseforge'] = true;
            $result['curseforge_data'] = $normalizedCf;
        } else {
            $result['has_modrinth'] = $normalizedMr !== null;
            $result['has_curseforge'] = $normalizedCf !== null;
        }

        // Format for frontend
        return [
            'id' => $result['external_id'] ?? $slug,
            'name' => $result['name'] ?? 'Unknown Mod',
            'slug' => $result['slug'] ?? $slug,
            'summary' => $result['summary'] ?? $result['description'] ?? null,
            'author' => $result['author'] ?? 'Unknown',
            'icon_url' => $result['icon_url'] ?? null,
            'total_downloads' => $result['total_downloads'] ?? $result['downloads'] ?? 0,
            'formatted_downloads' => $this->formatDownloads($result['total_downloads'] ?? $result['downloads'] ?? 0),
            'has_modrinth' => $result['has_modrinth'],
            'has_curseforge' => $result['has_curseforge'],
            'categories' => $result['categories'] ?? [],
            'sources' => [],
            'description' => $result['description'] ?? $result['body'] ?? null,
        ];
    }

    private function formatDownloads(int $downloads): string
    {
        if ($downloads >= 1000000) {
            return number_format($downloads / 1000000, 1).'M';
        }
        if ($downloads >= 1000) {
            return number_format($downloads / 1000, 1).'K';
        }

        return (string) $downloads;
    }

    /**
     * Merge local database results with live API results.
     *
     * @param  \Illuminate\Database\Eloquent\Collection<int, Mod>  $localMods
     * @param  array<int, array<string, mixed>>  $liveMods
     * @return array<int, array<string, mixed>>
     */
    private function mergeLocalAndLiveResults($localMods, array $liveMods): array
    {
        $results = [];
        $seenSlugs = [];

        // First, add all local results (they have more complete data)
        foreach ($localMods as $mod) {
            $resource = new ModResource($mod);
            $results[] = $resource->toArray(request());
            $seenSlugs[] = $mod->slug;
        }

        // Then add live results that aren't already in local
        foreach ($liveMods as $liveMod) {
            if (! in_array($liveMod['slug'], $seenSlugs)) {
                $results[] = $liveMod;
                $seenSlugs[] = $liveMod['slug'];
            }
        }

        // Sort by downloads
        usort($results, fn ($a, $b) => ($b['total_downloads'] ?? 0) <=> ($a['total_downloads'] ?? 0));

        return array_slice($results, 0, 48);
    }
}
