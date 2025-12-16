<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.target-selector'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/target-selector-generator/index')
    );
});
