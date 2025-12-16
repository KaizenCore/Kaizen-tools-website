<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.tellraw-generator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/tellraw-generator/index')
    );
});
