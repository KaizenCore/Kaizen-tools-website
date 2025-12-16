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
        Schema::table('mods', function (Blueprint $table) {
            $table->index('author');
            $table->index('total_downloads');
            $table->index('last_updated_at');
            $table->index('last_synced_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mods', function (Blueprint $table) {
            $table->dropIndex(['author']);
            $table->dropIndex(['total_downloads']);
            $table->dropIndex(['last_updated_at']);
            $table->dropIndex(['last_synced_at']);
        });
    }
};
