# SkinExplorer Services

This package provides services to fetch Minecraft player skins and profile data from Mojang's official APIs.

## Services

### MojangClient

Low-level client for interacting with Mojang's APIs.

**Methods:**
- `getUuidByUsername(string $username): ?array` - Get UUID data by Minecraft username
- `getProfileByUuid(string $uuid): ?array` - Get profile with skin data by UUID
- `getProfileByUsername(string $username): ?array` - Get profile directly by username (combines both API calls)

### SkinService

High-level service with caching and convenient methods for working with Minecraft skins.

**Methods:**
- `getSkinByUsername(string $username): ?array` - Get skin data with caching (60 min TTL)
- `getSkinByUuid(string $uuid): ?array` - Get skin data by UUID with caching
- `getUuidByUsername(string $username): ?string` - Get UUID with long-term caching (7 days)
- `clearCacheForUsername(string $username): void` - Clear cache for a username
- `clearCacheForUuid(string $uuid): void` - Clear cache for a UUID
- `getBatchSkinsByUsernames(array $usernames): array` - Batch fetch multiple skins
- `playerExists(string $username): bool` - Check if a player exists

## Usage Examples

### Basic Usage

```php
use App\Services\SkinExplorer\SkinService;

// Inject the service
public function __construct(private SkinService $skinService) {}

// Get skin data by username
$skinData = $this->skinService->getSkinByUsername('Notch');

if ($skinData) {
    echo "Username: {$skinData['username']}\n";
    echo "UUID: {$skinData['uuid']}\n";
    echo "Skin URL: {$skinData['skin_url']}\n";
    echo "Cape URL: {$skinData['cape_url']}\n";
    echo "Model: " . ($skinData['slim'] ? 'Slim (Alex)' : 'Classic (Steve)') . "\n";
}
```

### Response Structure

```php
[
    'username' => 'Notch',
    'uuid' => '069a79f444e94726a5befca90e38aaf5',
    'skin_url' => 'http://textures.minecraft.net/texture/abc123...',
    'cape_url' => 'http://textures.minecraft.net/texture/def456...', // or null
    'slim' => false, // true for Alex model (3px arms), false for Steve model (4px arms)
]
```

### Check if Player Exists

```php
if ($this->skinService->playerExists('Notch')) {
    echo "Player exists!";
}
```

### Batch Fetch Multiple Skins

```php
$skins = $this->skinService->getBatchSkinsByUsernames(['Notch', 'jeb_', 'Dinnerbone']);

foreach ($skins as $username => $skinData) {
    if ($skinData) {
        echo "{$username}: {$skinData['skin_url']}\n";
    } else {
        echo "{$username}: Not found\n";
    }
}
```

### Cache Management

```php
// Clear cache for a specific username
$this->skinService->clearCacheForUsername('Notch');

// Clear cache for a specific UUID
$this->skinService->clearCacheForUuid('069a79f444e94726a5befca90e38aaf5');
```

### Using MojangClient Directly

```php
use App\Services\SkinExplorer\MojangClient;

public function __construct(private MojangClient $client) {}

// Get UUID
$uuidData = $this->client->getUuidByUsername('Notch');
// Returns: ['id' => '069a79f444e94726a5befca90e38aaf5', 'name' => 'Notch']

// Get profile with base64-encoded texture data
$profile = $this->client->getProfileByUuid('069a79f444e94726a5befca90e38aaf5');
```

## API Rate Limits

Mojang's APIs have rate limits:
- General limit: 600 requests per 10 minutes
- Profile endpoint: Same profile can be requested once per minute
- The services include caching to help avoid rate limits

## Error Handling

All methods handle errors gracefully:
- Returns `null` when a player is not found (404)
- Returns `null` on rate limit errors (429)
- Returns `null` on other API errors (403, 500, etc.)
- Logs errors with context for debugging

## Current API Issues (as of January 2025)

Note: Mojang's UUID endpoint is currently experiencing reliability issues with frequent 403 errors due to misconfiguration. This is handled gracefully by the service.

## API Documentation

- Username to UUID: `https://api.mojang.com/users/profiles/minecraft/{username}`
- UUID to Profile: `https://sessionserver.mojang.com/session/minecraft/profile/{uuid}`
- Texture data is base64-encoded in the profile's properties array

## Testing

Comprehensive test coverage is available:
- `tests/Unit/Services/SkinExplorer/MojangClientTest.php` - Tests for MojangClient
- `tests/Unit/Services/SkinExplorer/SkinServiceTest.php` - Tests for SkinService

Run tests:
```bash
php artisan test --filter=MojangClientTest
php artisan test --filter=SkinServiceTest
```
