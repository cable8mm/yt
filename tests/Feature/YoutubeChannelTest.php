<?php

namespace Tests\Feature;

use App\Support\YoutubeChannel;
use App\Support\YoutubeVideo;
use Database\Seeders\ChannelSeeder;
use Tests\TestCase;

class YoutubeChannelTest extends TestCase
{
    public function test_factory_makeById(): void
    {
        $channelId = ChannelSeeder::$seedChannelId;

        $expect = YoutubeChannel::makeById($channelId);

        $this->assertNotEmpty($expect);
    }

    public function test_factory_makeByVideo(): void
    {
        $videoId = ChannelSeeder::$seedVideoId;

        $video = YoutubeVideo::makeById($videoId);

        $expect = YoutubeChannel::makeByVideo($video);

        $this->assertNotEmpty($expect);
    }
}
