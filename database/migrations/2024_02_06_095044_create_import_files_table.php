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
        Schema::create('import_files', function (Blueprint $table) {
            $table->id();
            $table->string('memo', 191);
            $table->string('type', 20);
            $table->string('attachment', 191);
            $table->string('attachment_name', 191);
            $table->string('attachment_size', 100)->nullable();
            $table->string('status', 20)->default('ready')->comment('channel and video');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_files');
    }
};
