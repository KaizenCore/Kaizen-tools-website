<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.advancement-generator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/advancement-generator/index')
    );
});
