<?php

use App\Models\User;

test('admin can access admin routes', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertSuccessful();
});

test('non-admin user cannot access admin routes', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertForbidden();
});

test('guest cannot access admin routes', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect(route('login'));
});

test('non-admin user gets 403 on json request', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $response = $this->actingAs($user)->getJson('/admin');

    $response->assertForbidden();
    $response->assertJson(['message' => 'Unauthorized']);
});

test('admin can access admin players index', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.players.index'));

    $response->assertSuccessful();
});

test('admin can access admin reports index', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.reports.index'));

    $response->assertSuccessful();
});
