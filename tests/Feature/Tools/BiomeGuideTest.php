<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.biome-guide'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/biome-guide/index')
    );
});
