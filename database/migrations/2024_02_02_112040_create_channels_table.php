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
            $table->unsignedBigInteger('service_id');
            $table->text('origin_object');
            $table->string('channelid');
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->string('url');
            $table->string('thumbnail_url');
            $table->string('medium_thumbnail_url');
            $table->string('featured_image_url');
            $table->dateTime('last_updated')->nullable();
            $table->boolean('is_auto_active')->default(true);
            $table->boolean('is_active')->default(true);
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
