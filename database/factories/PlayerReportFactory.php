<?php

namespace Database\Factories;

use App\Enums\ReportStatus;
use App\Enums\ReportType;
use App\Models\Player;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PlayerReport>
 */
class PlayerReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'player_id' => Player::factory(),
            'reporter_user_id' => User::factory(),
            'report_type' => fake()->randomElement(ReportType::cases()),
            'reason' => fake()->paragraph(),
            'evidence_url' => fake()->optional(0.5)->url(),
            'status' => ReportStatus::Pending,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::Pending,
        ]);
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::Verified,
            'reviewed_by' => User::factory(),
            'reviewed_at' => now(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::Rejected,
            'reviewed_by' => User::factory(),
            'reviewed_at' => now(),
        ]);
    }

    public function cheating(): static
    {
        return $this->state(fn (array $attributes) => [
            'report_type' => ReportType::Cheating,
        ]);
    }

    public function scamming(): static
    {
        return $this->state(fn (array $attributes) => [
            'report_type' => ReportType::Scamming,
        ]);
    }
}
