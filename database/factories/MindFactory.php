<?php

namespace Database\Factories;

use App\Enums\LocaleEnum;
use App\Enums\MindRuleEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mind>
 */
class MindFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'locale' => fake()->randomElement(LocaleEnum::kCases()),
            'title' => fake()->sentence(),
            'sub_title' => fake()->sentence(),
            'content' => implode("\n", fake()->paragraphs()),
            'matching_rule' => fake()->randomElement(MindRuleEnum::kCases()),
            'opened_at' => now(),
            'closed_at' => now()->addMonth(),
            'is_active' => true,
        ];
    }
}
