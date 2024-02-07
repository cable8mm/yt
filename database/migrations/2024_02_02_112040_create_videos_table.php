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
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('channel_id');
            $table->string('videoid')->unique();
            $table->string('title');
            $table->text('description');
            $table->string('thumbnail_url');
            $table->string('medium_thumbnail_url');
            $table->string('featured_image_url');
            $table->text('embed_html');
            $table->string('tag')->nullable();
            $table->string('duration')->nullable();
            $table->string('license')->nullable();
            $table->boolean('has_caption')->default(false);
            $table->timestamp('published_at');
            $table->boolean('is_active')->default(true);
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
        Schema::dropIfExists('videos');
    }
};
