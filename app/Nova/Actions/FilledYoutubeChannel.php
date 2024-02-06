<?php

namespace App\Nova\Actions;

use App\Support\YoutubeChannel;
use App\Support\YoutubeVideo;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Fields\ActionFields;
use Laravel\Nova\Http\Requests\NovaRequest;

class FilledYoutubeChannel extends Action
{
    use InteractsWithQueue, Queueable;

    /**
     * Perform the action on the given models.
     *
     * @return mixed
     */
    public function handle(ActionFields $fields, Collection $models)
    {
        foreach ($models as $model) {
            if (empty($model->channelid)) {
                $video = YoutubeVideo::makeByUrl($model->featured_video_url);
                $model->channelid = $video->channel_id;
            }

            $channel = YoutubeChannel::makeById($model->channelid);
            $model->url = $channel->url;
            $model->name = $channel->name;
            $model->description = $channel->description;
            $model->thumbnail_url = $channel->thumbnail_url;
            $model->medium_thumbnail_url = $channel->medium_thumbnail_url;
            $model->featured_image_url = $channel->featured_image_url;
            $model->is_active = true;
            $model->save();
        }
    }

    /**
     * Get the fields available on the action.
     *
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        return [];
    }

    public function name()
    {
        return __('Filled Youtube Channel');
    }
}
