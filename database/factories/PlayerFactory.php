<?php

namespace Database\Factories;

use App\Enums\TrustLevel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Player>
 */
class PlayerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => fake()->uuid(),
            'username' => fake()->unique()->regexify('[A-Za-z0-9_]{3,16}'),
            'trust_level' => TrustLevel::Unknown,
            'trust_score' => 100,
            'admin_override' => false,
        ];
    }

    public function trusted(): static
    {
        return $this->state(fn (array $attributes) => [
            'trust_level' => TrustLevel::Trusted,
            'trust_score' => fake()->numberBetween(80, 100),
        ]);
    }

    public function neutral(): static
    {
        return $this->state(fn (array $attributes) => [
            'trust_level' => TrustLevel::Neutral,
            'trust_score' => fake()->numberBetween(40, 79),
        ]);
    }

    public function suspect(): static
    {
        return $this->state(fn (array $attributes) => [
            'trust_level' => TrustLevel::Suspect,
            'trust_score' => fake()->numberBetween(1, 39),
        ]);
    }
}
