<?php

use App\Services\ResourcePacks\ResourcePackService;

test('index page displays resource packs', function () {
    $mockService = $this->mock(ResourcePackService::class);
    $mockService->shouldReceive('search')
        ->once()
        ->andReturn([
            'hits' => [
                [
                    'id' => 'test-pack',
                    'slug' => 'test-pack',
                    'name' => 'Test Resource Pack',
                    'summary' => 'A test resource pack',
                    'author' => 'TestAuthor',
                    'icon_url' => null,
                    'downloads' => 1000,
                    'formatted_downloads' => '1.0K',
                    'followers' => 50,
                    'updated_at' => now()->toISOString(),
                    'published_at' => now()->toISOString(),
                    'categories' => ['decoration'],
                    'game_versions' => ['1.20.1'],
                    'gallery' => [],
                    'project_url' => 'https://modrinth.com/resourcepack/test-pack',
                ],
            ],
            'total_hits' => 1,
            'offset' => 0,
            'limit' => 24,
        ]);

    $response = $this->get(route('resource-packs.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('resource-packs/index')
        ->has('resourcePacks.data', 1)
        ->where('resourcePacks.data.0.name', 'Test Resource Pack')
    );
});

test('index page handles search query', function () {
    $mockService = $this->mock(ResourcePackService::class);
    $mockService->shouldReceive('search')
        ->with('faithful', null, 'downloads', 'desc', 24, 0)
        ->once()
        ->andReturn([
            'hits' => [],
            'total_hits' => 0,
            'offset' => 0,
            'limit' => 24,
        ]);

    $response = $this->get(route('resource-packs.index', ['search' => 'faithful']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('resource-packs/index')
        ->where('filters.search', 'faithful')
    );
});

test('index page handles version filter', function () {
    $mockService = $this->mock(ResourcePackService::class);
    $mockService->shouldReceive('search')
        ->with(null, '1.20.1', 'downloads', 'desc', 24, 0)
        ->once()
        ->andReturn([
            'hits' => [],
            'total_hits' => 0,
            'offset' => 0,
            'limit' => 24,
        ]);

    $response = $this->get(route('resource-packs.index', ['version' => '1.20.1']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('filters.version', '1.20.1')
    );
});

test('index page handles sort parameter', function () {
    $mockService = $this->mock(ResourcePackService::class);
    $mockService->shouldReceive('search')
        ->with(null, null, 'updated', 'desc', 24, 0)
        ->once()
        ->andReturn([
            'hits' => [],
            'total_hits' => 0,
            'offset' => 0,
            'limit' => 24,
        ]);

    $response = $this->get(route('resource-packs.index', ['sort' => 'updated']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('filters.sort', 'updated')
    );
});

test('index page handles pagination', function () {
    $mockService = $this->mock(ResourcePackService::class);
    $mockService->shouldReceive('search')
        ->with(null, null, 'downloads', 'desc', 24, 24)
        ->once()
        ->andReturn([
            'hits' => [],
            'total_hits' => 50,
            'offset' => 24,
            'limit' => 24,
        ]);

    $response = $this->get(route('resource-packs.index', ['page' => 2]));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('resourcePacks.meta.current_page', 2)
    );
});

test('show page displays resource pack details', function () {
    $mockService = $this->mock(ResourcePackService::class);
    $mockService->shouldReceive('getResourcePack')
        ->with('faithful-32x')
        ->once()
        ->andReturn([
            'id' => 'faithful-id',
            'slug' => 'faithful-32x',
            'name' => 'Faithful 32x',
            'summary' => 'A faithful texture pack',
            'body' => 'Full description here',
            'author' => 'Faithful Team',
            'icon_url' => 'https://example.com/icon.png',
            'downloads' => 5000000,
            'formatted_downloads' => '5.0M',
            'followers' => 1000,
            'updated_at' => now()->toISOString(),
            'published_at' => now()->subYear()->toISOString(),
            'categories' => ['vanilla-like', 'decoration'],
            'game_versions' => ['1.20.1', '1.19.4'],
            'gallery' => [
                ['url' => 'https://example.com/gallery1.png', 'featured' => true],
            ],
            'project_url' => 'https://modrinth.com/resourcepack/faithful-32x',
        ]);

    $mockService->shouldReceive('getVersions')
        ->with('faithful-id')
        ->once()
        ->andReturn([
            [
                'id' => 'version-1',
                'name' => 'Faithful 32x v1.0',
                'version_number' => '1.0.0',
                'game_versions' => ['1.20.1'],
                'downloads' => 1000,
                'date_published' => now()->toISOString(),
                'files' => [
                    [
                        'url' => 'https://example.com/download.zip',
                        'filename' => 'faithful-32x-1.0.0.zip',
                        'primary' => true,
                        'size' => 1024000,
                    ],
                ],
            ],
        ]);

    $response = $this->get(route('resource-packs.show', ['slug' => 'faithful-32x']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('resource-packs/show')
        ->where('resourcePack.name', 'Faithful 32x')
        ->where('resourcePack.slug', 'faithful-32x')
        ->has('versions', 1)
        ->where('versions.0.name', 'Faithful 32x v1.0')
    );
});

test('show page returns 404 for non-existent resource pack', function () {
    $mockService = $this->mock(ResourcePackService::class);
    $mockService->shouldReceive('getResourcePack')
        ->with('non-existent')
        ->once()
        ->andReturn(null);

    $response = $this->get(route('resource-packs.show', ['slug' => 'non-existent']));

    $response->assertNotFound();
});

test('index request validates sort parameter', function () {
    $response = $this->get(route('resource-packs.index', ['sort' => 'invalid']));

    $response->assertSessionHasErrors('sort');
});

test('index request validates order parameter', function () {
    $response = $this->get(route('resource-packs.index', ['order' => 'invalid']));

    $response->assertSessionHasErrors('order');
});

test('index page handles empty results', function () {
    $mockService = $this->mock(ResourcePackService::class);
    $mockService->shouldReceive('search')
        ->once()
        ->andReturn([
            'hits' => [],
            'total_hits' => 0,
            'offset' => 0,
            'limit' => 24,
        ]);

    $response = $this->get(route('resource-packs.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('resourcePacks.data', [])
        ->where('resourcePacks.meta.total', 0)
    );
});
