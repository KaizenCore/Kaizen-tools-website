<?php

namespace App\Http\Controllers\ResourcePacks;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResourcePacks\ResourcePackIndexRequest;
use App\Services\ResourcePacks\ResourcePackService;
use Inertia\Inertia;
use Inertia\Response;

class ResourcePackController extends Controller
{
    public function __construct(
        private ResourcePackService $resourcePackService
    ) {}

    public function index(ResourcePackIndexRequest $request): Response
    {
        $page = (int) $request->input('page', 1);
        $perPage = 24;
        $offset = ($page - 1) * $perPage;

        $results = $this->resourcePackService->search(
            query: $request->search,
            version: $request->version,
            sort: $request->sort ?? 'downloads',
            order: $request->order ?? 'desc',
            limit: $perPage,
            offset: $offset
        );

        $totalHits = $results['total_hits'] ?? 0;
        $lastPage = (int) ceil($totalHits / $perPage);

        $paginatedData = [
            'data' => $results['hits'] ?? [],
            'links' => [
                'first' => url('/resource-packs?page=1'),
                'last' => url("/resource-packs?page={$lastPage}"),
                'prev' => $page > 1 ? url('/resource-packs?page='.($page - 1)) : null,
                'next' => $page < $lastPage ? url('/resource-packs?page='.($page + 1)) : null,
            ],
            'meta' => [
                'current_page' => $page,
                'from' => $offset + 1,
                'last_page' => $lastPage,
                'per_page' => $perPage,
                'to' => min($offset + $perPage, $totalHits),
                'total' => $totalHits,
                'path' => url('/resource-packs'),
                'links' => [],
            ],
        ];

        return Inertia::render('resource-packs/index', [
            'resourcePacks' => $paginatedData,
            'filters' => $request->only(['search', 'version', 'sort', 'order']),
        ]);
    }

    public function show(string $slug): Response
    {
        $resourcePack = $this->resourcePackService->getResourcePack($slug);

        if (! $resourcePack) {
            abort(404, 'Resource pack not found');
        }

        $versions = $this->resourcePackService->getVersions($resourcePack['id']);

        return Inertia::render('resource-packs/show', [
            'resourcePack' => $resourcePack,
            'versions' => $versions,
        ]);
    }
}
