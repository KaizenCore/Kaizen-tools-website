<?php

use App\Enums\ReportStatus;
use App\Enums\ReportType;
use App\Models\Player;
use App\Models\PlayerReport;
use App\Models\User;

test('admin can view reports index', function () {
    $admin = User::factory()->admin()->create();
    PlayerReport::factory()->count(3)->pending()->create();

    $response = $this->actingAs($admin)->get(route('admin.reports.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/reports/index')
        ->has('reports', 3)
        ->has('pagination')
        ->has('filters')
        ->has('stats')
    );
});

test('admin can filter reports by status', function () {
    $admin = User::factory()->admin()->create();
    PlayerReport::factory()->count(2)->pending()->create();
    PlayerReport::factory()->count(3)->verified()->create();

    $response = $this->actingAs($admin)->get(route('admin.reports.index', ['status' => 'verified']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->has('reports', 3)
    );
});

test('admin can filter reports by type', function () {
    $admin = User::factory()->admin()->create();
    PlayerReport::factory()->create(['report_type' => ReportType::Cheating, 'status' => ReportStatus::Pending]);
    PlayerReport::factory()->create(['report_type' => ReportType::Cheating, 'status' => ReportStatus::Pending]);
    PlayerReport::factory()->create(['report_type' => ReportType::Scamming, 'status' => ReportStatus::Pending]);

    $response = $this->actingAs($admin)->get(route('admin.reports.index', ['report_type' => 'cheating']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->has('reports', 2)
    );
});

test('admin can verify a report', function () {
    $admin = User::factory()->admin()->create();
    $report = PlayerReport::factory()->pending()->create();

    $response = $this->actingAs($admin)->postJson(route('admin.reports.review', $report), [
        'status' => 'verified',
        'notes' => 'Evidence confirmed cheating behavior.',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'message' => 'Report reviewed successfully.',
    ]);

    $report->refresh();
    expect($report->status)->toBe(ReportStatus::Verified);
    expect($report->reviewed_by)->toBe($admin->id);
    expect($report->reviewed_at)->not->toBeNull();
    expect($report->admin_notes)->toBe('Evidence confirmed cheating behavior.');
});

test('admin can reject a report', function () {
    $admin = User::factory()->admin()->create();
    $report = PlayerReport::factory()->pending()->create();

    $response = $this->actingAs($admin)->postJson(route('admin.reports.review', $report), [
        'status' => 'rejected',
        'notes' => 'Insufficient evidence.',
    ]);

    $response->assertSuccessful();

    $report->refresh();
    expect($report->status)->toBe(ReportStatus::Rejected);
});

test('admin can resolve a report', function () {
    $admin = User::factory()->admin()->create();
    $report = PlayerReport::factory()->verified()->create();

    $response = $this->actingAs($admin)->postJson(route('admin.reports.review', $report), [
        'status' => 'resolved',
    ]);

    $response->assertSuccessful();

    $report->refresh();
    expect($report->status)->toBe(ReportStatus::Resolved);
});

test('verifying a report updates player trust score', function () {
    $admin = User::factory()->admin()->create();
    $player = Player::factory()->create(['trust_score' => 100, 'trust_level' => \App\Enums\TrustLevel::Unknown]);
    $report = PlayerReport::factory()->pending()->create([
        'player_id' => $player->id,
        'report_type' => ReportType::Cheating,
    ]);

    $response = $this->actingAs($admin)->postJson(route('admin.reports.review', $report), [
        'status' => 'verified',
    ]);

    $response->assertSuccessful();

    $player->refresh();
    // After a verified cheating report, trust score should decrease
    expect($player->trust_score)->toBeLessThan(100);
});

test('admin can bulk review reports', function () {
    $admin = User::factory()->admin()->create();
    $reports = PlayerReport::factory()->count(3)->pending()->create();

    $response = $this->actingAs($admin)->postJson(route('admin.reports.bulkReview'), [
        'report_ids' => $reports->pluck('id')->toArray(),
        'status' => 'rejected',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'message' => '3 reports reviewed successfully.',
    ]);

    foreach ($reports as $report) {
        $report->refresh();
        expect($report->status)->toBe(ReportStatus::Rejected);
        expect($report->reviewed_by)->toBe($admin->id);
    }
});

test('bulk review requires at least one report', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->postJson(route('admin.reports.bulkReview'), [
        'report_ids' => [],
        'status' => 'verified',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('report_ids');
});

test('bulk review requires valid status', function () {
    $admin = User::factory()->admin()->create();
    $reports = PlayerReport::factory()->count(2)->pending()->create();

    $response = $this->actingAs($admin)->postJson(route('admin.reports.bulkReview'), [
        'report_ids' => $reports->pluck('id')->toArray(),
        'status' => 'invalid_status',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('status');
});

test('bulk verify updates trust scores for affected players', function () {
    $admin = User::factory()->admin()->create();
    $player = Player::factory()->create(['trust_score' => 100, 'trust_level' => \App\Enums\TrustLevel::Unknown]);
    $reports = PlayerReport::factory()->count(2)->pending()->create([
        'player_id' => $player->id,
        'report_type' => ReportType::Scamming,
    ]);

    $response = $this->actingAs($admin)->postJson(route('admin.reports.bulkReview'), [
        'report_ids' => $reports->pluck('id')->toArray(),
        'status' => 'verified',
    ]);

    $response->assertSuccessful();

    $player->refresh();
    // After two verified scamming reports, trust score should decrease significantly
    expect($player->trust_score)->toBeLessThan(50);
});

test('review requires valid status', function () {
    $admin = User::factory()->admin()->create();
    $report = PlayerReport::factory()->pending()->create();

    $response = $this->actingAs($admin)->postJson(route('admin.reports.review', $report), [
        'status' => 'invalid_status',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('status');
});

test('review notes are optional', function () {
    $admin = User::factory()->admin()->create();
    $report = PlayerReport::factory()->pending()->create();

    $response = $this->actingAs($admin)->postJson(route('admin.reports.review', $report), [
        'status' => 'verified',
    ]);

    $response->assertSuccessful();
});

test('non-admin cannot review reports', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $report = PlayerReport::factory()->pending()->create();

    $response = $this->actingAs($user)->postJson(route('admin.reports.review', $report), [
        'status' => 'verified',
    ]);

    $response->assertForbidden();
});

test('non-admin cannot bulk review reports', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $reports = PlayerReport::factory()->count(2)->pending()->create();

    $response = $this->actingAs($user)->postJson(route('admin.reports.bulkReview'), [
        'report_ids' => $reports->pluck('id')->toArray(),
        'status' => 'verified',
    ]);

    $response->assertForbidden();
});

test('reports index shows correct stats', function () {
    $admin = User::factory()->admin()->create();
    PlayerReport::factory()->count(5)->pending()->create();
    PlayerReport::factory()->count(3)->verified()->create();
    PlayerReport::factory()->count(2)->rejected()->create();

    $response = $this->actingAs($admin)->get(route('admin.reports.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('stats.pending', 5)
        ->where('stats.verified', 3)
        ->where('stats.rejected', 2)
    );
});
