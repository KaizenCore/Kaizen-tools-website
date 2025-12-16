<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.entity-generator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/entity-generator/index')
    );
});
