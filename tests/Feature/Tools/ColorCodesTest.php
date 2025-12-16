<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.color-codes'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/color-codes/index')
    );
});
