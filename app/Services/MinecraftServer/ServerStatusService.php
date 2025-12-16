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
            $response = Http::timeout(30)
                ->connectTimeout(15)
                ->retry(2, 1000)
                ->get(self::API_URL.$address);

            if (! $response->successful()) {
                Log::warning('Server status API returned non-success status', [
                    'address' => $address,
                    'status' => $response->status(),
                ]);

                return $this->getOfflineStatus($address, 'API returned status '.$response->status());
            }

            $data = $response->json();

            // Check if server is online
            if (! isset($data['online']) || ! $data['online']) {
                return $this->getOfflineStatus($address, 'Server is offline or unreachable.');
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
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('Server status check connection failed', [
                'address' => $address,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'online' => false,
                'address' => $address,
                'error' => 'Connection timeout. The status check service may be temporarily unavailable.',
            ];
        } catch (\Exception $e) {
            Log::error('Server status check failed', [
                'address' => $address,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'online' => false,
                'address' => $address,
                'error' => 'Failed to check server status. Please try again in a moment.',
            ];
        }
    }

    /**
     * Get offline status response.
     *
     * @return array<string, mixed>
     */
    private function getOfflineStatus(string $address, string $reason = 'Server is offline or unreachable.'): array
    {
        return [
            'success' => true,
            'online' => false,
            'address' => $address,
            'error' => $reason,
        ];
    }
}
