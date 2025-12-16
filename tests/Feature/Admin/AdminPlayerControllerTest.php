<?php

use App\Enums\TrustLevel;
use App\Models\Player;
use App\Models\PlayerReport;
use App\Models\User;

test('admin can view players index', function () {
    $admin = User::factory()->admin()->create();
    Player::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.players.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/players/index')
        ->has('players', 3)
        ->has('pagination')
        ->has('filters')
    );
});

test('admin can search players by username', function () {
    $admin = User::factory()->admin()->create();
    Player::factory()->create(['username' => 'TargetPlayer']);
    Player::factory()->create(['username' => 'OtherPlayer']);

    $response = $this->actingAs($admin)->get(route('admin.players.index', ['search' => 'Target']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->has('players', 1)
    );
});

test('admin can filter players by trust level', function () {
    $admin = User::factory()->admin()->create();
    Player::factory()->create(['trust_level' => TrustLevel::Trusted]);
    Player::factory()->create(['trust_level' => TrustLevel::Suspect]);
    Player::factory()->create(['trust_level' => TrustLevel::Suspect]);

    $response = $this->actingAs($admin)->get(route('admin.players.index', ['trust_level' => 'suspect']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->has('players', 2)
    );
});

test('admin can view player details', function () {
    $admin = User::factory()->admin()->create();
    $player = Player::factory()->create();
    PlayerReport::factory()->count(2)->create(['player_id' => $player->id]);

    $response = $this->actingAs($admin)->get(route('admin.players.show', $player));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/players/show')
        ->has('player')
        ->has('reports', 2)
    );
});

test('admin can override player trust level', function () {
    $admin = User::factory()->admin()->create();
    $player = Player::factory()->create(['trust_level' => TrustLevel::Unknown]);

    $response = $this->actingAs($admin)->postJson(route('admin.players.override', $player), [
        'trust_level' => 'suspect',
        'notes' => 'Known scammer from other servers.',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'message' => 'Trust level override applied successfully.',
    ]);

    $player->refresh();
    expect($player->trust_level)->toBe(TrustLevel::Suspect);
    expect($player->admin_override)->toBeTrue();
    expect($player->admin_notes)->toBe('Known scammer from other servers.');
    expect($player->admin_override_by)->toBe($admin->id);
});

test('admin can remove trust level override', function () {
    $admin = User::factory()->admin()->create();
    $player = Player::factory()->create([
        'trust_level' => TrustLevel::Suspect,
        'admin_override' => true,
        'admin_override_by' => $admin->id,
        'admin_notes' => 'Manual override',
    ]);

    $response = $this->actingAs($admin)->deleteJson(route('admin.players.removeOverride', $player));

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'message' => 'Override removed. Trust score recalculated.',
    ]);

    $player->refresh();
    expect($player->admin_override)->toBeFalse();
    expect($player->admin_override_by)->toBeNull();
});

test('admin can recalculate all trust scores', function () {
    $admin = User::factory()->admin()->create();
    Player::factory()->count(5)->create();

    $response = $this->actingAs($admin)->postJson(route('admin.players.recalculateAll'));

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
    ]);
    expect($response->json('message'))->toContain('5 players');
});

test('override requires valid trust level', function () {
    $admin = User::factory()->admin()->create();
    $player = Player::factory()->create();

    $response = $this->actingAs($admin)->postJson(route('admin.players.override', $player), [
        'trust_level' => 'invalid_level',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('trust_level');
});

test('override notes are optional', function () {
    $admin = User::factory()->admin()->create();
    $player = Player::factory()->create();

    $response = $this->actingAs($admin)->postJson(route('admin.players.override', $player), [
        'trust_level' => 'trusted',
    ]);

    $response->assertSuccessful();
});

test('non-admin cannot override player trust level', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $player = Player::factory()->create();

    $response = $this->actingAs($user)->postJson(route('admin.players.override', $player), [
        'trust_level' => 'suspect',
    ]);

    $response->assertForbidden();
});
