<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Skin>
 */
class SkinFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $uuid = fake()->uuid();
        $username = fake()->userName();

        return [
            'uuid' => $uuid,
            'username' => $username,
            'skin_url' => "https://crafatar.com/skins/{$uuid}",
            'cape_url' => fake()->optional(0.3)->passthrough("https://crafatar.com/capes/{$uuid}"),
            'skin_type' => fake()->randomElement(['classic', 'slim']),
        ];
    }

    public function withCape(): static
    {
        return $this->state(fn (array $attributes) => [
            'cape_url' => "https://crafatar.com/capes/{$attributes['uuid']}",
        ]);
    }

    public function classic(): static
    {
        return $this->state(fn (array $attributes) => [
            'skin_type' => 'classic',
        ]);
    }

    public function slim(): static
    {
        return $this->state(fn (array $attributes) => [
            'skin_type' => 'slim',
        ]);
    }
}
