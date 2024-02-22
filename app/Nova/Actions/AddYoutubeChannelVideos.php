<?php

namespace App\Nova\Actions;

use App\Enums\StatusEnum;
use App\Models\Channel;
use App\Models\Video;
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
            if ($model->is_past_crawling_done) {
                continue;
            }

            $model->status(StatusEnum::running());

            try {
                $collection = YoutubeVideoCollection::makeByFrom($model->channelid, $model->created_at, $model->prev_page_token)->fetch();

                $youtubeVideoCollection = $collection->get();
            } catch (Exception $e) {
                $model->status(StatusEnum::failed());

                $this->markAsFailed($model, $e);

                return $models;
            }

            $creates = [];

            if (! empty($youtubeVideoCollection)) {
                foreach ($youtubeVideoCollection as $video) {
                    try {
                        if ($model instanceof Channel) {
                            $creates[] = [
                                'channel_id' => $model->id,
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
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                        }
                    } catch (Exception $e) {
                        $model->status(StatusEnum::failed());

                        info($e);

                        $this->markAsFailed($model, $e);
                    }
                }

                Video::insert($creates);
            }

            if ($collection->last()) {
                $model->update([
                    'status' => StatusEnum::finished(),
                    'prev_page_token' => null,
                    'is_past_crawling_done' => true,
                ]);
            } else {
                $model->update([
                    'status' => StatusEnum::finished(),
                    'prev_page_token' => $collection->prevPageToken(),
                ]);
            }

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
