<?php

it('renders the item generator page', function () {
    $response = $this->get('/tools/item-generator');

    $response->assertSuccessful();
    $response->assertInertia(function ($page) {
        $page->component('tools/item-generator/index');
    });
});

it('has the correct route name', function () {
    $url = route('tools.item-generator');

    expect($url)->toBe(url('/tools/item-generator'));
});

it('displays the item generator page without errors', function () {
    $this->get('/tools/item-generator')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('tools/item-generator/index'));
});
