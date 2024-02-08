<?php

use App\Enums\LocaleEnum;
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
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 2)->defualt(LocaleEnum::kDefault());
            $table->string('title', 190)->comment('page\'s title');
            $table->string('slug', 50);
            $table->text('content');
            $table->boolean('cansee_in_menu')->default(true)->comment('If true, it can be seen in navigation and footer.');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
