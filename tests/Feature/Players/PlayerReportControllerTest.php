<?php

use App\Enums\ReportStatus;
use App\Enums\ReportType;
use App\Models\Player;
use App\Models\PlayerReport;
use App\Models\User;

test('authenticated user can submit a report', function () {
    $user = User::factory()->create();
    $player = Player::factory()->create();

    $response = $this->actingAs($user)->postJson(route('players.reports.store', $player), [
        'report_type' => 'cheating',
        'reason' => 'This player was using fly hacks on the server.',
        'evidence_url' => 'https://example.com/evidence.png',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'message' => 'Report submitted successfully. Thank you for helping keep the community safe.',
    ]);

    $this->assertDatabaseHas('player_reports', [
        'player_id' => $player->id,
        'reporter_user_id' => $user->id,
        'report_type' => ReportType::Cheating->value,
        'status' => ReportStatus::Pending->value,
    ]);
});

test('guest cannot submit a report', function () {
    $player = Player::factory()->create();

    $response = $this->postJson(route('players.reports.store', $player), [
        'report_type' => 'cheating',
        'reason' => 'This player was using fly hacks on the server.',
    ]);

    $response->assertUnauthorized();
});

test('user cannot submit duplicate report type for same player', function () {
    $user = User::factory()->create();
    $player = Player::factory()->create();

    // Create initial report
    PlayerReport::factory()->create([
        'player_id' => $player->id,
        'reporter_user_id' => $user->id,
        'report_type' => ReportType::Cheating,
    ]);

    // Try to submit duplicate
    $response = $this->actingAs($user)->postJson(route('players.reports.store', $player), [
        'report_type' => 'cheating',
        'reason' => 'Another cheating report.',
    ]);

    $response->assertUnprocessable();
    $response->assertJson([
        'success' => false,
        'message' => 'You have already submitted a report of this type for this player.',
    ]);
});

test('user can submit different report types for same player', function () {
    $user = User::factory()->create();
    $player = Player::factory()->create();

    // Create initial cheating report
    PlayerReport::factory()->create([
        'player_id' => $player->id,
        'reporter_user_id' => $user->id,
        'report_type' => ReportType::Cheating,
    ]);

    // Submit scamming report
    $response = $this->actingAs($user)->postJson(route('players.reports.store', $player), [
        'report_type' => 'scamming',
        'reason' => 'This player scammed me for diamonds.',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
    ]);
});

test('report requires valid report type', function () {
    $user = User::factory()->create();
    $player = Player::factory()->create();

    $response = $this->actingAs($user)->postJson(route('players.reports.store', $player), [
        'report_type' => 'invalid_type',
        'reason' => 'Some reason here.',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('report_type');
});

test('report requires reason with minimum length', function () {
    $user = User::factory()->create();
    $player = Player::factory()->create();

    $response = $this->actingAs($user)->postJson(route('players.reports.store', $player), [
        'report_type' => 'cheating',
        'reason' => 'Too short',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('reason');
});

test('evidence url must be valid url', function () {
    $user = User::factory()->create();
    $player = Player::factory()->create();

    $response = $this->actingAs($user)->postJson(route('players.reports.store', $player), [
        'report_type' => 'cheating',
        'reason' => 'This player was definitely cheating.',
        'evidence_url' => 'not-a-valid-url',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('evidence_url');
});

test('evidence url is optional', function () {
    $user = User::factory()->create();
    $player = Player::factory()->create();

    $response = $this->actingAs($user)->postJson(route('players.reports.store', $player), [
        'report_type' => 'toxicity',
        'reason' => 'This player was extremely toxic in chat.',
    ]);

    $response->assertSuccessful();
});

test('all report types are valid', function () {
    $user = User::factory()->create();
    $player = Player::factory()->create();

    foreach (ReportType::cases() as $type) {
        $response = $this->actingAs($user)->postJson(route('players.reports.store', $player), [
            'report_type' => $type->value,
            'reason' => 'A valid reason that is long enough.',
        ]);

        $response->assertSuccessful();

        // Delete so we can submit again
        PlayerReport::where('player_id', $player->id)
            ->where('reporter_user_id', $user->id)
            ->where('report_type', $type)
            ->delete();
    }
});
