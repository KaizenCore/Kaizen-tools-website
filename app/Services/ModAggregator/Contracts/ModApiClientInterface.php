<?php

namespace App\Services\ModAggregator\Contracts;

interface ModApiClientInterface
{
    /**
     * Search for mods by query.
     *
     * @return array<string, mixed>
     */
    public function search(string $query, int $limit = 20, int $offset = 0): array;

    /**
     * Get a specific project by ID.
     *
     * @return array<string, mixed>|null
     */
    public function getProject(string $id): ?array;

    /**
     * Get multiple projects by IDs.
     *
     * @param  array<string>  $ids
     * @return array<array<string, mixed>>
     */
    public function getProjects(array $ids): array;

    /**
     * Get popular/trending mods.
     *
     * @return array<string, mixed>
     */
    public function getPopular(int $limit = 100): array;
}
