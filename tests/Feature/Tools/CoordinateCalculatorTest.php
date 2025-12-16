<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.coordinate-calculator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/coordinate-calculator/index')
    );
});
