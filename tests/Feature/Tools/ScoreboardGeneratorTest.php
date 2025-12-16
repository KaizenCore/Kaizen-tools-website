<?php

test('scoreboard generator page can be rendered', function () {
    $response = $this->get('/tools/scoreboard-generator');

    $response->assertOk();
});

test('scoreboard generator route has correct name', function () {
    $routeName = route('tools.scoreboard-generator');

    expect($routeName)->toContain('/tools/scoreboard-generator');
});
