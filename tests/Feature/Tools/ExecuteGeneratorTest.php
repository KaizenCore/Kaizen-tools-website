<?php

test('execute generator page loads successfully', function () {
    $response = $this->get('/tools/execute-generator');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('tools/execute-generator/index'));
});

test('execute generator route has correct name', function () {
    expect(route('tools.execute-generator'))->toEndWith('/tools/execute-generator');
});
