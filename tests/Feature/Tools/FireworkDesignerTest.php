<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.firework-designer'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/firework-designer/index')
    );
});
