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
            $perPage = 24;
            $page = (int) ($request->page ?? 1);
            $offset = ($page - 1) * $perPage;

            // Get live search results with pagination
            $liveResults = $this->liveSearch->search($request->search, $perPage, $offset);
            $liveModsFormatted = $this->liveSearch->formatForFrontend($liveResults['data']);

            // Also get local results (only on first page to avoid duplicates)
            $localMods = collect();
            if ($page === 1) {
                $localMods = Mod::query()
                    ->with(['sources', 'categories'])
                    ->where(function ($q) use ($request) {
                        $q->where('name', 'like', "%{$request->search}%")
                            ->orWhere('summary', 'like', "%{$request->search}%")
                            ->orWhere('author', 'like', "%{$request->search}%");
                    })
                    ->orderBy('total_downloads', 'desc')
                    ->limit($perPage)
                    ->get();
            }

            // Merge local and live results, prioritizing local (which has more data)
            $mergedResults = $this->mergeLocalAndLiveResults($localMods, $liveModsFormatted);

            // Calculate pagination info
            $totalResults = $liveResults['total'] + ($page === 1 ? $localMods->count() : 0);
            $lastPage = (int) ceil($totalResults / $perPage);
            $hasMorePages = $liveResults['has_more'];

            // Build next page URL if there are more results
            $nextPageUrl = $hasMorePages ? url('/mods').'?'.http_build_query([
                ...$request->only(['search', 'category', 'loader', 'version', 'sort', 'order']),
                'page' => $page + 1,
            ]) : null;

            return Inertia::render('mods/index', [
                'mods' => Inertia::scroll(fn () => [
                    'data' => $mergedResults,
                    'links' => [
                        'first' => url('/mods').'?'.http_build_query([...$request->only(['search', 'category', 'loader', 'version', 'sort', 'order']), 'page' => 1]),
                        'last' => null,
                        'prev' => $page > 1 ? url('/mods').'?'.http_build_query([...$request->only(['search', 'category', 'loader', 'version', 'sort', 'order']), 'page' => $page - 1]) : null,
                        'next' => $nextPageUrl,
                    ],
                    'meta' => [
                        'current_page' => $page,
                        'from' => $offset + 1,
                        'last_page' => max($lastPage, $page + ($hasMorePages ? 1 : 0)),
                        'per_page' => $perPage,
                        'to' => $offset + count($mergedResults),
                        'total' => $totalResults,
                        'path' => url('/mods'),
                        'links' => [],
                    ],
                ]),
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

        // Return the live data (sync job is dispatched in fetchModFromApis)
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

        // Try Modrinth first (uses slug directly)
        try {
            $modrinthData = $this->modrinthClient->getProject($slug);
        } catch (\Exception $e) {
            // Ignore, will try CurseForge
        }

        // Try CurseForge (search by slug since we don't have ID)
        try {
            $cfSearch = $this->curseForgeClient->search($slug, 10);
            $cfResults = $cfSearch['data'] ?? [];

            // Find exact or close slug match
            foreach ($cfResults as $result) {
                $cfSlug = Str::slug($result['slug'] ?? '');
                $cfNameSlug = Str::slug($result['name'] ?? '');

                if ($cfSlug === $slug || $cfNameSlug === $slug) {
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

        // Build the result directly from raw API data for better control
        $hasModrinth = $modrinthData !== null;
        $hasCurseforge = $curseforgeData !== null;

        // Extract data preferring Modrinth
        $name = $modrinthData['title'] ?? $modrinthData['name'] ?? $curseforgeData['name'] ?? 'Unknown Mod';
        $summary = $modrinthData['description'] ?? $curseforgeData['summary'] ?? null;
        $author = $modrinthData['author'] ?? $curseforgeData['authors'][0]['name'] ?? 'Unknown';
        $iconUrl = $modrinthData['icon_url'] ?? $curseforgeData['logo']['thumbnailUrl'] ?? null;
        $description = $modrinthData['body'] ?? $curseforgeData['summary'] ?? null;

        $mrDownloads = $modrinthData['downloads'] ?? 0;
        $cfDownloads = $curseforgeData['downloadCount'] ?? 0;
        $totalDownloads = $mrDownloads + $cfDownloads;

        // Build sources array for the frontend
        $sources = [];
        if ($hasModrinth) {
            $sources[] = [
                'platform' => 'modrinth',
                'external_id' => $modrinthData['id'] ?? $modrinthData['project_id'] ?? '',
                'external_slug' => $modrinthData['slug'] ?? $slug,
                'project_url' => 'https://modrinth.com/mod/'.($modrinthData['slug'] ?? $slug),
                'downloads' => $mrDownloads,
                'supported_versions' => $modrinthData['game_versions'] ?? $modrinthData['versions'] ?? [],
                'supported_loaders' => array_filter($modrinthData['loaders'] ?? [], fn ($l) => in_array(strtolower($l), ['forge', 'fabric', 'quilt', 'neoforge'])),
            ];
        }
        if ($hasCurseforge) {
            $sources[] = [
                'platform' => 'curseforge',
                'external_id' => (string) ($curseforgeData['id'] ?? ''),
                'external_slug' => $curseforgeData['slug'] ?? '',
                'project_url' => $curseforgeData['links']['websiteUrl'] ?? '',
                'downloads' => $cfDownloads,
                'supported_versions' => collect($curseforgeData['latestFilesIndexes'] ?? [])->pluck('gameVersion')->filter()->unique()->values()->all(),
                'supported_loaders' => [],
            ];
        }

        // Extract categories
        $categories = [];
        if ($hasModrinth && isset($modrinthData['categories'])) {
            $categories = array_merge($categories, $modrinthData['categories']);
        }
        if ($hasCurseforge && isset($curseforgeData['categories'])) {
            $categories = array_merge($categories, collect($curseforgeData['categories'])->pluck('name')->all());
        }
        $categories = array_unique($categories);

        // Queue sync job with proper data structure
        $syncData = [
            'name' => $name,
            'slug' => $modrinthData['slug'] ?? $slug,
            'summary' => $summary,
            'author' => $author,
            'icon_url' => $iconUrl,
            'downloads' => $totalDownloads,
            'external_id' => $modrinthData['id'] ?? $modrinthData['project_id'] ?? ($curseforgeData['id'] ?? null),
            'external_slug' => $modrinthData['slug'] ?? $curseforgeData['slug'] ?? $slug,
            'project_url' => $hasModrinth ? 'https://modrinth.com/mod/'.($modrinthData['slug'] ?? $slug) : ($curseforgeData['links']['websiteUrl'] ?? ''),
            'platforms' => array_filter([$hasModrinth ? 'modrinth' : null, $hasCurseforge ? 'curseforge' : null]),
            'categories' => $categories,
        ];

        SyncSingleMod::dispatch($syncData)->onQueue('default');

        return [
            'id' => $modrinthData['id'] ?? $modrinthData['project_id'] ?? $curseforgeData['id'] ?? $slug,
            'name' => $name,
            'slug' => $modrinthData['slug'] ?? $slug,
            'summary' => $summary,
            'author' => $author,
            'icon_url' => $iconUrl,
            'total_downloads' => $totalDownloads,
            'formatted_downloads' => $this->formatDownloads($totalDownloads),
            'has_modrinth' => $hasModrinth,
            'has_curseforge' => $hasCurseforge,
            'categories' => $categories,
            'sources' => $sources,
            'description' => $description,
            'is_live_result' => true,
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
