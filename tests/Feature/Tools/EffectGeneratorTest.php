<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.effect-generator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/effect-generator/index')
    );
});
