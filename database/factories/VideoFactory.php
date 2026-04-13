<?php

namespace Database\Factories;

use App\Models\Video;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Video>
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
