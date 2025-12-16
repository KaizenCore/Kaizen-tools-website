<?php

it('renders the team generator page', function () {
    $response = $this->get('/tools/team-generator');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/team-generator/index')
    );
});

it('has the correct route name', function () {
    expect(route('tools.team-generator'))->toContain('/tools/team-generator');
});
