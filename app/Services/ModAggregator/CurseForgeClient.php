<?php

namespace App\Services\ModAggregator;

use App\Services\ModAggregator\Contracts\ModApiClientInterface;
use Illuminate\Support\Facades\Http;

class CurseForgeClient implements ModApiClientInterface
{
    private const BASE_URL = 'https://api.curseforge.com/v1';

    private const MINECRAFT_GAME_ID = 432;

    private const MODS_CLASS_ID = 6;

    public function __construct(
        private string $apiKey
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function search(string $query, int $limit = 20, int $offset = 0): array
    {
        $response = Http::withHeaders(['x-api-key' => $this->apiKey])
            ->get(self::BASE_URL.'/mods/search', [
                'gameId' => self::MINECRAFT_GAME_ID,
                'classId' => self::MODS_CLASS_ID,
                'searchFilter' => $query,
                'sortField' => 6, // TotalDownloads
                'sortOrder' => 'desc',
                'pageSize' => min($limit, 50),
                'index' => $offset,
            ]);

        if ($response->failed()) {
            return ['data' => [], 'pagination' => ['totalCount' => 0]];
        }

        return $response->json();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getProject(string $id): ?array
    {
        $response = Http::withHeaders(['x-api-key' => $this->apiKey])
            ->get(self::BASE_URL."/mods/{$id}");

        return $response->successful() ? $response->json('data') : null;
    }

    /**
     * @param  array<string>  $ids
     * @return array<array<string, mixed>>
     */
    public function getProjects(array $ids): array
    {
        if (empty($ids)) {
            return [];
        }

        $response = Http::withHeaders(['x-api-key' => $this->apiKey])
            ->post(self::BASE_URL.'/mods', [
                'modIds' => array_map('intval', $ids),
            ]);

        return $response->successful() ? $response->json('data', []) : [];
    }

    /**
     * @return array<string, mixed>
     */
    public function getPopular(int $limit = 100): array
    {
        $response = Http::withHeaders(['x-api-key' => $this->apiKey])
            ->get(self::BASE_URL.'/mods/search', [
                'gameId' => self::MINECRAFT_GAME_ID,
                'classId' => self::MODS_CLASS_ID,
                'sortField' => 2, // Popularity
                'sortOrder' => 'desc',
                'pageSize' => min($limit, 50),
            ]);

        if ($response->failed()) {
            return ['data' => [], 'pagination' => ['totalCount' => 0]];
        }

        return $response->json();
    }
}
