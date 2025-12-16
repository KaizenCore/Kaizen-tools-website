<?php

namespace App\Jobs;

use App\Enums\ModPlatform;
use App\Models\Mod;
use App\Services\ModAggregator\CurseForgeClient;
use App\Services\ModAggregator\ModNormalizer;
use App\Services\ModAggregator\ModrinthClient;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RefreshModFromApi implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    public int $backoff = 30;

    public function __construct(
        public Mod $mod
    ) {
        // Eager load sources to avoid N+1 query
        $this->mod->loadMissing('sources');
    }

    public function handle(
        ModrinthClient $modrinth,
        CurseForgeClient $curseforge,
        ModNormalizer $normalizer
    ): void {
        $updated = false;

        // Refresh from each source
        foreach ($this->mod->sources as $source) {
            try {
                $data = match ($source->platform) {
                    ModPlatform::Modrinth => $this->refreshFromModrinth($modrinth, $normalizer, $source->external_id),
                    ModPlatform::Curseforge => $this->refreshFromCurseforge($curseforge, $normalizer, $source->external_id),
                };

                if ($data) {
                    // Update the source
                    $source->update([
                        'downloads' => $data['downloads'],
                        'supported_versions' => $data['supported_versions'],
                        'supported_loaders' => $data['supported_loaders'],
                    ]);

                    // Update mod info if this is the primary source or has more downloads
                    if (! $updated || $data['downloads'] > $this->mod->total_downloads) {
                        $this->mod->update([
                            'summary' => $data['summary'] ?? $this->mod->summary,
                            'icon_url' => $data['icon_url'] ?? $this->mod->icon_url,
                            'last_updated_at' => $data['last_updated'] ?? $this->mod->last_updated_at,
                        ]);
                        $updated = true;
                    }
                }
            } catch (\Exception $e) {
                report($e);
            }
        }

        // Update total downloads and last_synced_at
        $this->mod->update([
            'total_downloads' => $this->mod->sources()->sum('downloads'),
            'last_synced_at' => now(),
        ]);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function refreshFromModrinth(ModrinthClient $client, ModNormalizer $normalizer, string $projectId): ?array
    {
        $response = $client->getProject($projectId);

        if (! $response) {
            return null;
        }

        return $normalizer->normalizeModrinth($response);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function refreshFromCurseforge(CurseForgeClient $client, ModNormalizer $normalizer, string $modId): ?array
    {
        $response = $client->getProject($modId);

        if (! $response) {
            return null;
        }

        return $normalizer->normalizeCurseforge($response);
    }
}
