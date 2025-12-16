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
        Schema::create('category_mod', function (Blueprint $table) {
            $table->foreignId('mod_category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('mod_id')->constrained()->cascadeOnDelete();
            $table->primary(['mod_category_id', 'mod_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_mod');
    }
};
