<?php

namespace Database\Seeders;

use App\Models\Channel;
use Illuminate\Database\Seeder;

class ChannelSeeder extends Seeder
{
    private $featuredVideoUrl = 'https://www.youtube.com/watch?v=djV11Xbc914';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Channel::factory()->state([
            'featured_video_url' => $this->featuredVideoUrl,
        ])->create();
    }
}
