<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.sign-book-generator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/sign-book-generator/index')
    );
});
