<?php

namespace Database\Seeders;

use App\Models\Channel;
use Illuminate\Database\Seeder;

class ChannelSeeder extends Seeder
{
    public static string $featuredVideoUrl = 'https://www.youtube.com/watch?v=djV11Xbc914';

    public static string $seedVideoId = 'rie-hPVJ7Sw';

    public static string $seedChannelId = 'UCk1SpWNzOs4MYmr0uICEntg';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Channel::factory()->state([
            'featured_video_url' => self::$featuredVideoUrl,
        ])->create();
    }
}
