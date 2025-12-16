<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.skin-viewer'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/skin-viewer/index')
    );
});
