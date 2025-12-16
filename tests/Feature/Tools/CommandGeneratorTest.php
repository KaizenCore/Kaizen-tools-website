<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.command-generator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/command-generator/index')
    );
});
