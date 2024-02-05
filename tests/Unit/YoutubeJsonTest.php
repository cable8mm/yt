<?php

namespace Tests\Unit;

use Carbon\Carbon;
use PHPUnit\Framework\TestCase;

class YoutubeJsonTest extends TestCase
{
    public function test_can_we_cast_carbon_type_from_youtube_api(): void
    {
        $data = '2024-01-28T20:06:51Z';

        $expected = '2024-01-28';

        $actual = Carbon::create($data)->format('Y-m-d');

        $this->assertEquals($expected, $actual);
    }
}
