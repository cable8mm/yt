<?php

namespace App\Support;

use Alaouy\Youtube\Facades\Youtube;
use App\Traits\ArrayAccessOffset;
use App\Traits\ArrayToObject;
use App\Traits\Makeable;
use ArrayAccess;
use stdClass;

class YoutubeVideo implements ArrayAccess
{
    use ArrayAccessOffset;
    use ArrayToObject;
    use Makeable;

    private array $container = [];

    public function __construct(stdClass $video)
    {
        $this->container = [
            'channel_id' => $video->snippet->channelId,
            'id' => $video->id,
            'title' => $video->snippet->title,
            'description' => $video->snippet->description,
            'thumbnail_url' => $video->snippet->thumbnails->default->url,
            'medium_thumbnail_url' => $video->snippet->thumbnails->medium->url,
            'featured_image_url' => $video->snippet->thumbnails->standard->url,
            'embed_html' => $video->player->embedHtml,
            'tag' => implode(',', $video->snippet->tags) ?? null,
            'duration' => $video->contentDetails->duration,
            'license' => $video->status->license,
            'published' => $video->snippet->publishedAt,
        ];
    }

    public static function makeByUrl(string $url)
    {
        $videoId = Youtube::parseVidFromURL($url);

        $video = Youtube::getVideoInfo($videoId);

        return static::make($video);
    }

    public static function makeById(string $id)
    {
        $video = Youtube::getVideoInfo($id);

        return static::make($video);
    }
}
