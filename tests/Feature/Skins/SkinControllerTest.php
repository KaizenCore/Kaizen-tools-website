<?php

use App\Models\Skin;
use App\Services\SkinExplorer\SkinService;

test('index page displays recent skins', function () {
    Skin::factory()->count(5)->create();

    $response = $this->get(route('skins.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('skins/index')
        ->has('recentSearches.recent', 5)
        ->has('recentSearches.popular', 0)
    );
});

test('show page displays skin details for valid username', function () {
    $skinService = $this->mock(SkinService::class);
    $skinService->shouldReceive('getSkinByUsername')
        ->with('Notch')
        ->once()
        ->andReturn([
            'username' => 'Notch',
            'uuid' => '069a79f4-44e9-4726-a5be-fca90e38aaf5',
            'skin_url' => 'http://textures.minecraft.net/texture/example',
            'cape_url' => null,
            'slim' => false,
        ]);

    $response = $this->get(route('skins.show', ['username' => 'Notch']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('skins/show')
        ->has('skin')
        ->where('skin.username', 'Notch')
        ->where('skin.uuid', '069a79f4-44e9-4726-a5be-fca90e38aaf5')
        ->where('skin.skin_type', 'classic')
    );

    $this->assertDatabaseHas('skins', [
        'username' => 'Notch',
        'uuid' => '069a79f4-44e9-4726-a5be-fca90e38aaf5',
    ]);
});

test('show page returns 404 for invalid username', function () {
    $skinService = $this->mock(SkinService::class);
    $skinService->shouldReceive('getSkinByUsername')
        ->with('InvalidPlayer123456')
        ->once()
        ->andReturn(null);

    $response = $this->get(route('skins.show', ['username' => 'InvalidPlayer123456']));

    $response->assertNotFound();
});

test('search endpoint returns skin data for valid username', function () {
    $skinService = $this->mock(SkinService::class);
    $skinService->shouldReceive('getSkinByUsername')
        ->with('jeb_')
        ->once()
        ->andReturn([
            'username' => 'jeb_',
            'uuid' => '853c80ef-3c37-49fd-aa49-938b674adae6',
            'skin_url' => 'http://textures.minecraft.net/texture/example2',
            'cape_url' => 'http://textures.minecraft.net/texture/cape',
            'slim' => false,
        ]);

    $response = $this->getJson(route('api.skins.search', ['username' => 'jeb_']));

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'data' => [
            'username' => 'jeb_',
            'uuid' => '853c80ef-3c37-49fd-aa49-938b674adae6',
            'skin_type' => 'classic',
        ],
    ]);
});

test('search endpoint returns 404 for invalid username', function () {
    $skinService = $this->mock(SkinService::class);
    $skinService->shouldReceive('getSkinByUsername')
        ->with('InvalidPlayer')
        ->once()
        ->andReturn(null);

    $response = $this->getJson(route('api.skins.search', ['username' => 'InvalidPlayer']));

    $response->assertNotFound();
    $response->assertJson([
        'success' => false,
        'message' => 'Player not found',
    ]);
});

test('search endpoint validates username length', function () {
    $response = $this->getJson(route('api.skins.search', ['username' => 'ab']));

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('username');
});

test('search endpoint requires username parameter', function () {
    $response = $this->getJson(route('api.skins.search'));

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('username');
});

test('show page stores slim skin type correctly', function () {
    $skinService = $this->mock(SkinService::class);
    $skinService->shouldReceive('getSkinByUsername')
        ->with('Alex')
        ->once()
        ->andReturn([
            'username' => 'Alex',
            'uuid' => '12345678-1234-1234-1234-123456789012',
            'skin_url' => 'http://textures.minecraft.net/texture/alex',
            'cape_url' => null,
            'slim' => true,
        ]);

    $response = $this->get(route('skins.show', ['username' => 'Alex']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('skin.skin_type', 'slim')
        ->where('skin.is_slim', true)
    );

    $this->assertDatabaseHas('skins', [
        'username' => 'Alex',
        'skin_type' => 'slim',
    ]);
});
