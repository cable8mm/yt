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
        if (config('yt.do_youtube_key_test')) {
            $channelId = ChannelSeeder::$seedChannelId;

            $expect = YoutubeChannel::makeById($channelId);

            $this->assertNotEmpty($expect);
        } else {
            $this->assertTrue(true);
        }
    }

    public function test_factory_makeByVideo(): void
    {
        if (config('yt.do_youtube_key_test')) {
            $videoId = ChannelSeeder::$seedVideoId;

            $video = YoutubeVideo::makeById($videoId);

            $expect = YoutubeChannel::makeByVideo($video);

            $this->assertNotEmpty($expect);
        } else {
            $this->assertTrue(true);
        }
    }
}
