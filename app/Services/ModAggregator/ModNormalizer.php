<?php

namespace App\Services\ModAggregator;

class ModNormalizer
{
    /**
     * Normalize Modrinth API response to unified format.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function normalizeModrinth(array $data): array
    {
        return [
            'external_id' => $data['project_id'] ?? $data['id'] ?? '',
            'external_slug' => $data['slug'] ?? '',
            'name' => $data['title'] ?? $data['name'] ?? '',
            'summary' => $data['description'] ?? '',
            'author' => $data['author'] ?? 'Unknown',
            'icon_url' => $data['icon_url'] ?? null,
            'downloads' => $data['downloads'] ?? 0,
            'project_url' => 'https://modrinth.com/mod/'.($data['slug'] ?? ''),
            'supported_versions' => $data['versions'] ?? $data['game_versions'] ?? [],
            'supported_loaders' => $this->extractModrinthLoaders($data),
            'last_updated' => $data['date_modified'] ?? $data['updated'] ?? null,
            'categories' => $data['categories'] ?? [],
        ];
    }

    /**
     * Normalize CurseForge API response to unified format.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function normalizeCurseforge(array $data): array
    {
        return [
            'external_id' => (string) ($data['id'] ?? ''),
            'external_slug' => $data['slug'] ?? '',
            'name' => $data['name'] ?? '',
            'summary' => $data['summary'] ?? '',
            'author' => $data['authors'][0]['name'] ?? 'Unknown',
            'icon_url' => $data['logo']['thumbnailUrl'] ?? null,
            'downloads' => $data['downloadCount'] ?? 0,
            'project_url' => $data['links']['websiteUrl'] ?? '',
            'supported_versions' => $this->extractCurseforgeVersions($data),
            'supported_loaders' => $this->extractCurseforgeLoaders($data),
            'last_updated' => $data['dateModified'] ?? null,
            'categories' => $this->extractCurseforgeCategories($data),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string>
     */
    private function extractModrinthLoaders(array $data): array
    {
        $loaders = [];
        $categories = $data['categories'] ?? $data['loaders'] ?? [];

        $knownLoaders = ['forge', 'fabric', 'quilt', 'neoforge', 'rift', 'liteloader'];

        foreach ($categories as $category) {
            $lower = strtolower($category);
            if (in_array($lower, $knownLoaders)) {
                $loaders[] = $lower;
            }
        }

        return array_unique($loaders);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string>
     */
    private function extractCurseforgeVersions(array $data): array
    {
        return collect($data['latestFilesIndexes'] ?? [])
            ->pluck('gameVersion')
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string>
     */
    private function extractCurseforgeLoaders(array $data): array
    {
        $loaderMap = [
            1 => 'forge',
            4 => 'fabric',
            5 => 'quilt',
            6 => 'neoforge',
        ];

        return collect($data['latestFilesIndexes'] ?? [])
            ->pluck('modLoader')
            ->filter()
            ->unique()
            ->map(fn ($id) => $loaderMap[$id] ?? null)
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string>
     */
    private function extractCurseforgeCategories(array $data): array
    {
        return collect($data['categories'] ?? [])
            ->pluck('name')
            ->filter()
            ->values()
            ->all();
    }
}
