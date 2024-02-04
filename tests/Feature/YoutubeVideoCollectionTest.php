<?php

namespace Tests\Feature;

use Alaouy\Youtube\Facades\Youtube;
use App\Support\YoutubeVideoCollection;
use Database\Seeders\ChannelSeeder;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class YoutubeVideoCollectionTest extends TestCase
{
    public function test_make(): void
    {
        if (config('yt.do_youtube_key_test')) {
            $expected = ChannelSeeder::$seedChannelId;

            $youtubeVideoCollection = YoutubeVideoCollection::make($expected, now());

            $actual = $youtubeVideoCollection->channelId;

            $this->assertEquals($expected, $actual);
        } else {
            $this->assertTrue(true);
        }
    }

    public function test_fetchOne(): void
    {
        if (config('yt.do_youtube_key_test')) {
            $channelId = ChannelSeeder::$seedChannelId;

            $actual = YoutubeVideoCollection::makeByFrom($channelId, now())->fetchOnce()->get();

            $this->assertNotEmpty($actual);
        } else {
            $this->assertTrue(true);
        }
    }

    public function test_youtube_library(): void
    {
        if (config('yt.do_youtube_key_test')) {
            $videos = Youtube::searchChannelVideos('', ChannelSeeder::$seedChannelId, 2, 'date', ['id', 'snippet'], now())['results'];

            $this->assertNotEmpty($videos);
        } else {
            $this->assertTrue(true);
        }
    }

    public function test_fetch_once(): void
    {
        if (config('yt.do_youtube_key_test')) {
            $channelId = ChannelSeeder::$seedChannelId;

            $youtubeVideoCollection = YoutubeVideoCollection::makeByFrom($channelId, now())->fetchOnce()->get();

            $this->assertNotEmpty($youtubeVideoCollection);
        } else {
            $this->assertTrue(true);
        }
    }

    public function test_fetch_all(): void
    {
        if (config('yt.do_youtube_key_test')) {
            $channelId = ChannelSeeder::$seedChannelId;

            $youtubeVideoCollection = YoutubeVideoCollection::makeByFrom($channelId, now())->fetch()->get();

            $this->assertNotEmpty($youtubeVideoCollection);
        } else {
            $this->assertTrue(true);
        }
    }

    public function test_cast_carbon(): void
    {
        $data = '2024-01-28T20:06:51Z';

        $expected = '2024-01-28';

        $actual = Carbon::create($data)->format('Y-m-d');

        $this->assertEquals($expected, $actual);
    }
}