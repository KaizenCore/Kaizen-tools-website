<?php

namespace App\Providers;

use App\Services\ModAggregator\CurseForgeClient;
use App\Services\ModAggregator\ModrinthClient;
use App\Services\SkinExplorer\MojangClient;
use App\Services\SkinExplorer\SkinService;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ModrinthClient::class, function () {
            return new ModrinthClient(
                config('services.modrinth.user_agent', 'ModAggregator/1.0')
            );
        });

        $this->app->singleton(CurseForgeClient::class, function () {
            return new CurseForgeClient(
                config('services.curseforge.api_key', '')
            );
        });

        $this->app->singleton(MojangClient::class, function () {
            return new MojangClient;
        });

        $this->app->singleton(SkinService::class, function ($app) {
            return new SkinService(
                $app->make(MojangClient::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
