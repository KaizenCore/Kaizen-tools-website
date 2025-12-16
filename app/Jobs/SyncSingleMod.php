<?php

namespace App\Jobs;

use App\Enums\ModPlatform;
use App\Models\Mod;
use App\Models\ModSource;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Str;

class SyncSingleMod implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    public int $backoff = 30;

    /**
     * @param  array<string, mixed>  $modData
     */
    public function __construct(
        public array $modData
    ) {}

    public function handle(): void
    {
        $data = $this->modData;

        if (empty($data['name']) || empty($data['slug'])) {
            return;
        }

        // Find or create the mod
        $mod = Mod::firstOrCreate(
            ['slug' => $data['slug']],
            [
                'name' => $data['name'],
                'summary' => $data['summary'] ?? $data['description'] ?? null,
                'author' => $data['author'] ?? 'Unknown',
                'icon_url' => $data['icon_url'] ?? null,
                'total_downloads' => $data['downloads'] ?? 0,
                'last_updated_at' => isset($data['updated_at']) ? now()->parse($data['updated_at']) : now(),
                'last_synced_at' => now(),
            ]
        );

        // Create or update the source
        $platform = $this->determinePlatform($data);

        if ($platform && ! empty($data['external_id'])) {
            ModSource::updateOrCreate(
                [
                    'mod_id' => $mod->id,
                    'platform' => $platform,
                ],
                [
                    'external_id' => $data['external_id'],
                    'external_slug' => $data['external_slug'] ?? Str::slug($data['name']),
                    'project_url' => $data['project_url'] ?? null,
                    'downloads' => $data['downloads'] ?? 0,
                    'supported_versions' => $data['supported_versions'] ?? [],
                    'supported_loaders' => $data['supported_loaders'] ?? [],
                ]
            );

            // Update total downloads and last_synced_at
            $mod->update([
                'total_downloads' => $mod->sources()->sum('downloads'),
                'last_synced_at' => now(),
            ]);
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function determinePlatform(array $data): ?ModPlatform
    {
        $platforms = $data['platforms'] ?? [];

        if (in_array('modrinth', $platforms)) {
            return ModPlatform::Modrinth;
        }

        if (in_array('curseforge', $platforms)) {
            return ModPlatform::Curseforge;
        }

        // Try to determine from project_url
        if (isset($data['project_url'])) {
            if (str_contains($data['project_url'], 'modrinth.com')) {
                return ModPlatform::Modrinth;
            }
            if (str_contains($data['project_url'], 'curseforge.com')) {
                return ModPlatform::Curseforge;
            }
        }

        return null;
    }
}
