<?php

namespace Database\Factories;

use App\Enums\LocaleEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Page>
 */
class PageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $locale = fake()->randomElement(LocaleEnum::kCases());

        return [
            'locale' => $locale,
            'title' => fake(LocaleEnum::real($locale))->realText(100),
            'slug' => fake()->slug(),
            'content' => fake(LocaleEnum::real($locale))->realText(5000),
            'cansee_in_menu' => true,
            'is_active' => true,
        ];
    }
}
