<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.flat-world-generator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/flat-world-generator/index')
    );
});
