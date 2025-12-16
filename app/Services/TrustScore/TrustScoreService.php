<?php

namespace App\Services\TrustScore;

use App\Enums\TrustLevel;
use App\Models\Player;
use App\Models\User;
use Carbon\Carbon;

class TrustScoreService
{
    private const BASE_SCORE = 100;

    private const DECAY_START_DAYS = 30;

    private const DECAY_END_DAYS = 180;

    private const MIN_DECAY_FACTOR = 0.1;

    public function calculateScore(Player $player): int
    {
        if ($player->admin_override) {
            return $player->trust_score;
        }

        $verifiedReports = $player->verifiedReports()->get();

        if ($verifiedReports->isEmpty()) {
            return self::BASE_SCORE;
        }

        $totalPenalty = 0;

        foreach ($verifiedReports as $report) {
            $weight = $report->report_type->weight();
            $decayFactor = $this->calculateDecayFactor($report->created_at);
            $totalPenalty += $weight * $decayFactor;
        }

        $score = max(0, self::BASE_SCORE - (int) $totalPenalty);

        return $score;
    }

    private function calculateDecayFactor(Carbon $reportDate): float
    {
        $daysOld = $reportDate->diffInDays(now());

        if ($daysOld < self::DECAY_START_DAYS) {
            return 1.0;
        }

        if ($daysOld >= self::DECAY_END_DAYS) {
            return self::MIN_DECAY_FACTOR;
        }

        $decayRange = self::DECAY_END_DAYS - self::DECAY_START_DAYS;
        $daysIntoDecay = $daysOld - self::DECAY_START_DAYS;
        $decayProgress = $daysIntoDecay / $decayRange;

        return 1.0 - ($decayProgress * (1.0 - self::MIN_DECAY_FACTOR));
    }

    public function updateTrustLevel(Player $player): Player
    {
        if ($player->admin_override) {
            return $player;
        }

        $score = $this->calculateScore($player);
        $level = TrustLevel::fromScore($score);

        $player->update([
            'trust_score' => $score,
            'trust_level' => $level,
        ]);

        return $player->fresh();
    }

    public function setAdminOverride(Player $player, TrustLevel $level, User $admin, ?string $notes = null): Player
    {
        $player->update([
            'trust_level' => $level,
            'trust_score' => match ($level) {
                TrustLevel::Trusted => 100,
                TrustLevel::Neutral => 60,
                TrustLevel::Suspect => 20,
                TrustLevel::Unknown => 100,
            },
            'admin_override' => true,
            'admin_override_at' => now(),
            'admin_override_by' => $admin->id,
            'admin_notes' => $notes,
        ]);

        return $player->fresh();
    }

    public function removeAdminOverride(Player $player): Player
    {
        $player->update([
            'admin_override' => false,
            'admin_override_at' => null,
            'admin_override_by' => null,
        ]);

        return $this->updateTrustLevel($player);
    }

    public function recalculateAllScores(): int
    {
        $count = 0;

        Player::query()
            ->where('admin_override', false)
            ->chunk(100, function ($players) use (&$count) {
                foreach ($players as $player) {
                    $this->updateTrustLevel($player);
                    $count++;
                }
            });

        return $count;
    }
}
