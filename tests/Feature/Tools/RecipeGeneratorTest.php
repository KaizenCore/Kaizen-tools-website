<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.recipe-generator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/recipe-generator/index')
    );
});
