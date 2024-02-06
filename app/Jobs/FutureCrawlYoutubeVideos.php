<?php

namespace App\Jobs;

use App\Models\Channel;
use App\Models\Video;
use App\Support\YoutubeVideoCollection;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class FutureCrawlYoutubeVideos implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $channel = Channel::active()->random()->first();

        try {
            DB::beginTransaction();

            $youtubeVideoCollection = YoutubeVideoCollection::makeByTo($channel->channelid, $channel->youtube_published_after_at)->fetchOnce()->get();

            if (empty($youtubeVideoCollection)) {
                $channel->futureCrawlEnd(now());
            }

            foreach ($youtubeVideoCollection as $video) {
                $videos[] = [
                    'channel_id' => $channel->id,
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
                ];
            }

            // In order to insert massive, It use not a elequent but a query builder for more efficiently.
            Video::insert($videos);

            $channel->update([
                'youtube_published_after_at' => end($youtubeVideoCollection)->published_at,
            ]);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
        }
    }
}
