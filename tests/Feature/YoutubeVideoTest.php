<?php

namespace Tests\Feature;

use App\Support\YoutubeVideo;
use Database\Seeders\ChannelSeeder;
use Tests\TestCase;

class YoutubeVideoTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_factory_makeByUrl(): void
    {
        $url = ChannelSeeder::$featuredVideoUrl;

        $expect = YoutubeVideo::makeByUrl($url);

        $this->assertNotEmpty($expect);
    }

    public function test_factory_makeById(): void
    {
        $videoId = ChannelSeeder::$seedVideoId;

        $expect = YoutubeVideo::makeById($videoId);

        $this->assertNotEmpty($expect);
    }
}
