<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.redstone-calculator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/redstone-calculator/index')
    );
});
