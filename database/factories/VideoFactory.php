<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Video>
 */
class VideoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'channel_id' => 1,
            'videoid' => fake()->word(),
            'title' => fake()->sentence(),
            'description' => fake()->sentence(),
            'thumbnail_url' => fake()->image(),
            'medium_thumbnail_url' => fake()->image(),
            'featured_image_url' => fake()->image(),
            'embed_html' => '<p></p>',
            'published_at' => fake()->dateTime(),
            'is_active' => true,
        ];
    }
}
