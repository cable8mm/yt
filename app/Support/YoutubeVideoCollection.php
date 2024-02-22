<?php

namespace App\Support;

use App\Traits\Makeable;
use Cable8mm\Youtube\Facades\Youtube;
use Countable;
use Illuminate\Support\Carbon;
use InvalidArgumentException;
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
     * Pageinfo after fetched
     *
     * [kind] => youtube#searchListResponse
     * [etag] => 3Mu3sIIb1G68FXBk98Lgn_g2mwY
     * [prevPageToken] =>
     * [nextPageToken] => CAEQAA
     * [resultsPerPage] => 1
     * [totalResults] => 448
     */
    public array $info = [];

    /**
     * Set video count while youtube api has been called.
     * Why it has existed is for testing infinite calls.
     */
    private int $youtubeFetchCount = 50;

    public string $channelId;

    /**
     * Set start datetime while youtube api has been called.
     */
    private Carbon $from;

    /**
     * Set end datetime while youtube api has been called.
     */
    private ?Carbon $to;

    private ?string $prevPageToken;

    public function __construct(string $channelId, ?Carbon $from = null, ?Carbon $to = null, ?string $prevPageToken = null)
    {
        if ($from == null && $to == null) {
            throw new InvalidArgumentException();
        }

        $this->channelId = $channelId;
        $this->from = $from;
        $this->to = $to;
        $this->position = 0;
        $this->prevPageToken = $prevPageToken;
    }

    /**
     * Fetch from youtube channel videos just one time.
     * Probably privait should be set, because why it is public is for testing.
     */
    public function fetch(): static
    {
        // fetch
        $videos = $this->from === null ?
            Youtube::getChannelVideos($this->channelId, $this->youtubeFetchCount, $this->to->toRfc3339String(), true, $this->prevPageToken)
            : Youtube::getChannelVideos($this->channelId, $this->youtubeFetchCount, $this->from->toRfc3339String(), false, $this->prevPageToken);

        // if last then stop
        if (empty($videos['results'])) {
            return $this;
        }

        // merge all videos to container
        foreach ($videos['results'] as $video) {
            $this->container[] = YoutubeVideo::make($video);
        }

        $this->info = $videos['info'];

        return $this;
    }

    public function get(): array
    {
        return $this->container;
    }

    public function prevPageToken(): string
    {
        return $this->info['nextPageToken'];
    }

    public function last(): bool
    {
        return $this->count() !== $this->youtubeFetchCount;
    }

    public static function makeByFrom(string $channelId, Carbon $from, ?string $prevPageToken = null): static
    {
        return static::make($channelId, $from, null, $prevPageToken);
    }

    public static function makeByTo(string $channelId, Carbon $to): static
    {
        return static::make($channelId, null, $to);
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
