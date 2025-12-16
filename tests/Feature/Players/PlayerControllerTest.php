<?php

use App\Models\Player;
use App\Services\SkinExplorer\SkinService;

test('index page displays recent players', function () {
    Player::factory()->count(5)->create();

    $response = $this->get(route('players.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('players/index')
        ->has('recentPlayers', 5)
    );
});

test('show page displays player details for valid username', function () {
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

    $response = $this->get(route('players.show', ['username' => 'Notch']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('players/show')
        ->has('player')
        ->where('player.username', 'Notch')
        ->where('player.uuid', '069a79f4-44e9-4726-a5be-fca90e38aaf5')
        ->has('skinData')
    );

    $this->assertDatabaseHas('players', [
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

    $response = $this->get(route('players.show', ['username' => 'InvalidPlayer123456']));

    $response->assertNotFound();
});

test('search endpoint returns player data for valid username', function () {
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

    $response = $this->getJson(route('api.players.search', ['username' => 'jeb_']));

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'data' => [
            'username' => 'jeb_',
            'uuid' => '853c80ef-3c37-49fd-aa49-938b674adae6',
            'trust_level' => 'unknown',
        ],
    ]);
});

test('search endpoint returns 404 for invalid username', function () {
    $skinService = $this->mock(SkinService::class);
    $skinService->shouldReceive('getSkinByUsername')
        ->with('InvalidPlayer')
        ->once()
        ->andReturn(null);

    $response = $this->getJson(route('api.players.search', ['username' => 'InvalidPlayer']));

    $response->assertNotFound();
    $response->assertJson([
        'success' => false,
        'message' => 'Player not found',
    ]);
});

test('search endpoint validates username length', function () {
    $response = $this->getJson(route('api.players.search', ['username' => 'ab']));

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('username');
});

test('search endpoint requires username parameter', function () {
    $response = $this->getJson(route('api.players.search'));

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('username');
});

test('player trust level is included in response', function () {
    $skinService = $this->mock(SkinService::class);
    $skinService->shouldReceive('getSkinByUsername')
        ->with('TestPlayer')
        ->once()
        ->andReturn([
            'username' => 'TestPlayer',
            'uuid' => '12345678-1234-1234-1234-123456789012',
            'skin_url' => 'http://textures.minecraft.net/texture/test',
            'cape_url' => null,
            'slim' => true,
        ]);

    $response = $this->get(route('players.show', ['username' => 'TestPlayer']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->has('player.trust_level')
        ->has('player.trust_level_label')
    );
});
