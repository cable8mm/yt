<?php

use App\Enums\LocaleEnum;
use App\Enums\MindRuleEnum;
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
        Schema::create('minds', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 2)->default(LocaleEnum::kDefault());
            $table->string('title', 191);
            $table->string('sub_title', 191)->nullable();
            $table->text('content')->nullable();
            $table->string('matching_rule', 20)->default(MindRuleEnum::kDefault());
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('minds');
    }
};
