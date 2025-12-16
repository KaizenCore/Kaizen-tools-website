<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.crafting-recipes'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/crafting-recipes/index')
    );
});
