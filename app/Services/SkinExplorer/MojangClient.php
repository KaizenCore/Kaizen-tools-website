<?php

namespace App\Services\SkinExplorer;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MojangClient
{
    private const API_BASE_URL = 'https://api.mojang.com';

    private const SESSION_SERVER_URL = 'https://sessionserver.mojang.com';

    /**
     * Get UUID by Minecraft username.
     *
     * @return array{id: string, name: string}|null
     */
    public function getUuidByUsername(string $username): ?array
    {
        try {
            $response = Http::timeout(10)
                ->get(self::API_BASE_URL."/users/profiles/minecraft/{$username}");

            if ($response->successful()) {
                return $response->json();
            }

            if ($response->status() === 404) {
                Log::info('Minecraft player not found', ['username' => $username]);

                return null;
            }

            if ($response->status() === 403) {
                Log::warning('Mojang API returned 403 - possible rate limit or misconfiguration', [
                    'username' => $username,
                    'status' => $response->status(),
                ]);

                return null;
            }

            Log::error('Failed to fetch UUID from Mojang API', [
                'username' => $username,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception while fetching UUID from Mojang API', [
                'username' => $username,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Get player profile with skin data by UUID.
     *
     * @return array<string, mixed>|null
     */
    public function getProfileByUuid(string $uuid): ?array
    {
        try {
            // Remove any dashes from UUID
            $cleanUuid = str_replace('-', '', $uuid);

            $response = Http::timeout(10)
                ->get(self::SESSION_SERVER_URL."/session/minecraft/profile/{$cleanUuid}");

            if ($response->successful()) {
                return $response->json();
            }

            if ($response->status() === 404) {
                Log::info('Minecraft profile not found', ['uuid' => $uuid]);

                return null;
            }

            if ($response->status() === 429) {
                Log::warning('Mojang API rate limit exceeded', [
                    'uuid' => $uuid,
                    'status' => $response->status(),
                ]);

                return null;
            }

            Log::error('Failed to fetch profile from Mojang Session Server', [
                'uuid' => $uuid,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception while fetching profile from Mojang Session Server', [
                'uuid' => $uuid,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Get player profile directly by username (combines both API calls).
     *
     * @return array<string, mixed>|null
     */
    public function getProfileByUsername(string $username): ?array
    {
        $uuidData = $this->getUuidByUsername($username);

        if (! $uuidData || ! isset($uuidData['id'])) {
            return null;
        }

        return $this->getProfileByUuid($uuidData['id']);
    }
}
