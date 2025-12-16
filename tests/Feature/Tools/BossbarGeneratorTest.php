<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.bossbar-generator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/bossbar-generator/index')
    );
});
