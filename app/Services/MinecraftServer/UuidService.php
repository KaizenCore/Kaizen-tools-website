<?php

namespace App\Services\MinecraftServer;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UuidService
{
    private const API_BASE_URL = 'https://api.mojang.com';

    private const SESSION_SERVER_URL = 'https://sessionserver.mojang.com';

    /**
     * Convert username to UUID.
     *
     * @return array{uuid: string, username: string, uuid_formatted: string}|null
     */
    public function convertUsernameToUuid(string $username): ?array
    {
        try {
            $response = Http::timeout(10)
                ->get(self::API_BASE_URL."/users/profiles/minecraft/{$username}");

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'uuid' => $data['id'],
                    'username' => $data['name'],
                    'uuid_formatted' => $this->formatUuid($data['id']),
                ];
            }

            if ($response->status() === 404) {
                Log::info('Minecraft player not found', ['username' => $username]);

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
     * Convert UUID to username.
     *
     * @return array{uuid: string, username: string, uuid_formatted: string}|null
     */
    public function convertUuidToUsername(string $uuid): ?array
    {
        try {
            // Remove any dashes from UUID
            $cleanUuid = str_replace('-', '', $uuid);

            $response = Http::timeout(10)
                ->get(self::SESSION_SERVER_URL."/session/minecraft/profile/{$cleanUuid}");

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'uuid' => $data['id'],
                    'username' => $data['name'],
                    'uuid_formatted' => $this->formatUuid($data['id']),
                ];
            }

            if ($response->status() === 404) {
                Log::info('Minecraft profile not found', ['uuid' => $uuid]);

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
     * Auto-detect input type and convert accordingly.
     *
     * @return array{uuid: string, username: string, uuid_formatted: string}|null
     */
    public function convert(string $input): ?array
    {
        // Check if input is a UUID (with or without dashes)
        if ($this->isUuid($input)) {
            return $this->convertUuidToUsername($input);
        }

        // Otherwise, treat it as a username
        return $this->convertUsernameToUuid($input);
    }

    /**
     * Check if input is a valid UUID format.
     */
    private function isUuid(string $input): bool
    {
        // Remove dashes for length check
        $clean = str_replace('-', '', $input);

        // UUID should be 32 hexadecimal characters
        return strlen($clean) === 32 && ctype_xdigit($clean);
    }

    /**
     * Format UUID with dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
     */
    private function formatUuid(string $uuid): string
    {
        // Remove any existing dashes
        $clean = str_replace('-', '', $uuid);

        // Insert dashes at proper positions
        return sprintf(
            '%s-%s-%s-%s-%s',
            substr($clean, 0, 8),
            substr($clean, 8, 4),
            substr($clean, 12, 4),
            substr($clean, 16, 4),
            substr($clean, 20, 12)
        );
    }
}
