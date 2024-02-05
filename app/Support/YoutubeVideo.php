<?php

namespace App\Support;

use App\Traits\ArrayAccessOffset;
use App\Traits\ArrayToObject;
use App\Traits\Makeable;
use ArrayAccess;
use Cable8mm\Youtube\Facades\Youtube;
use Illuminate\Support\Carbon;
use InvalidArgumentException;
use stdClass;

class YoutubeVideo implements ArrayAccess
{
    use ArrayAccessOffset;
    use ArrayToObject;
    use Makeable;

    private array $container = [];

    public function __construct(stdClass $video)
    {
        $videoId = $video->id->videoId ?? $video->id;

        if (empty($videoId)) {
            throw new InvalidArgumentException();
        }

        $tags = isset($video->snippet->tags) ? implode(',', $video->snippet->tags) : null;

        $this->container = [
            'channel_id' => $video->snippet->channelId,
            'id' => $videoId,
            'title' => $video->snippet->title,
            'description' => $video->snippet->description,
            'thumbnail_url' => $video->snippet->thumbnails->default->url,
            'medium_thumbnail_url' => $video->snippet->thumbnails->medium->url,
            'featured_image_url' => $video->snippet->thumbnails->standard->url ?? $video->snippet->thumbnails->high->url,
            'embed_html' => $video->player->embedHtml ?? self::embed($videoId),
            'tag' => $tags,
            'duration' => $video->contentDetails->duration ?? null,
            'license' => $video->status->license ?? null,
            'published' => Carbon::create($video->snippet->publishedAt),
        ];
    }

    private static function embed($videoId): string
    {
        return '<iframe width="480" height="270" src="//www.youtube.com/embed/'.$videoId.'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    }

    public static function makeByUrl(string $url): YoutubeVideo
    {
        $videoId = Youtube::parseVidFromURL($url);

        $video = Youtube::getVideoInfo($videoId);

        return static::make($video);
    }

    public static function makeById(string $id): YoutubeVideo
    {
        $video = Youtube::getVideoInfo($id);

        return static::make($video);
    }
}
