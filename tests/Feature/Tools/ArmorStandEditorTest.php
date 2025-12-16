<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.armor-stand-editor'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/armor-stand-editor/index')
    );
});
