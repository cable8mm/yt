<?php

namespace App\Support;

use Alaouy\Youtube\Facades\Youtube;
use App\Traits\ArrayAccessOffset;
use App\Traits\ArrayToObject;
use App\Traits\Makeable;
use ArrayAccess;
use stdClass;

class YoutubeChannel implements ArrayAccess
{
    use ArrayAccessOffset;
    use ArrayToObject;
    use Makeable;

    private array $container = [];

    public function __construct(stdClass $channel)
    {
        $this->container = [
            'url' => self::url($channel),
            'id' => $channel->id,
            'name' => $channel->snippet->title,
            'description' => $channel->snippet->description,
            'thumbnail_url' => $channel->snippet->thumbnails->default->url,
            'medium_thumbnail_url' => $channel->snippet->thumbnails->medium->url,
            'featured_image_url' => $channel->snippet->thumbnails->high->url,
        ];
    }

    private static function url(stdClass $channel): string
    {
        return empty($channel->snippet->customUrl) ? 'https://youtube.com/'.$channel->snippet->customUrl : 'https://youtube.com/channel/'.$channel->id;
    }

    public static function makeById(string $id): YoutubeChannel
    {
        $channel = Youtube::getChannelById($id);

        return static::make($channel);
    }

    public static function makeByVideo(YoutubeVideo $video): YoutubeChannel
    {
        return static::makeById($video->channel_id);
    }
}
