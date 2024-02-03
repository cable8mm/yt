<?php

namespace App\Support;

use Alaouy\Youtube\Facades\Youtube;
use App\Traits\Makeable;
use Countable;
use Illuminate\Support\Carbon;
use Iterator;

class YoutubeVideoCollection implements Countable, Iterator
{
    use Makeable;

    private $position = 0;

    const FETCH_COUNT = 2;

    public array $container = [];

    public string $channelId;

    private Carbon $from;

    private ?Carbon $to;

    private $keepgoing = true;

    public function __construct(string $channelId, Carbon $from, ?Carbon $to = null)
    {
        $this->channelId = $channelId;
        $this->from = $from;
        $this->to = $to;
        $this->position = 0;
    }

    public function fetchOnce(): YoutubeVideoCollection
    {
        if (! $this->keepgoing) {
            return $this;
        }

        $videos = Youtube::searchChannelVideos('', $this->channelId, self::FETCH_COUNT, 'date', ['id', 'snippet'], $this->from)['results'];

        if (empty($videos)) {
            $this->stop();

            return $this;
        }

        foreach ($videos as $video) {
            $this->container[] = YoutubeVideo::make($video);
        }

        $this->from = Carbon::create(end($this->container)->published);

        return $this;
    }

    public function stop()
    {
        $this->keepgoing = false;

        return $this;
    }

    public function isStop()
    {
        return ! $this->keepgoing;
    }

    public function fetch(): YoutubeVideoCollection
    {
        while (true) {
            $this->fetchOnce();

            if (! $this->keepgoing) {
                break;
            }
        }

        return $this;
    }

    public function get(): array
    {
        return $this->container;
    }

    public static function makeByFrom(string $channelId, Carbon $from): YoutubeVideoCollection
    {
        return static::make($channelId, $from);
    }

    public static function makeByFromTo(string $channelId, Carbon $from, Carbon $to): YoutubeVideoCollection
    {
        return static::make($channelId, $from, $to);
    }

    /* Methods required for Iterator interface */

    public function rewind(): void
    {
        $this->position = 0;
    }

    #[\ReturnTypeWillChange]
    public function current()
    {
        return $this->container[$this->position];
    }

    #[\ReturnTypeWillChange]
    public function key()
    {
        return $this->position;
    }

    public function next(): void
    {
        $this->position++;
    }

    public function valid(): bool
    {
        return isset($this->container[$this->position]);
    }

    public function count(): int
    {
        return count($this->container);
    }
}
