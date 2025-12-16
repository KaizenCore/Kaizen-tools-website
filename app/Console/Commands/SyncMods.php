<?php

namespace App\Console\Commands;

use App\Enums\ModPlatform;
use App\Jobs\SyncModsFromPlatform;
use Illuminate\Console\Command;

class SyncMods extends Command
{
    protected $signature = 'mods:sync
        {--platform=all : Platform to sync (modrinth, curseforge, or all)}
        {--limit=100 : Number of mods to sync}
        {--sync : Run synchronously instead of dispatching to queue}';

    protected $description = 'Sync mods from external platforms (Modrinth and CurseForge)';

    public function handle(): int
    {
        $platform = $this->option('platform');
        $limit = (int) $this->option('limit');
        $sync = $this->option('sync');

        if ($platform === 'all' || $platform === 'modrinth') {
            if ($sync) {
                $this->info('Syncing from Modrinth...');
                SyncModsFromPlatform::dispatchSync(ModPlatform::Modrinth, $limit);
                $this->info('Modrinth sync completed.');
            } else {
                SyncModsFromPlatform::dispatch(ModPlatform::Modrinth, $limit);
                $this->info('Dispatched Modrinth sync job.');
            }
        }

        if ($platform === 'all' || $platform === 'curseforge') {
            if ($sync) {
                $this->info('Syncing from CurseForge...');
                SyncModsFromPlatform::dispatchSync(ModPlatform::Curseforge, $limit);
                $this->info('CurseForge sync completed.');
            } else {
                SyncModsFromPlatform::dispatch(ModPlatform::Curseforge, $limit);
                $this->info('Dispatched CurseForge sync job.');
            }
        }

        return self::SUCCESS;
    }
}
