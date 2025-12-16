<?php

namespace App\Services\ModAggregator;

use App\Services\ModAggregator\Contracts\ModApiClientInterface;
use Illuminate\Support\Facades\Http;

class ModrinthClient implements ModApiClientInterface
{
    private const BASE_URL = 'https://api.modrinth.com/v2';

    public function __construct(
        private string $userAgent = 'ModAggregator/1.0 (contact@example.com)'
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function search(string $query, int $limit = 20, int $offset = 0): array
    {
        $response = Http::withHeaders(['User-Agent' => $this->userAgent])
            ->get(self::BASE_URL.'/search', [
                'query' => $query,
                'facets' => json_encode([['project_type:mod']]),
                'limit' => min($limit, 100),
                'offset' => $offset,
            ]);

        if ($response->failed()) {
            return ['hits' => [], 'total_hits' => 0];
        }

        return $response->json();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getProject(string $id): ?array
    {
        $response = Http::withHeaders(['User-Agent' => $this->userAgent])
            ->get(self::BASE_URL."/project/{$id}");

        return $response->successful() ? $response->json() : null;
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

        $response = Http::withHeaders(['User-Agent' => $this->userAgent])
            ->get(self::BASE_URL.'/projects', [
                'ids' => json_encode($ids),
            ]);

        return $response->successful() ? $response->json() : [];
    }

    /**
     * @return array<string, mixed>
     */
    public function getPopular(int $limit = 100): array
    {
        $response = Http::withHeaders(['User-Agent' => $this->userAgent])
            ->get(self::BASE_URL.'/search', [
                'facets' => json_encode([['project_type:mod']]),
                'index' => 'downloads',
                'limit' => min($limit, 100),
            ]);

        if ($response->failed()) {
            return ['hits' => [], 'total_hits' => 0];
        }

        return $response->json();
    }
}
