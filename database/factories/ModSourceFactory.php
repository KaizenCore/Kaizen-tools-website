<?php

namespace Database\Factories;

use App\Enums\ModPlatform;
use App\Models\Mod;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ModSource>
 */
class ModSourceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $platform = fake()->randomElement(ModPlatform::cases());
        $slug = fake()->slug(2);

        return [
            'mod_id' => Mod::factory(),
            'platform' => $platform,
            'external_id' => fake()->unique()->uuid(),
            'external_slug' => $slug,
            'project_url' => $platform === ModPlatform::Modrinth
                ? "https://modrinth.com/mod/{$slug}"
                : "https://www.curseforge.com/minecraft/mc-mods/{$slug}",
            'downloads' => fake()->numberBetween(100, 5000000),
            'rating' => fake()->optional()->randomFloat(2, 1, 5),
            'latest_version' => fake()->semver(),
            'supported_versions' => fake()->randomElements(['1.20.4', '1.20.1', '1.19.4', '1.19.2', '1.18.2'], rand(1, 4)),
            'supported_loaders' => fake()->randomElements(['forge', 'fabric', 'quilt', 'neoforge'], rand(1, 3)),
            'raw_data' => null,
        ];
    }

    public function modrinth(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => ModPlatform::Modrinth,
            'project_url' => "https://modrinth.com/mod/{$attributes['external_slug']}",
        ]);
    }

    public function curseforge(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => ModPlatform::Curseforge,
            'project_url' => "https://www.curseforge.com/minecraft/mc-mods/{$attributes['external_slug']}",
        ]);
    }
}
