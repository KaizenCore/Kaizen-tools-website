<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->string('uuid', 36)->unique();
            $table->string('username', 16);
            $table->string('trust_level')->default('unknown'); // trusted, neutral, suspect, unknown
            $table->unsignedTinyInteger('trust_score')->default(100);
            $table->boolean('admin_override')->default(false);
            $table->timestamp('admin_override_at')->nullable();
            $table->foreignId('admin_override_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->index('username');
            $table->index('trust_level');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
