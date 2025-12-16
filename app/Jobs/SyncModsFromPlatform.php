<?php

namespace App\Jobs;

use App\Enums\ModPlatform;
use App\Models\ModCategory;
use App\Models\ModSource;
use App\Models\SyncLog;
use App\Services\ModAggregator\CurseForgeClient;
use App\Services\ModAggregator\ModMatcher;
use App\Services\ModAggregator\ModNormalizer;
use App\Services\ModAggregator\ModrinthClient;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncModsFromPlatform implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public ModPlatform $platform,
        public int $limit = 100
    ) {}

    public function handle(
        ModrinthClient $modrinth,
        CurseForgeClient $curseforge,
        ModNormalizer $normalizer,
        ModMatcher $matcher
    ): void {
        $syncLog = SyncLog::create([
            'platform' => $this->platform,
            'status' => 'running',
            'started_at' => now(),
        ]);

        try {
            $client = $this->platform === ModPlatform::Modrinth ? $modrinth : $curseforge;
            $result = $client->getPopular($this->limit);

            $hits = $this->platform === ModPlatform::Modrinth
                ? ($result['hits'] ?? [])
                : ($result['data'] ?? []);

            $created = 0;
            $updated = 0;

            foreach ($hits as $modData) {
                $normalized = $this->platform === ModPlatform::Modrinth
                    ? $normalizer->normalizeModrinth($modData)
                    : $normalizer->normalizeCurseforge($modData);

                if (empty($normalized['external_id']) || empty($normalized['name'])) {
                    continue;
                }

                $mod = $matcher->findOrCreateMod($normalized, $this->platform);

                $source = ModSource::updateOrCreate(
                    [
                        'mod_id' => $mod->id,
                        'platform' => $this->platform,
                    ],
                    [
                        'external_id' => $normalized['external_id'],
                        'external_slug' => $normalized['external_slug'],
                        'project_url' => $normalized['project_url'],
                        'downloads' => $normalized['downloads'],
                        'supported_versions' => $normalized['supported_versions'],
                        'supported_loaders' => $normalized['supported_loaders'],
                        'raw_data' => $modData,
                    ]
                );

                $source->wasRecentlyCreated ? $created++ : $updated++;

                // Update mod's total downloads
                $mod->update([
                    'total_downloads' => $mod->sources()->sum('downloads'),
                ]);

                // Sync categories
                $this->syncCategories($mod, $normalized['categories'] ?? []);
            }

            $syncLog->update([
                'status' => 'completed',
                'mods_synced' => count($hits),
                'mods_created' => $created,
                'mods_updated' => $updated,
                'completed_at' => now(),
            ]);
        } catch (Exception $e) {
            $syncLog->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'completed_at' => now(),
            ]);

            throw $e;
        }
    }

    /**
     * Sync categories from API to mod.
     *
     * @param  \App\Models\Mod  $mod
     * @param  array<string>  $apiCategories
     */
    private function syncCategories($mod, array $apiCategories): void
    {
        if (empty($apiCategories)) {
            return;
        }

        // Cache categories to avoid N+1 queries
        static $categoriesBySlug = null;
        if ($categoriesBySlug === null) {
            $categoriesBySlug = ModCategory::all()->keyBy('slug');
        }

        // Map API category names to local category slugs
        $categoryMapping = [
            // Modrinth categories
            'technology' => 'technology',
            'tech' => 'technology',
            'automation' => 'technology',
            'magic' => 'magic',
            'adventure' => 'adventure',
            'storage' => 'storage',
            'worldgen' => 'worldgen',
            'world-generation' => 'worldgen',
            'utility' => 'utility',
            'library' => 'library',
            'decoration' => 'decoration',
            'food' => 'food',
            'mobs' => 'mobs',
            'equipment' => 'equipment',
            'optimization' => 'optimization',
            'performance' => 'optimization',
            // CurseForge categories
            'Technology' => 'technology',
            'Magic' => 'magic',
            'Adventure and RPG' => 'adventure',
            'Storage' => 'storage',
            'World Gen' => 'worldgen',
            'Utility & QoL' => 'utility',
            'Library' => 'library',
            'Cosmetic' => 'decoration',
            'Food' => 'food',
            'Mobs' => 'mobs',
            'Armor, Tools, and Weapons' => 'equipment',
        ];

        $categoryIds = [];

        foreach ($apiCategories as $apiCategory) {
            $slug = $categoryMapping[$apiCategory] ?? $categoryMapping[strtolower($apiCategory)] ?? null;

            if ($slug && isset($categoriesBySlug[$slug])) {
                $categoryIds[] = $categoriesBySlug[$slug]->id;
            }
        }

        if (! empty($categoryIds)) {
            $mod->categories()->syncWithoutDetaching($categoryIds);
        }
    }
}
