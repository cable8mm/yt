<?php

namespace App\Nova\Actions;

use App\Enums\StatusEnum;
use App\Models\Channel;
use App\Support\YoutubeVideoCollection;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Fields\ActionFields;
use Laravel\Nova\Http\Requests\NovaRequest;

class AddYoutubeChannelVideos extends Action implements ShouldQueue
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
            $model->status(StatusEnum::running());

            try {
                $youtubeVideoCollection = YoutubeVideoCollection::makeByFrom($model->channelid, now())->fetchOnce()->get();
            } catch (Exception $e) {
                $model->status(StatusEnum::failed());

                $this->markAsFailed($model, $e);
            }

            foreach ($youtubeVideoCollection as $video) {
                try {
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
                            'published_at' => $video->published,
                        ]);
                    }
                } catch (Exception $e) {
                    $model->status(StatusEnum::failed());

                    $this->markAsFailed($model, $e);
                }
            }

            $model->status(StatusEnum::finished());
            $this->markAsFinished($model);
        }

        return $models;
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
