<?php

namespace App\Nova\Actions;

use App\Models\Channel;
use App\Support\YoutubeVideoCollection;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Fields\ActionFields;
use Laravel\Nova\Http\Requests\NovaRequest;

class AddYoutubeChannelVideos extends Action
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
            $youtubeVideoCollection = YoutubeVideoCollection::makeByFrom($model->channelid, now())->fetchOnce()->get();

            foreach ($youtubeVideoCollection as $video) {
                if ($model instanceof Channel) {
                    $model->videos()->create([
                        'videoid' => $video->id,
                        'title' => $video->title,
                        'description' => $video->description,
                        'thumbnail_url' => $video->thumbnail_url,
                        'medium_thumbnail_url' => $video->medium_thumbnail_url,
                        'featured_image_url' => $video->featured_image_url,
                        'embed_html' => $video->embed_html,
                        'tag' => $video->tag,
                        'duration' => $video->duration,
                        'license' => $video->license,
                        'published' => $video->published,
                    ]);
                }
            }
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
        return __('Add Youtube Channel Videos');
    }
}
