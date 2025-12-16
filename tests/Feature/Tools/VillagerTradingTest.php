<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.villager-trading'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/villager-trading/index')
    );
});
