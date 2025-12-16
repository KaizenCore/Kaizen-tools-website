<?php

namespace App\Console\Commands;

use App\Jobs\RefreshModFromApi;
use App\Models\Mod;
use Illuminate\Console\Command;

class ModsMaintenance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mods:maintenance
                            {--stale-hours=24 : Hours after which a mod is considered stale}
                            {--limit=100 : Maximum number of mods to refresh per run}
                            {--sync : Actually dispatch refresh jobs (dry-run by default)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refresh stale mod data from APIs and perform maintenance tasks';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $staleHours = (int) $this->option('stale-hours');
        $limit = (int) $this->option('limit');
        $shouldSync = $this->option('sync');

        $this->info('Starting mods maintenance...');
        $this->newLine();

        // Find stale mods
        $staleMods = Mod::query()
            ->with('sources')
            ->where(function ($query) use ($staleHours) {
                $query->whereNull('last_synced_at')
                    ->orWhere('last_synced_at', '<', now()->subHours($staleHours));
            })
            ->orderBy('total_downloads', 'desc') // Prioritize popular mods
            ->limit($limit)
            ->get();

        $this->info("Found {$staleMods->count()} stale mods (not synced in {$staleHours}+ hours)");

        if ($staleMods->isEmpty()) {
            $this->info('All mods are up to date!');

            return self::SUCCESS;
        }

        // Show table of stale mods
        $this->table(
            ['ID', 'Name', 'Slug', 'Downloads', 'Last Synced', 'Sources'],
            $staleMods->map(fn (Mod $mod) => [
                $mod->id,
                substr($mod->name, 0, 30),
                $mod->slug,
                number_format($mod->total_downloads),
                $mod->last_synced_at?->diffForHumans() ?? 'Never',
                $mod->sources->pluck('platform')->implode(', '),
            ])
        );

        if (! $shouldSync) {
            $this->newLine();
            $this->warn('Dry-run mode. Use --sync to actually refresh mods.');

            return self::SUCCESS;
        }

        // Dispatch refresh jobs
        $this->newLine();
        $bar = $this->output->createProgressBar($staleMods->count());
        $bar->start();

        $dispatched = 0;
        foreach ($staleMods as $mod) {
            RefreshModFromApi::dispatch($mod)->onQueue('default');
            $dispatched++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Dispatched {$dispatched} refresh jobs to the queue.");

        // Show summary
        $this->newLine();
        $this->table(
            ['Metric', 'Value'],
            [
                ['Total mods in database', Mod::count()],
                ['Stale mods found', $staleMods->count()],
                ['Refresh jobs dispatched', $dispatched],
                ['Stale threshold', "{$staleHours} hours"],
            ]
        );

        return self::SUCCESS;
    }
}
