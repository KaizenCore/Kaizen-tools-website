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
        Schema::create('mod_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mod_id')->constrained()->cascadeOnDelete();
            $table->string('platform');
            $table->string('external_id');
            $table->string('external_slug');
            $table->string('project_url');
            $table->unsignedBigInteger('downloads')->default(0);
            $table->decimal('rating', 3, 2)->nullable();
            $table->string('latest_version')->nullable();
            $table->json('supported_versions')->nullable();
            $table->json('supported_loaders')->nullable();
            $table->json('raw_data')->nullable();
            $table->timestamps();

            $table->unique(['mod_id', 'platform']);
            $table->unique(['platform', 'external_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mod_sources');
    }
};
