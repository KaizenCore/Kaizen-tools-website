<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mod>
 */
class ModFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(rand(2, 4), true);

        return [
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'summary' => fake()->sentence(10),
            'description' => fake()->paragraphs(3, true),
            'author' => fake()->userName(),
            'icon_url' => fake()->optional()->imageUrl(128, 128),
            'total_downloads' => fake()->numberBetween(100, 10000000),
            'last_updated_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function popular(): static
    {
        return $this->state(fn (array $attributes) => [
            'total_downloads' => fake()->numberBetween(1000000, 50000000),
        ]);
    }
}
