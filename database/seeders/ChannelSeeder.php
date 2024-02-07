<?php

namespace Database\Seeders;

use App\Models\Channel;
use Illuminate\Database\Seeder;

class ChannelSeeder extends Seeder
{
    public static string $featuredVideoUrl = 'https://www.youtube.com/watch?v=fxJNfxIu0p0';

    public static string $seedVideoId = 'fxJNfxIu0p0';

    public static string $seedChannelId = 'UCNgEhs22fJzCTvl99AHlg7A';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Channel::factory()->state([
            'featured_video_url' => self::$featuredVideoUrl,
            'is_active' => true,
        ])->create();
    }
}
