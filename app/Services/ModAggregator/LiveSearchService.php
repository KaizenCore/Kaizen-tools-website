<?php

namespace App\Services\ModAggregator;

use App\Jobs\RefreshModFromApi;
use App\Jobs\SyncSingleMod;
use App\Models\Mod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class LiveSearchService
{
    public function __construct(
        private ModrinthClient $modrinthClient,
        private CurseForgeClient $curseForgeClient,
        private ModNormalizer $normalizer,
        private ModMatcher $matcher,
    ) {}

    /**
     * Search both APIs and local database, returning merged results with pagination info.
     *
     * @return array{data: Collection<int, array<string, mixed>>, total: int, has_more: bool}
     */
    public function search(string $query, int $limit = 20, int $offset = 0): array
    {
        if (strlen($query) < 2) {
            return ['data' => collect(), 'total' => 0, 'has_more' => false];
        }

        $cacheKey = 'live_search:'.md5($query.':'.$limit.':'.$offset);

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($query, $limit, $offset) {
            // Search both APIs with offset for pagination
            $modrinthResults = $this->searchModrinth($query, $limit, $offset);
            $curseforgeResults = $this->searchCurseForge($query, $limit, $offset);

            // Normalize results
            $normalizedModrinth = $modrinthResults['hits']->map(
                fn ($item) => $this->normalizer->normalizeModrinth($item)
            );
            $normalizedCurseforge = $curseforgeResults['hits']->map(
                fn ($item) => $this->normalizer->normalizeCurseforge($item)
            );

            // Merge and deduplicate
            $merged = $this->mergeResults($normalizedModrinth, $normalizedCurseforge);

            // Queue sync jobs for all loaded mods (fire and forget)
            $this->queueSyncJobs($merged);

            // Calculate total from both APIs
            $totalHits = max($modrinthResults['total'], $curseforgeResults['total']);
            $hasMore = ($offset + $limit) < $totalHits;

            return [
                'data' => $merged->take($limit),
                'total' => $totalHits,
                'has_more' => $hasMore,
            ];
        });
    }

    /**
     * @return array{hits: Collection, total: int}
     */
    private function searchModrinth(string $query, int $limit, int $offset = 0): array
    {
        try {
            $response = $this->modrinthClient->search($query, $limit, $offset);

            return [
                'hits' => collect($response['hits'] ?? []),
                'total' => $response['total_hits'] ?? 0,
            ];
        } catch (\Exception $e) {
            report($e);

            return ['hits' => collect(), 'total' => 0];
        }
    }

    /**
     * @return array{hits: Collection, total: int}
     */
    private function searchCurseForge(string $query, int $limit, int $offset = 0): array
    {
        try {
            $response = $this->curseForgeClient->search($query, $limit, $offset);

            return [
                'hits' => collect($response['data'] ?? []),
                'total' => $response['pagination']['totalCount'] ?? 0,
            ];
        } catch (\Exception $e) {
            report($e);

            return ['hits' => collect(), 'total' => 0];
        }
    }

    /**
     * Merge results from both platforms, grouping same mods together.
     *
     * @param  Collection<int, array<string, mixed>>  $modrinth
     * @param  Collection<int, array<string, mixed>>  $curseforge
     * @return Collection<int, array<string, mixed>>
     */
    private function mergeResults(Collection $modrinth, Collection $curseforge): Collection
    {
        $results = collect();
        $matchedCfIds = [];

        // Add Modrinth results, checking for CurseForge matches
        foreach ($modrinth as $mrMod) {
            $result = $mrMod;
            $result['platforms'] = ['modrinth'];

            // Try to find matching CurseForge mod
            $cfMatch = $curseforge->first(function ($cfMod) use ($mrMod) {
                return $this->matcher->isSameMod($mrMod, $cfMod);
            });

            if ($cfMatch) {
                $result['platforms'][] = 'curseforge';
                $result['curseforge_data'] = $cfMatch;
                $result['total_downloads'] = ($mrMod['downloads'] ?? 0) + ($cfMatch['downloads'] ?? 0);
                $matchedCfIds[] = $cfMatch['external_id'] ?? $cfMatch['slug'];
            }

            $results->push($result);
        }

        // Add remaining CurseForge mods that weren't matched
        foreach ($curseforge as $cfMod) {
            $cfId = $cfMod['external_id'] ?? $cfMod['slug'];
            if (! in_array($cfId, $matchedCfIds)) {
                $cfMod['platforms'] = ['curseforge'];
                $results->push($cfMod);
            }
        }

        // Sort by total downloads
        return $results->sortByDesc('downloads');
    }

    /**
     * Queue background jobs to sync new mods or refresh stale ones.
     *
     * @param  Collection<int, array<string, mixed>>  $mods
     */
    private function queueSyncJobs(Collection $mods): void
    {
        // Get all existing slugs in one query to avoid N+1
        $slugs = $mods->map(fn ($m) => $m['slug'] ?? $m['external_slug'] ?? null)->filter()->values();
        $existingMods = Mod::whereIn('slug', $slugs)->get()->keyBy('slug');

        foreach ($mods as $modData) {
            $slug = $modData['slug'] ?? $modData['external_slug'] ?? null;
            $name = $modData['name'] ?? null;

            if (! $slug && ! $name) {
                continue;
            }

            $slug = $slug ?? \Illuminate\Support\Str::slug($name);
            $existingMod = $existingMods->get($slug);

            if ($existingMod) {
                // Queue refresh job if mod is stale (>24 hours old)
                if ($existingMod->needsSync()) {
                    RefreshModFromApi::dispatch($existingMod)->onQueue('default');
                }
            } else {
                // Add slug to modData and dispatch sync job
                $modData['slug'] = $slug;
                SyncSingleMod::dispatch($modData)->onQueue('default');
            }
        }
    }

    /**
     * Format search results for the frontend.
     *
     * @param  Collection<int, array<string, mixed>>  $results
     * @return array<int, array<string, mixed>>
     */
    public function formatForFrontend(Collection $results): array
    {
        return $results->map(function ($mod) {
            // Use the Modrinth slug (external_slug) as the primary slug since we fetch from Modrinth API
            $modrinthSlug = $mod['external_slug'] ?? null;
            $slug = $modrinthSlug ?? \Illuminate\Support\Str::slug($mod['name'] ?? 'unknown');

            // Get CurseForge ID if available
            $curseforgeId = null;
            if (isset($mod['curseforge_data']['external_id'])) {
                $curseforgeId = $mod['curseforge_data']['external_id'];
            } elseif (! in_array('modrinth', $mod['platforms'] ?? []) && isset($mod['external_id'])) {
                $curseforgeId = $mod['external_id'];
            }

            return [
                'id' => $mod['external_id'] ?? $slug,
                'name' => $mod['name'] ?? 'Unknown Mod',
                'slug' => $slug,
                'summary' => $mod['summary'] ?? $mod['description'] ?? null,
                'author' => $mod['author'] ?? 'Unknown',
                'icon_url' => $mod['icon_url'] ?? null,
                'total_downloads' => $mod['total_downloads'] ?? $mod['downloads'] ?? 0,
                'formatted_downloads' => $this->formatDownloads($mod['total_downloads'] ?? $mod['downloads'] ?? 0),
                'has_modrinth' => in_array('modrinth', $mod['platforms'] ?? []),
                'has_curseforge' => in_array('curseforge', $mod['platforms'] ?? []),
                'categories' => $mod['categories'] ?? [],
                'sources' => [],
                'is_live_result' => true,
                // Store platform-specific IDs for fetching details
                'modrinth_slug' => $modrinthSlug,
                'curseforge_id' => $curseforgeId,
            ];
        })->values()->toArray();
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
}
