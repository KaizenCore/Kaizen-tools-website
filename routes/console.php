<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Refresh stale mods every 6 hours
Schedule::command('mods:maintenance --sync --limit=100')
    ->everyFourHours()
    ->withoutOverlapping()
    ->runInBackground();
