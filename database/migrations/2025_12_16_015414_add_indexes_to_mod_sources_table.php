<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mod_sources', function (Blueprint $table) {
            $table->index('platform');
            $table->index('external_slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mod_sources', function (Blueprint $table) {
            $table->dropIndex(['platform']);
            $table->dropIndex(['external_slug']);
        });
    }
};
