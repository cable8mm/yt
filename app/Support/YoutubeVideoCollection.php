<?php

namespace App\Support;

use App\Traits\Makeable;
use Cable8mm\Youtube\Facades\Youtube;
use Countable;
use Illuminate\Support\Carbon;
use Iterator;

class YoutubeVideoCollection implements Countable, Iterator
{
    use Makeable;

    /**
     * For Iterator interface
     */
    private int $position = 0;

    /**
     * For data storage and Countable interface
     */
    public array $container = [];

    /**
     * Set video count while youtube api has been called.
     * Why it has existed is for testing infinite calls.
     */
    private int $youtubeFetchCount = 50;

    /**
     * Set max count to prevent infinite call to youtube api.
     */
    private int $maxFetchCount = 10;

    /**
     * Current fetch count. If $maxFetchCount <= $currentFetchCount then calling stop() must be call.
     */
    private int $currentFetchCount = 0;

    public string $channelId;

    /**
     * Set start datetime while youtube api has been called.
     */
    private Carbon $from;

    /**
     * Set end datetime while youtube api has been called.
     */
    private ?Carbon $to;

    /**
     * It depend on whether youtube api is called or not.
     * This property can only control by stop(), and view by isStop().
     * You never view and control directly.
     */
    private bool $keepgoing = true;

    public function __construct(string $channelId, Carbon $from, ?Carbon $to = null)
    {
        $this->channelId = $channelId;
        $this->from = $from;
        $this->to = $to;
        $this->position = 0;
    }

    public function fetch(): static
    {
        while (true) {
            $this->fetchOnce();

            if ($this->isStop()) {
                break;
            }
        }

        return $this;
    }

    /**
     * Fetch from youtube channel videos just one time.
     * Probably privait should be set, because why it is public is for testing.
     */
    public function fetchOnce(): static
    {
        // guard
        if ($this->isStop()) {
            return $this;
        }

        // fetch
        $videos = Youtube::getChannelVideos($this->channelId, $this->youtubeFetchCount, $this->from->toRfc3339String());

        // if last then stop
        if (empty($videos)) {
            $this->stop();

            return $this;
        }

        // merge all videos to container
        foreach ($videos as $video) {
            $this->container[] = YoutubeVideo::make($video);
        }

        // set last time, because next time it must be used as start time for fetching
        $this->from = Carbon::create(end($this->container)->published)->subSecond();

        // increment fetch count
        $this->incrementCurrentFetchCount();

        return $this;
    }

    private function incrementCurrentFetchCount()
    {
        $this->currentFetchCount++;

        if ($this->currentFetchCount >= $this->maxFetchCount) {
            $this->stop();
        }
    }

    public function stop(): static
    {
        $this->keepgoing = false;

        return $this;
    }

    public function isStop()
    {
        return ! $this->keepgoing;
    }

    public function get(): array
    {
        return $this->container;
    }

    public static function makeByFrom(string $channelId, Carbon $from): static
    {
        return static::make($channelId, $from);
    }

    public static function makeByFromTo(string $channelId, Carbon $from, Carbon $to): static
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
