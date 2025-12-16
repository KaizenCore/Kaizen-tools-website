<?php

test('fill clone generator page loads successfully', function () {
    $response = $this->get('/tools/fill-clone-generator');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('tools/fill-clone-generator/index'));
});

test('fill clone generator route is publicly accessible', function () {
    $response = $this->get('/tools/fill-clone-generator');

    $response->assertSuccessful();
});

test('fill clone generator has correct named route', function () {
    $url = route('tools.fill-clone-generator');

    expect($url)->toEndWith('/tools/fill-clone-generator');
});
