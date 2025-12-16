<?php

test('index page renders successfully', function () {
    $response = $this->get(route('tools.enchantment-calculator'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/enchantment-calculator/index')
    );
});
