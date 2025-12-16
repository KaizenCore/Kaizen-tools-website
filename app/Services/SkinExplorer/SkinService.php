<?php

namespace App\Services\SkinExplorer;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SkinService
{
    private const CACHE_TTL_MINUTES = 60;

    private const UUID_CACHE_TTL_DAYS = 7;

    public function __construct(
        private MojangClient $client
    ) {}

    /**
     * Get skin data by Minecraft username with caching.
     *
     * @return array{username: string, uuid: string, skin_url: ?string, cape_url: ?string, slim: bool}|null
     */
    public function getSkinByUsername(string $username): ?array
    {
        $cacheKey = "skin:username:{$username}";

        return Cache::remember($cacheKey, now()->addMinutes(self::CACHE_TTL_MINUTES), function () use ($username) {
            $profile = $this->client->getProfileByUsername($username);

            if (! $profile) {
                return null;
            }

            return $this->parseProfileData($profile);
        });
    }

    /**
     * Get skin data by UUID with caching.
     *
     * @return array{username: string, uuid: string, skin_url: ?string, cape_url: ?string, slim: bool}|null
     */
    public function getSkinByUuid(string $uuid): ?array
    {
        $cacheKey = "skin:uuid:{$uuid}";

        return Cache::remember($cacheKey, now()->addMinutes(self::CACHE_TTL_MINUTES), function () use ($uuid) {
            $profile = $this->client->getProfileByUuid($uuid);

            if (! $profile) {
                return null;
            }

            return $this->parseProfileData($profile);
        });
    }

    /**
     * Get UUID by username with long-term caching.
     */
    public function getUuidByUsername(string $username): ?string
    {
        $cacheKey = "uuid:username:{$username}";

        return Cache::remember($cacheKey, now()->addDays(self::UUID_CACHE_TTL_DAYS), function () use ($username) {
            $data = $this->client->getUuidByUsername($username);

            return $data['id'] ?? null;
        });
    }

    /**
     * Clear cache for a specific username.
     */
    public function clearCacheForUsername(string $username): void
    {
        Cache::forget("skin:username:{$username}");
        Cache::forget("uuid:username:{$username}");
    }

    /**
     * Clear cache for a specific UUID.
     */
    public function clearCacheForUuid(string $uuid): void
    {
        Cache::forget("skin:uuid:{$uuid}");
    }

    /**
     * Parse profile data to extract skin and cape URLs.
     *
     * @param  array<string, mixed>  $profile
     * @return array{username: string, uuid: string, skin_url: ?string, cape_url: ?string, slim: bool}
     */
    private function parseProfileData(array $profile): array
    {
        $result = [
            'username' => $profile['name'] ?? '',
            'uuid' => $profile['id'] ?? '',
            'skin_url' => null,
            'cape_url' => null,
            'slim' => false,
        ];

        if (! isset($profile['properties']) || ! is_array($profile['properties'])) {
            return $result;
        }

        // Find the textures property
        $texturesProperty = collect($profile['properties'])
            ->firstWhere('name', 'textures');

        if (! $texturesProperty || ! isset($texturesProperty['value'])) {
            return $result;
        }

        // Decode the base64 texture data
        try {
            $texturesJson = base64_decode($texturesProperty['value'], true);

            if ($texturesJson === false) {
                Log::warning('Failed to decode base64 texture data', [
                    'uuid' => $profile['id'] ?? null,
                ]);

                return $result;
            }

            $textures = json_decode($texturesJson, true);

            if (! $textures || ! isset($textures['textures'])) {
                return $result;
            }

            // Extract skin URL and model type
            if (isset($textures['textures']['SKIN'])) {
                $result['skin_url'] = $textures['textures']['SKIN']['url'] ?? null;

                // Check if it's a slim/Alex model (3px arms) vs classic/Steve model (4px arms)
                if (isset($textures['textures']['SKIN']['metadata']['model'])) {
                    $result['slim'] = $textures['textures']['SKIN']['metadata']['model'] === 'slim';
                }
            }

            // Extract cape URL if present
            if (isset($textures['textures']['CAPE'])) {
                $result['cape_url'] = $textures['textures']['CAPE']['url'] ?? null;
            }
        } catch (\Exception $e) {
            Log::error('Exception while parsing texture data', [
                'uuid' => $profile['id'] ?? null,
                'error' => $e->getMessage(),
            ]);
        }

        return $result;
    }

    /**
     * Batch fetch skin data for multiple usernames.
     *
     * @param  array<string>  $usernames
     * @return array<string, array{username: string, uuid: string, skin_url: ?string, cape_url: ?string, slim: bool}|null>
     */
    public function getBatchSkinsByUsernames(array $usernames): array
    {
        $results = [];

        foreach ($usernames as $username) {
            $results[$username] = $this->getSkinByUsername($username);
        }

        return $results;
    }

    /**
     * Check if a player exists by username.
     */
    public function playerExists(string $username): bool
    {
        return $this->getUuidByUsername($username) !== null;
    }
}
