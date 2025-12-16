<?php

namespace App\Services\MinecraftServer;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ServerStatusService
{
    private const API_URL = 'https://api.mcsrvstat.us/3/';

    /**
     * Check the status of a Minecraft server.
     *
     * @param  string  $address  The server address (e.g., 'hypixel.net' or 'play.example.com:25566')
     * @return array<string, mixed>
     */
    public function checkStatus(string $address): array
    {
        try {
            $response = Http::timeout(10)->get(self::API_URL.$address);

            if (! $response->successful()) {
                return $this->getOfflineStatus($address);
            }

            $data = $response->json();

            // Check if server is online
            if (! isset($data['online']) || ! $data['online']) {
                return $this->getOfflineStatus($address);
            }

            return [
                'success' => true,
                'online' => true,
                'address' => $address,
                'hostname' => $data['hostname'] ?? $address,
                'port' => $data['port'] ?? 25565,
                'ip' => $data['ip'] ?? null,
                'players' => [
                    'online' => $data['players']['online'] ?? 0,
                    'max' => $data['players']['max'] ?? 0,
                    'list' => $data['players']['list'] ?? [],
                ],
                'version' => $data['version'] ?? 'Unknown',
                'motd' => [
                    'raw' => $data['motd']['raw'] ?? [],
                    'clean' => $data['motd']['clean'] ?? [],
                    'html' => $data['motd']['html'] ?? [],
                ],
                'icon' => $data['icon'] ?? null,
                'software' => $data['software'] ?? null,
                'protocol' => [
                    'version' => $data['protocol']['version'] ?? null,
                    'name' => $data['protocol']['name'] ?? null,
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Server status check failed', [
                'address' => $address,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'online' => false,
                'address' => $address,
                'error' => 'Failed to check server status. Please verify the address and try again.',
            ];
        }
    }

    /**
     * Get offline status response.
     *
     * @return array<string, mixed>
     */
    private function getOfflineStatus(string $address): array
    {
        return [
            'success' => true,
            'online' => false,
            'address' => $address,
            'error' => 'Server is offline or unreachable.',
        ];
    }
}
