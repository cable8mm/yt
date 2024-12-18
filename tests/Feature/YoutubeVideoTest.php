<?php

namespace Tests\Feature;

use App\Support\YoutubeVideo;
use Cable8mm\Youtube\Facades\Youtube;
use Database\Seeders\ChannelSeeder;
use Tests\TestCase;

class YoutubeVideoTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_factory_make_by_url(): void
    {
        if (config('yt.do_youtube_key_test')) {
            $url = ChannelSeeder::$featuredVideoUrl;

            $expect = YoutubeVideo::makeByUrl($url);

            $this->assertNotEmpty($expect);
        } else {
            $this->assertTrue(true);
        }
    }

    public function test_factory_make_by_id(): void
    {
        if (config('yt.do_youtube_key_test')) {
            $videoId = ChannelSeeder::$seedVideoId;

            $expect = YoutubeVideo::makeById($videoId);

            $this->assertNotEmpty($expect);
        } else {
            $this->assertTrue(true);
        }
    }

    public function test_factory_make_from_list(): void
    {
        if (config('yt.do_youtube_key_test')) {
            $videos = Youtube::searchChannelVideos('', ChannelSeeder::$seedChannelId, 1, 'date', ['id', 'snippet'], now())['results'];

            foreach ($videos as $video) {
                $expect = YoutubeVideo::make($video);

                $this->assertNotEmpty($expect);
            }
        } else {
            $this->assertTrue(true);
        }
    }
}
