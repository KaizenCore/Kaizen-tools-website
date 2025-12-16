<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.potion-brewing'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/potion-brewing/index')
    );
});
