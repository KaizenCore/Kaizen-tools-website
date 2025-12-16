<?php

use App\Services\SkinExplorer\MojangClient;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->client = new MojangClient;
});

it('can fetch UUID by username', function () {
    Http::fake([
        'api.mojang.com/users/profiles/minecraft/Notch' => Http::response([
            'id' => '069a79f444e94726a5befca90e38aaf5',
            'name' => 'Notch',
        ], 200),
    ]);

    $result = $this->client->getUuidByUsername('Notch');

    expect($result)->toBeArray()
        ->and($result['id'])->toBe('069a79f444e94726a5befca90e38aaf5')
        ->and($result['name'])->toBe('Notch');
});

it('returns null when username not found', function () {
    Http::fake([
        'api.mojang.com/users/profiles/minecraft/NonExistentPlayer123' => Http::response(null, 404),
    ]);

    $result = $this->client->getUuidByUsername('NonExistentPlayer123');

    expect($result)->toBeNull();
});

it('handles 403 errors gracefully', function () {
    Http::fake([
        'api.mojang.com/users/profiles/minecraft/TestUser' => Http::response(null, 403),
    ]);

    $result = $this->client->getUuidByUsername('TestUser');

    expect($result)->toBeNull();
});

it('can fetch profile by UUID', function () {
    Http::fake([
        'sessionserver.mojang.com/session/minecraft/profile/069a79f444e94726a5befca90e38aaf5' => Http::response([
            'id' => '069a79f444e94726a5befca90e38aaf5',
            'name' => 'Notch',
            'properties' => [
                [
                    'name' => 'textures',
                    'value' => base64_encode(json_encode([
                        'timestamp' => 1234567890,
                        'profileId' => '069a79f444e94726a5befca90e38aaf5',
                        'profileName' => 'Notch',
                        'textures' => [
                            'SKIN' => [
                                'url' => 'http://textures.minecraft.net/texture/abc123',
                            ],
                        ],
                    ])),
                ],
            ],
        ], 200),
    ]);

    $result = $this->client->getProfileByUuid('069a79f444e94726a5befca90e38aaf5');

    expect($result)->toBeArray()
        ->and($result['id'])->toBe('069a79f444e94726a5befca90e38aaf5')
        ->and($result['name'])->toBe('Notch')
        ->and($result['properties'])->toBeArray();
});

it('removes dashes from UUID when fetching profile', function () {
    Http::fake([
        'sessionserver.mojang.com/session/minecraft/profile/069a79f444e94726a5befca90e38aaf5' => Http::response([
            'id' => '069a79f444e94726a5befca90e38aaf5',
            'name' => 'Notch',
        ], 200),
    ]);

    $result = $this->client->getProfileByUuid('069a79f4-44e9-4726-a5be-fca90e38aaf5');

    expect($result)->toBeArray();
});

it('returns null when profile not found', function () {
    Http::fake([
        'sessionserver.mojang.com/session/minecraft/profile/*' => Http::response(null, 404),
    ]);

    $result = $this->client->getProfileByUuid('00000000000000000000000000000000');

    expect($result)->toBeNull();
});

it('handles rate limit errors', function () {
    Http::fake([
        'sessionserver.mojang.com/session/minecraft/profile/*' => Http::response(null, 429),
    ]);

    $result = $this->client->getProfileByUuid('069a79f444e94726a5befca90e38aaf5');

    expect($result)->toBeNull();
});

it('can fetch profile by username directly', function () {
    Http::fake([
        'api.mojang.com/users/profiles/minecraft/Notch' => Http::response([
            'id' => '069a79f444e94726a5befca90e38aaf5',
            'name' => 'Notch',
        ], 200),
        'sessionserver.mojang.com/session/minecraft/profile/069a79f444e94726a5befca90e38aaf5' => Http::response([
            'id' => '069a79f444e94726a5befca90e38aaf5',
            'name' => 'Notch',
            'properties' => [],
        ], 200),
    ]);

    $result = $this->client->getProfileByUsername('Notch');

    expect($result)->toBeArray()
        ->and($result['name'])->toBe('Notch');
});

it('returns null when username does not exist in combined call', function () {
    Http::fake([
        'api.mojang.com/users/profiles/minecraft/NonExistent' => Http::response(null, 404),
    ]);

    $result = $this->client->getProfileByUsername('NonExistent');

    expect($result)->toBeNull();
});
