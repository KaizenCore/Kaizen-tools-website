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
     * Search both APIs and local database, returning merged results.
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function search(string $query, int $limit = 20): Collection
    {
        if (strlen($query) < 2) {
            return collect();
        }

        $cacheKey = 'live_search:'.md5($query.':'.$limit);

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($query, $limit) {
            // Search both APIs in parallel using concurrent requests
            $modrinthResults = $this->searchModrinth($query, $limit);
            $curseforgeResults = $this->searchCurseForge($query, $limit);

            // Normalize results
            $normalizedModrinth = $modrinthResults->map(
                fn ($item) => $this->normalizer->normalizeModrinth($item)
            );
            $normalizedCurseforge = $curseforgeResults->map(
                fn ($item) => $this->normalizer->normalizeCurseforge($item)
            );

            // Merge and deduplicate
            $merged = $this->mergeResults($normalizedModrinth, $normalizedCurseforge);

            // Queue sync jobs for new mods (fire and forget)
            $this->queueSyncJobs($merged);

            return $merged->take($limit);
        });
    }

    private function searchModrinth(string $query, int $limit): Collection
    {
        try {
            $response = $this->modrinthClient->search($query, $limit);

            return collect($response['hits'] ?? []);
        } catch (\Exception $e) {
            report($e);

            return collect();
        }
    }

    private function searchCurseForge(string $query, int $limit): Collection
    {
        try {
            $response = $this->curseForgeClient->search($query, $limit);

            return collect($response['data'] ?? []);
        } catch (\Exception $e) {
            report($e);

            return collect();
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
        foreach ($mods->take(10) as $modData) {
            $slug = $modData['slug'] ?? $modData['external_slug'] ?? null;
            $name = $modData['name'] ?? null;

            if (! $slug && ! $name) {
                continue;
            }

            // Check if mod already exists in database
            $existingMod = Mod::query()
                ->when($slug, fn ($q) => $q->where('slug', $slug))
                ->when($name, fn ($q) => $q->orWhere('name', $name))
                ->first();

            if ($existingMod) {
                // Queue refresh job if mod is stale (>24 hours old)
                if ($existingMod->needsSync()) {
                    RefreshModFromApi::dispatch($existingMod)->onQueue('default');
                }
            } else {
                // Add slug to modData if missing and dispatch sync job
                $modData['slug'] = $slug ?? \Illuminate\Support\Str::slug($name);
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
            $slug = $mod['slug'] ?? $mod['external_slug'] ?? \Illuminate\Support\Str::slug($mod['name'] ?? 'unknown');

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
