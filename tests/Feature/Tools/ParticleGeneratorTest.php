<?php

it('displays the particle generator page', function () {
    $response = $this->get('/tools/particle-generator');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/particle-generator/index')
    );
});

it('can access particle generator route by name', function () {
    $response = $this->get(route('tools.particle-generator'));

    $response->assertSuccessful();
});
