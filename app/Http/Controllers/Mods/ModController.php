<?php

namespace App\Http\Controllers\Mods;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mods\ModIndexRequest;
use App\Http\Resources\ModResource;
use App\Models\Mod;
use App\Models\ModCategory;
use App\Services\ModAggregator\LiveSearchService;
use Inertia\Inertia;
use Inertia\Response;

class ModController extends Controller
{
    public function __construct(
        private LiveSearchService $liveSearch
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

        $mods = $query
            ->orderBy($sortField, $request->order ?? 'desc')
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('mods/index', [
            'mods' => ModResource::collection($mods),
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'loader', 'version', 'sort', 'order']),
            'isLiveSearch' => false,
        ]);
    }

    public function show(Mod $mod): Response
    {
        $mod->load(['sources', 'categories']);

        return Inertia::render('mods/show', [
            'mod' => (new ModResource($mod))->resolve(),
        ]);
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
