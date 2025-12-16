<?php

use App\Enums\ReportStatus;
use App\Enums\ReportType;
use App\Enums\TrustLevel;
use App\Models\Player;
use App\Models\PlayerReport;
use App\Models\User;
use App\Services\TrustScore\TrustScoreService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->service = new TrustScoreService;
});

test('player with no reports has score of 100', function () {
    $player = Player::factory()->create();

    $score = $this->service->calculateScore($player);

    expect($score)->toBe(100);
});

test('verified cheating report reduces score by 25', function () {
    $player = Player::factory()->create();
    PlayerReport::factory()->verified()->cheating()->create([
        'player_id' => $player->id,
    ]);

    $score = $this->service->calculateScore($player->fresh());

    expect($score)->toBe(75);
});

test('verified scamming report reduces score by 30', function () {
    $player = Player::factory()->create();
    PlayerReport::factory()->verified()->scamming()->create([
        'player_id' => $player->id,
    ]);

    $score = $this->service->calculateScore($player->fresh());

    expect($score)->toBe(70);
});

test('pending reports do not affect score', function () {
    $player = Player::factory()->create();
    PlayerReport::factory()->create([
        'player_id' => $player->id,
        'status' => ReportStatus::Pending,
    ]);

    $score = $this->service->calculateScore($player->fresh());

    expect($score)->toBe(100);
});

test('rejected reports do not affect score', function () {
    $player = Player::factory()->create();
    PlayerReport::factory()->rejected()->create([
        'player_id' => $player->id,
    ]);

    $score = $this->service->calculateScore($player->fresh());

    expect($score)->toBe(100);
});

test('multiple verified reports stack', function () {
    $player = Player::factory()->create();

    PlayerReport::factory()->verified()->create([
        'player_id' => $player->id,
        'report_type' => ReportType::Cheating, // -25
    ]);

    PlayerReport::factory()->verified()->create([
        'player_id' => $player->id,
        'report_type' => ReportType::Toxicity, // -10
    ]);

    $score = $this->service->calculateScore($player->fresh());

    expect($score)->toBe(65); // 100 - 25 - 10
});

test('score cannot go below zero', function () {
    $player = Player::factory()->create();

    // Create many verified scamming reports (30 each)
    for ($i = 0; $i < 5; $i++) {
        PlayerReport::factory()->verified()->scamming()->create([
            'player_id' => $player->id,
            'reporter_user_id' => User::factory()->create()->id,
        ]);
    }

    $score = $this->service->calculateScore($player->fresh());

    expect($score)->toBe(0);
});

test('update trust level sets correct level based on score', function () {
    $player = Player::factory()->create([
        'trust_level' => TrustLevel::Unknown,
        'trust_score' => 100,
    ]);

    // Add reports to bring score down
    PlayerReport::factory()->verified()->cheating()->create([
        'player_id' => $player->id,
    ]);
    PlayerReport::factory()->verified()->scamming()->create([
        'player_id' => $player->id,
        'reporter_user_id' => User::factory()->create()->id,
    ]);

    $this->service->updateTrustLevel($player);
    $player->refresh();

    // 100 - 25 - 30 = 45, which is Neutral
    expect($player->trust_level)->toBe(TrustLevel::Neutral);
    expect($player->trust_score)->toBe(45);
});

test('admin override prevents score recalculation', function () {
    $admin = User::factory()->create();
    $player = Player::factory()->create();

    // Set admin override to trusted
    $this->service->setAdminOverride($player, TrustLevel::Trusted, $admin, 'Known good player');

    // Add negative reports
    PlayerReport::factory()->verified()->scamming()->create([
        'player_id' => $player->id,
    ]);

    // Score should remain at override value
    $score = $this->service->calculateScore($player->fresh());
    expect($score)->toBe(100);

    // Update should not change the level
    $this->service->updateTrustLevel($player);
    $player->refresh();

    expect($player->trust_level)->toBe(TrustLevel::Trusted);
});

test('set admin override records admin info', function () {
    $admin = User::factory()->create();
    $player = Player::factory()->create();

    $this->service->setAdminOverride($player, TrustLevel::Suspect, $admin, 'Known bad actor');

    $player->refresh();

    expect($player->admin_override)->toBeTrue();
    expect($player->admin_override_by)->toBe($admin->id);
    expect($player->admin_notes)->toBe('Known bad actor');
    expect($player->trust_level)->toBe(TrustLevel::Suspect);
});

test('remove admin override recalculates score', function () {
    $admin = User::factory()->create();
    $player = Player::factory()->create();

    // Set override
    $this->service->setAdminOverride($player, TrustLevel::Suspect, $admin);

    // Add a verified report
    PlayerReport::factory()->verified()->create([
        'player_id' => $player->id,
        'report_type' => ReportType::Toxicity, // -10
    ]);

    // Remove override
    $this->service->removeAdminOverride($player);
    $player->refresh();

    expect($player->admin_override)->toBeFalse();
    expect($player->admin_override_by)->toBeNull();
    expect($player->trust_score)->toBe(90); // 100 - 10
});

test('trust level from score returns correct levels', function () {
    expect(TrustLevel::fromScore(100))->toBe(TrustLevel::Trusted);
    expect(TrustLevel::fromScore(80))->toBe(TrustLevel::Trusted);
    expect(TrustLevel::fromScore(79))->toBe(TrustLevel::Neutral);
    expect(TrustLevel::fromScore(40))->toBe(TrustLevel::Neutral);
    expect(TrustLevel::fromScore(39))->toBe(TrustLevel::Suspect);
    expect(TrustLevel::fromScore(1))->toBe(TrustLevel::Suspect);
    expect(TrustLevel::fromScore(0))->toBe(TrustLevel::Unknown);
});

test('old reports have reduced impact due to time decay', function () {
    $player = Player::factory()->create();

    // Create a report from 60 days ago
    $report = PlayerReport::factory()->verified()->create([
        'player_id' => $player->id,
        'report_type' => ReportType::Scamming, // -30 at full weight
    ]);

    // Manually set created_at to 60 days ago
    $report->forceFill(['created_at' => now()->subDays(60)])->save();

    $score = $this->service->calculateScore($player->fresh());

    // With 60 days decay, the penalty should be less than 30 but more than 3 (10% of 30)
    expect($score)->toBeGreaterThan(70)->toBeLessThan(100);
});

test('very old reports have minimal impact', function () {
    $player = Player::factory()->create();

    // Create a report from 200 days ago
    $report = PlayerReport::factory()->verified()->create([
        'player_id' => $player->id,
        'report_type' => ReportType::Scamming, // -30 at full weight, -3 at minimum
    ]);

    // Manually set created_at to 200 days ago
    $report->forceFill(['created_at' => now()->subDays(200)])->save();

    $score = $this->service->calculateScore($player->fresh());

    // At 200 days (past 180 day cutoff), should be at minimum 10% penalty
    // 100 - (30 * 0.1) = 97
    expect($score)->toBe(97);
});
