<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('channels', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_id')->default(1);
            $table->string('featured_video_url');
            $table->string('url')->nullable();
            $table->text('origin_object')->nullable();
            $table->string('channelid')->nullable();
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->string('medium_thumbnail_url')->nullable();
            $table->string('featured_image_url')->nullable();
            $table->dateTime('last_updated')->nullable();
            $table->boolean('is_auto_active')->default(true);
            $table->boolean('is_active')->default(false);
            $table->dateTime('created')->nullable();
            $table->dateTime('modified')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('channels');
    }
};
