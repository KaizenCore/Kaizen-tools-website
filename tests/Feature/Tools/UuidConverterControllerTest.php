<?php

use App\Services\MinecraftServer\UuidService;

test('index page renders successfully', function () {
    $response = $this->get(route('tools.uuid-converter.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/uuid-converter/index')
    );
});

test('convert endpoint returns data for valid username', function () {
    $uuidService = $this->mock(UuidService::class);
    $uuidService->shouldReceive('convert')
        ->with('Notch')
        ->once()
        ->andReturn([
            'uuid' => '069a79f444e94726a5befca90e38aaf5',
            'username' => 'Notch',
            'uuid_formatted' => '069a79f4-44e9-4726-a5be-fca90e38aaf5',
        ]);

    $response = $this->postJson(route('api.tools.uuid-converter.convert'), [
        'input' => 'Notch',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'data' => [
            'uuid' => '069a79f444e94726a5befca90e38aaf5',
            'username' => 'Notch',
            'uuid_formatted' => '069a79f4-44e9-4726-a5be-fca90e38aaf5',
        ],
    ]);
});

test('convert endpoint returns data for valid UUID without dashes', function () {
    $uuidService = $this->mock(UuidService::class);
    $uuidService->shouldReceive('convert')
        ->with('069a79f444e94726a5befca90e38aaf5')
        ->once()
        ->andReturn([
            'uuid' => '069a79f444e94726a5befca90e38aaf5',
            'username' => 'Notch',
            'uuid_formatted' => '069a79f4-44e9-4726-a5be-fca90e38aaf5',
        ]);

    $response = $this->postJson(route('api.tools.uuid-converter.convert'), [
        'input' => '069a79f444e94726a5befca90e38aaf5',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'data' => [
            'uuid' => '069a79f444e94726a5befca90e38aaf5',
            'username' => 'Notch',
            'uuid_formatted' => '069a79f4-44e9-4726-a5be-fca90e38aaf5',
        ],
    ]);
});

test('convert endpoint returns data for valid UUID with dashes', function () {
    $uuidService = $this->mock(UuidService::class);
    $uuidService->shouldReceive('convert')
        ->with('069a79f4-44e9-4726-a5be-fca90e38aaf5')
        ->once()
        ->andReturn([
            'uuid' => '069a79f444e94726a5befca90e38aaf5',
            'username' => 'Notch',
            'uuid_formatted' => '069a79f4-44e9-4726-a5be-fca90e38aaf5',
        ]);

    $response = $this->postJson(route('api.tools.uuid-converter.convert'), [
        'input' => '069a79f4-44e9-4726-a5be-fca90e38aaf5',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'data' => [
            'uuid' => '069a79f444e94726a5befca90e38aaf5',
            'username' => 'Notch',
            'uuid_formatted' => '069a79f4-44e9-4726-a5be-fca90e38aaf5',
        ],
    ]);
});

test('convert endpoint returns 404 for non-existent player', function () {
    $uuidService = $this->mock(UuidService::class);
    $uuidService->shouldReceive('convert')
        ->with('NonExistentPlayer123456')
        ->once()
        ->andReturn(null);

    $response = $this->postJson(route('api.tools.uuid-converter.convert'), [
        'input' => 'NonExistentPlayer123456',
    ]);

    $response->assertNotFound();
    $response->assertJson([
        'success' => false,
        'message' => 'Player not found. Please check the username or UUID.',
    ]);
});

test('convert endpoint requires input parameter', function () {
    $response = $this->postJson(route('api.tools.uuid-converter.convert'), []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('input');
});

test('convert endpoint validates input minimum length', function () {
    $response = $this->postJson(route('api.tools.uuid-converter.convert'), [
        'input' => '',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('input');
});

test('convert endpoint validates input maximum length', function () {
    $longInput = str_repeat('a', 37);

    $response = $this->postJson(route('api.tools.uuid-converter.convert'), [
        'input' => $longInput,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('input');
});

test('convert endpoint trims whitespace from input', function () {
    $uuidService = $this->mock(UuidService::class);
    $uuidService->shouldReceive('convert')
        ->with('Notch')
        ->once()
        ->andReturn([
            'uuid' => '069a79f444e94726a5befca90e38aaf5',
            'username' => 'Notch',
            'uuid_formatted' => '069a79f4-44e9-4726-a5be-fca90e38aaf5',
        ]);

    $response = $this->postJson(route('api.tools.uuid-converter.convert'), [
        'input' => '  Notch  ',
    ]);

    $response->assertSuccessful();
});
