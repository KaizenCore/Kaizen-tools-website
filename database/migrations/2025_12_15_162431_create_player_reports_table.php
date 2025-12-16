<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('player_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reporter_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('report_type'); // cheating, scamming, toxicity, suspicious_account
            $table->text('reason');
            $table->string('evidence_url')->nullable();
            $table->string('status')->default('pending'); // pending, verified, rejected, resolved
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->index(['player_id', 'status']);
            $table->index('report_type');
            $table->unique(['player_id', 'reporter_user_id', 'report_type'], 'unique_user_report_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_reports');
    }
};
