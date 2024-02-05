<?php

namespace Tests\Feature;

use Tests\TestCase;

class EnvironmentTest extends TestCase
{
    protected $doYoutubeKeyTest;

    protected $appEnv;

    protected function setUp(): void
    {
        parent::setUp();

        $this->doYoutubeKeyTest = config('yt.do_youtube_key_test');

        $this->appEnv = config('app.env');
    }

    public function test_environment(): void
    {
        $this->assertEquals('testing', $this->appEnv);
    }

    public function test_youtube_api_environment(): void
    {
        $this->assertFalse($this->doYoutubeKeyTest);
    }
}
