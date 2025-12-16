<?php

namespace App\Services\ResourcePacks;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ResourcePackService
{
    private const MODRINTH_BASE_URL = 'https://api.modrinth.com/v2';

    public function __construct(
        private string $userAgent = 'ResourcePackBrowser/1.0 (contact@example.com)'
    ) {}

    /**
     * Search for resource packs on Modrinth.
     *
     * @return array<string, mixed>
     */
    public function search(
        ?string $query = null,
        ?string $version = null,
        string $sort = 'downloads',
        string $order = 'desc',
        int $limit = 24,
        int $offset = 0
    ): array {
        $cacheKey = 'resource_packs:search:'.md5(json_encode(compact('query', 'version', 'sort', 'order', 'limit', 'offset')));

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($query, $version, $sort, $limit, $offset) {
            $facets = [['project_type:resourcepack']];

            if ($version) {
                $facets[] = ["versions:{$version}"];
            }

            $index = match ($sort) {
                'updated' => 'updated',
                'name' => 'title',
                default => 'downloads',
            };

            $params = [
                'facets' => json_encode($facets),
                'index' => $index,
                'limit' => min($limit, 100),
                'offset' => $offset,
            ];

            if ($query) {
                $params['query'] = $query;
            }

            $response = Http::withHeaders(['User-Agent' => $this->userAgent])
                ->get(self::MODRINTH_BASE_URL.'/search', $params);

            if ($response->failed()) {
                return ['hits' => [], 'total_hits' => 0, 'offset' => $offset, 'limit' => $limit];
            }

            $data = $response->json();

            // Transform the results
            $data['hits'] = collect($data['hits'] ?? [])->map(function ($pack) {
                return $this->transformResourcePack($pack);
            })->all();

            return $data;
        });
    }

    /**
     * Get a single resource pack by slug or ID.
     *
     * @return array<string, mixed>|null
     */
    public function getResourcePack(string $slug): ?array
    {
        $cacheKey = "resource_pack:{$slug}";

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($slug) {
            $response = Http::withHeaders(['User-Agent' => $this->userAgent])
                ->get(self::MODRINTH_BASE_URL."/project/{$slug}");

            if ($response->failed()) {
                return null;
            }

            $pack = $response->json();

            return $this->transformResourcePack($pack);
        });
    }

    /**
     * Get versions for a resource pack.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getVersions(string $projectId): array
    {
        $cacheKey = "resource_pack:versions:{$projectId}";

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($projectId) {
            $response = Http::withHeaders(['User-Agent' => $this->userAgent])
                ->get(self::MODRINTH_BASE_URL."/project/{$projectId}/version");

            if ($response->failed()) {
                return [];
            }

            return collect($response->json())->map(function ($version) {
                return [
                    'id' => $version['id'],
                    'name' => $version['name'],
                    'version_number' => $version['version_number'],
                    'game_versions' => $version['game_versions'] ?? [],
                    'downloads' => $version['downloads'] ?? 0,
                    'date_published' => $version['date_published'] ?? null,
                    'files' => collect($version['files'] ?? [])->map(function ($file) {
                        return [
                            'url' => $file['url'],
                            'filename' => $file['filename'],
                            'primary' => $file['primary'] ?? false,
                            'size' => $file['size'] ?? 0,
                        ];
                    })->all(),
                ];
            })->all();
        });
    }

    /**
     * Transform a resource pack from the API response.
     *
     * @param  array<string, mixed>  $pack
     * @return array<string, mixed>
     */
    private function transformResourcePack(array $pack): array
    {
        return [
            'id' => $pack['project_id'] ?? $pack['id'] ?? null,
            'slug' => $pack['slug'] ?? null,
            'name' => $pack['title'] ?? $pack['name'] ?? 'Unknown Resource Pack',
            'summary' => $pack['description'] ?? $pack['summary'] ?? null,
            'body' => $pack['body'] ?? null,
            'author' => $pack['author'] ?? 'Unknown',
            'icon_url' => $pack['icon_url'] ?? null,
            'downloads' => $pack['downloads'] ?? 0,
            'formatted_downloads' => $this->formatDownloads($pack['downloads'] ?? 0),
            'followers' => $pack['followers'] ?? 0,
            'updated_at' => $pack['date_modified'] ?? $pack['updated_at'] ?? null,
            'published_at' => $pack['date_published'] ?? $pack['published_at'] ?? null,
            'categories' => $pack['categories'] ?? [],
            'game_versions' => $pack['game_versions'] ?? [],
            'gallery' => $pack['gallery'] ?? [],
            'project_url' => $pack['project_url'] ?? ($pack['slug'] ? "https://modrinth.com/resourcepack/{$pack['slug']}" : null),
        ];
    }

    private function formatDownloads(int $downloads): string
    {
        if ($downloads >= 1000000) {
            return number_format($downloads / 1000000, 1).'M';
        }
        if ($downloads >= 1000) {
            return number_format($downloads / 1000, 1).'K';
        }

        return (string) $downloads;
    }
}
