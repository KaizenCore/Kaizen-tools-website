<?php

use App\Services\SkinExplorer\MojangClient;
use App\Services\SkinExplorer\SkinService;
use Illuminate\Support\Facades\Cache;

use function Pest\Laravel\mock;

beforeEach(function () {
    Cache::flush();
    $this->mockClient = mock(MojangClient::class);
    $this->service = new SkinService($this->mockClient);
});

it('can get skin data by username', function () {
    $profileData = [
        'id' => '069a79f444e94726a5befca90e38aaf5',
        'name' => 'Notch',
        'properties' => [
            [
                'name' => 'textures',
                'value' => base64_encode(json_encode([
                    'textures' => [
                        'SKIN' => [
                            'url' => 'http://textures.minecraft.net/texture/abc123',
                        ],
                    ],
                ])),
            ],
        ],
    ];

    $this->mockClient->shouldReceive('getProfileByUsername')
        ->once()
        ->with('Notch')
        ->andReturn($profileData);

    $result = $this->service->getSkinByUsername('Notch');

    expect($result)->toBeArray()
        ->and($result['username'])->toBe('Notch')
        ->and($result['uuid'])->toBe('069a79f444e94726a5befca90e38aaf5')
        ->and($result['skin_url'])->toBe('http://textures.minecraft.net/texture/abc123')
        ->and($result['cape_url'])->toBeNull()
        ->and($result['slim'])->toBeFalse();
});

it('caches skin data by username', function () {
    $profileData = [
        'id' => '069a79f444e94726a5befca90e38aaf5',
        'name' => 'Notch',
        'properties' => [],
    ];

    $this->mockClient->shouldReceive('getProfileByUsername')
        ->once()
        ->with('Notch')
        ->andReturn($profileData);

    // First call should hit the API
    $result1 = $this->service->getSkinByUsername('Notch');
    // Second call should use cache
    $result2 = $this->service->getSkinByUsername('Notch');

    expect($result1)->toBe($result2);
});

it('can get skin data by UUID', function () {
    $profileData = [
        'id' => '069a79f444e94726a5befca90e38aaf5',
        'name' => 'Notch',
        'properties' => [],
    ];

    $this->mockClient->shouldReceive('getProfileByUuid')
        ->once()
        ->with('069a79f444e94726a5befca90e38aaf5')
        ->andReturn($profileData);

    $result = $this->service->getSkinByUuid('069a79f444e94726a5befca90e38aaf5');

    expect($result)->toBeArray()
        ->and($result['username'])->toBe('Notch')
        ->and($result['uuid'])->toBe('069a79f444e94726a5befca90e38aaf5');
});

it('parses slim model correctly', function () {
    $profileData = [
        'id' => '069a79f444e94726a5befca90e38aaf5',
        'name' => 'TestPlayer',
        'properties' => [
            [
                'name' => 'textures',
                'value' => base64_encode(json_encode([
                    'textures' => [
                        'SKIN' => [
                            'url' => 'http://textures.minecraft.net/texture/def456',
                            'metadata' => [
                                'model' => 'slim',
                            ],
                        ],
                    ],
                ])),
            ],
        ],
    ];

    $this->mockClient->shouldReceive('getProfileByUsername')
        ->once()
        ->with('TestPlayer')
        ->andReturn($profileData);

    $result = $this->service->getSkinByUsername('TestPlayer');

    expect($result['slim'])->toBeTrue();
});

it('parses cape URL correctly', function () {
    $profileData = [
        'id' => '069a79f444e94726a5befca90e38aaf5',
        'name' => 'TestPlayer',
        'properties' => [
            [
                'name' => 'textures',
                'value' => base64_encode(json_encode([
                    'textures' => [
                        'SKIN' => [
                            'url' => 'http://textures.minecraft.net/texture/skin123',
                        ],
                        'CAPE' => [
                            'url' => 'http://textures.minecraft.net/texture/cape456',
                        ],
                    ],
                ])),
            ],
        ],
    ];

    $this->mockClient->shouldReceive('getProfileByUsername')
        ->once()
        ->with('TestPlayer')
        ->andReturn($profileData);

    $result = $this->service->getSkinByUsername('TestPlayer');

    expect($result['cape_url'])->toBe('http://textures.minecraft.net/texture/cape456');
});

it('returns null when player not found', function () {
    $this->mockClient->shouldReceive('getProfileByUsername')
        ->once()
        ->with('NonExistent')
        ->andReturn(null);

    $result = $this->service->getSkinByUsername('NonExistent');

    expect($result)->toBeNull();
});

it('can get UUID by username', function () {
    $this->mockClient->shouldReceive('getUuidByUsername')
        ->once()
        ->with('Notch')
        ->andReturn(['id' => '069a79f444e94726a5befca90e38aaf5', 'name' => 'Notch']);

    $result = $this->service->getUuidByUsername('Notch');

    expect($result)->toBe('069a79f444e94726a5befca90e38aaf5');
});

it('can clear cache for username', function () {
    $profileData = [
        'id' => '069a79f444e94726a5befca90e38aaf5',
        'name' => 'Notch',
        'properties' => [],
    ];

    $this->mockClient->shouldReceive('getProfileByUsername')
        ->twice()
        ->with('Notch')
        ->andReturn($profileData);

    // First call
    $this->service->getSkinByUsername('Notch');

    // Clear cache
    $this->service->clearCacheForUsername('Notch');

    // Second call should hit the API again
    $this->service->getSkinByUsername('Notch');

    expect(true)->toBeTrue();
});

it('can clear cache for UUID', function () {
    $profileData = [
        'id' => '069a79f444e94726a5befca90e38aaf5',
        'name' => 'Notch',
        'properties' => [],
    ];

    $this->mockClient->shouldReceive('getProfileByUuid')
        ->twice()
        ->with('069a79f444e94726a5befca90e38aaf5')
        ->andReturn($profileData);

    // First call
    $this->service->getSkinByUuid('069a79f444e94726a5befca90e38aaf5');

    // Clear cache
    $this->service->clearCacheForUuid('069a79f444e94726a5befca90e38aaf5');

    // Second call should hit the API again
    $this->service->getSkinByUuid('069a79f444e94726a5befca90e38aaf5');

    expect(true)->toBeTrue();
});

it('can batch fetch skins by usernames', function () {
    $profileData1 = [
        'id' => '069a79f444e94726a5befca90e38aaf5',
        'name' => 'Notch',
        'properties' => [],
    ];

    $profileData2 = [
        'id' => '853c80ef3c3749fdaa49938b674adae6',
        'name' => 'jeb_',
        'properties' => [],
    ];

    $this->mockClient->shouldReceive('getProfileByUsername')
        ->once()
        ->with('Notch')
        ->andReturn($profileData1);

    $this->mockClient->shouldReceive('getProfileByUsername')
        ->once()
        ->with('jeb_')
        ->andReturn($profileData2);

    $results = $this->service->getBatchSkinsByUsernames(['Notch', 'jeb_']);

    expect($results)->toBeArray()
        ->and($results)->toHaveKey('Notch')
        ->and($results)->toHaveKey('jeb_')
        ->and($results['Notch']['username'])->toBe('Notch')
        ->and($results['jeb_']['username'])->toBe('jeb_');
});

it('can check if player exists', function () {
    $this->mockClient->shouldReceive('getUuidByUsername')
        ->once()
        ->with('Notch')
        ->andReturn(['id' => '069a79f444e94726a5befca90e38aaf5', 'name' => 'Notch']);

    $exists = $this->service->playerExists('Notch');

    expect($exists)->toBeTrue();
});

it('returns false when player does not exist', function () {
    $this->mockClient->shouldReceive('getUuidByUsername')
        ->once()
        ->with('NonExistent')
        ->andReturn(null);

    $exists = $this->service->playerExists('NonExistent');

    expect($exists)->toBeFalse();
});

it('handles missing properties gracefully', function () {
    $profileData = [
        'id' => '069a79f444e94726a5befca90e38aaf5',
        'name' => 'Notch',
    ];

    $this->mockClient->shouldReceive('getProfileByUsername')
        ->once()
        ->with('Notch')
        ->andReturn($profileData);

    $result = $this->service->getSkinByUsername('Notch');

    expect($result)->toBeArray()
        ->and($result['skin_url'])->toBeNull()
        ->and($result['cape_url'])->toBeNull();
});
