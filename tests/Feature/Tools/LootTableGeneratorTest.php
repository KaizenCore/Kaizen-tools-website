<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.loot-table-generator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/loot-table-generator/index')
    );
});
