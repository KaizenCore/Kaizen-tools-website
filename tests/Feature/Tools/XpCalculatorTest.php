<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.xp-calculator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/xp-calculator/index')
    );
});
