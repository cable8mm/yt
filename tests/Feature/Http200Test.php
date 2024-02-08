<?php

namespace Tests\Feature;

use App\Enums\LocaleEnum;
use App\Models\Channel;
use App\Models\Page;
use App\Models\Video;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mcamara\LaravelLocalization\LaravelLocalization;
use Tests\TestCase;

class Http200Test extends TestCase
{
    use RefreshDatabase;

    protected function refreshApplicationWithLocale($locale)
    {
        self::tearDown();
        putenv(LaravelLocalization::ENV_ROUTE_KEY.'='.$locale);
        self::setUp();
    }

    protected function tearDown(): void
    {
        putenv(LaravelLocalization::ENV_ROUTE_KEY);
        parent::tearDown();
    }

    public function test_home_should_response_200(): void
    {
        $this->get('/')->assertStatus(200);

        $this->refreshApplicationWithLocale('en');
        $this->get('/en')->assertStatus(200);

        $this->refreshApplicationWithLocale('ko');
        $this->get('/ko')->assertStatus(200);
    }

    public function test_video_should_response_200(): void
    {
        $this->get('/videos')->assertStatus(200);

        $this->refreshApplicationWithLocale('en');
        $this->get('/en/videos')->assertStatus(200);

        $this->refreshApplicationWithLocale('ko');
        $this->get('/ko/videos')->assertStatus(200);
    }

    public function test_video_show_should_response_200(): void
    {
        $channel = Channel::factory()->create();

        $video = Video::factory()->for(Channel::factory()->create())->create();

        $this->get(route('video.show', $video->id))->assertStatus(200);
    }

    public function test_video_show_should_response_200_en(): void
    {
        $this->refreshApplicationWithLocale('en');

        $channel = Channel::factory()->create();

        $video = Video::factory()->for(Channel::factory()->create())->create();

        $this->get(route('video.show', $video->id))->assertStatus(200);
    }

    public function test_video_show_should_response_200_ko(): void
    {
        $this->refreshApplicationWithLocale('ko');

        $channel = Channel::factory()->create();

        $video = Video::factory()->for(Channel::factory()->create())->create();

        $this->get(route('video.show', $video->id))->assertStatus(200);
    }

    public function test_channel_should_response_200(): void
    {
        $this->get('/channels')->assertStatus(200);

        $this->refreshApplicationWithLocale('en');
        $this->get('/en/channels')->assertStatus(200);

        $this->refreshApplicationWithLocale('ko');
        $this->get('/ko/channels')->assertStatus(200);
    }

    public function test_channel_show_should_response_200(): void
    {
        $channel = Channel::factory()->create();

        $this->get(route('channel.show', $channel->id))->assertStatus(200);
    }

    public function test_channel_show_should_response_200_en(): void
    {
        $this->refreshApplicationWithLocale('en');

        $channel = Channel::factory()->create();

        $this->get(route('channel.show', $channel->id))->assertStatus(200);
    }

    public function test_channel_show_should_response_200_ko(): void
    {
        $this->refreshApplicationWithLocale('ko');

        $channel = Channel::factory()->create();

        $this->get(route('channel.show', $channel->id))->assertStatus(200);
    }

    public function test_page_show_should_response_200(): void
    {
        $page = Page::factory()->create();

        $this->get(route('page.show', $page->slug))->assertStatus(200);
    }

    public function test_page_show_should_response_200_en(): void
    {
        $this->refreshApplicationWithLocale('en');

        $page = Page::factory()->state([
            'locale' => LocaleEnum::en->name,
        ])->create();

        $this->get(route('page.show', $page->slug))->assertStatus(200);
    }

    public function test_page_show_should_response_200_kr(): void
    {
        $this->refreshApplicationWithLocale('ko');

        $page = Page::factory()->state([
            'locale' => LocaleEnum::ko->name,
        ])->create();

        $this->get(route('page.show', $page->slug))->assertStatus(200);
    }
}
