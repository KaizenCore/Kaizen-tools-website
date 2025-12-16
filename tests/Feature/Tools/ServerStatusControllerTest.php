<?php

use App\Services\MinecraftServer\ServerStatusService;

test('index page renders successfully', function () {
    $response = $this->get(route('tools.server-status.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/server-status/index')
    );
});

test('check endpoint returns online status for valid server', function () {
    $serverStatusService = $this->mock(ServerStatusService::class);
    $serverStatusService->shouldReceive('checkStatus')
        ->with('hypixel.net')
        ->once()
        ->andReturn([
            'success' => true,
            'online' => true,
            'address' => 'hypixel.net',
            'hostname' => 'hypixel.net',
            'port' => 25565,
            'ip' => '172.65.207.107',
            'players' => [
                'online' => 50000,
                'max' => 200000,
                'list' => [],
            ],
            'version' => '1.8.x - 1.21.x',
            'motd' => [
                'raw' => ['Hypixel Network', '[1.8-1.21]'],
                'clean' => ['Hypixel Network', '[1.8-1.21]'],
                'html' => ['<span>Hypixel Network</span>', '<span>[1.8-1.21]</span>'],
            ],
            'icon' => 'data:image/png;base64,iVBORw0KG...',
            'software' => null,
            'protocol' => [
                'version' => 47,
                'name' => '1.8.x',
            ],
        ]);

    $response = $this->postJson(route('api.tools.server-status.check'), [
        'address' => 'hypixel.net',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'online' => true,
        'address' => 'hypixel.net',
    ]);
    $response->assertJsonStructure([
        'success',
        'online',
        'address',
        'hostname',
        'port',
        'ip',
        'players' => ['online', 'max', 'list'],
        'version',
        'motd' => ['raw', 'clean', 'html'],
        'icon',
    ]);
});

test('check endpoint returns offline status for unreachable server', function () {
    $serverStatusService = $this->mock(ServerStatusService::class);
    $serverStatusService->shouldReceive('checkStatus')
        ->with('offline.server.test')
        ->once()
        ->andReturn([
            'success' => true,
            'online' => false,
            'address' => 'offline.server.test',
            'error' => 'Server is offline or unreachable.',
        ]);

    $response = $this->postJson(route('api.tools.server-status.check'), [
        'address' => 'offline.server.test',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'online' => false,
        'address' => 'offline.server.test',
        'error' => 'Server is offline or unreachable.',
    ]);
});

test('check endpoint handles server with custom port', function () {
    $serverStatusService = $this->mock(ServerStatusService::class);
    $serverStatusService->shouldReceive('checkStatus')
        ->with('play.example.com:25566')
        ->once()
        ->andReturn([
            'success' => true,
            'online' => true,
            'address' => 'play.example.com:25566',
            'hostname' => 'play.example.com',
            'port' => 25566,
            'players' => [
                'online' => 10,
                'max' => 20,
                'list' => [],
            ],
            'version' => '1.20.1',
            'motd' => [
                'raw' => ['A Minecraft Server'],
                'clean' => ['A Minecraft Server'],
                'html' => ['<span>A Minecraft Server</span>'],
            ],
        ]);

    $response = $this->postJson(route('api.tools.server-status.check'), [
        'address' => 'play.example.com:25566',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'online' => true,
        'port' => 25566,
    ]);
});

test('check endpoint requires address parameter', function () {
    $response = $this->postJson(route('api.tools.server-status.check'), []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('address');
});

test('check endpoint validates address format', function () {
    $response = $this->postJson(route('api.tools.server-status.check'), [
        'address' => 'invalid@address#with$special%chars',
    ]);

    $response->assertUnprocessable();
    $response->assertJson([
        'success' => false,
        'error' => 'Invalid server address format.',
    ]);
});

test('check endpoint trims whitespace from address', function () {
    $serverStatusService = $this->mock(ServerStatusService::class);
    $serverStatusService->shouldReceive('checkStatus')
        ->with('example.com')
        ->once()
        ->andReturn([
            'success' => true,
            'online' => false,
            'address' => 'example.com',
        ]);

    $response = $this->postJson(route('api.tools.server-status.check'), [
        'address' => '  example.com  ',
    ]);

    $response->assertSuccessful();
});

test('check endpoint accepts address with dashes and dots', function () {
    $serverStatusService = $this->mock(ServerStatusService::class);
    $serverStatusService->shouldReceive('checkStatus')
        ->with('my-server.example-domain.com')
        ->once()
        ->andReturn([
            'success' => true,
            'online' => false,
            'address' => 'my-server.example-domain.com',
        ]);

    $response = $this->postJson(route('api.tools.server-status.check'), [
        'address' => 'my-server.example-domain.com',
    ]);

    $response->assertSuccessful();
});

test('check endpoint validates maximum address length', function () {
    $longAddress = str_repeat('a', 256);

    $response = $this->postJson(route('api.tools.server-status.check'), [
        'address' => $longAddress,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('address');
});
