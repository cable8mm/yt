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
            $table->string('featured_video_url')->nullable()->comment('It make retrive channel information');
            $table->string('url')->nullable();
            $table->string('channelid')->nullable();
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->string('medium_thumbnail_url')->nullable();
            $table->string('featured_image_url')->nullable();
            $table->string('status', 20)->default('ready')->comment('elements consists of ready, waiting, running, failed and finished');
            $table->string('prev_page_token', 20)->nullable();
            $table->boolean('is_past_crawling_done')->default(false);
            $table->boolean('is_active')->default(false);
            $table->timestamps();
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
