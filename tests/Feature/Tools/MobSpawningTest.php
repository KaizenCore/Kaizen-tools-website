<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.mob-spawning'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/mob-spawning/index')
    );
});
