<?php

namespace App\Http\Controllers;

use App\Models\LiveVideo;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\View\View;

class LivesController extends Controller
{
    public function index(Request $request): View
    {
        $liveVideos = LiveVideo::active()->where('scheduled_end_time', '>', date('Y-m-d H:i:s'))->orderBy('scheduled_start_time', 'asc')->paginate(18);

        $pastVideos = LiveVideo::active()->where('scheduled_end_time', '<=', date('Y-m-d H:i:s'))->orderBy('scheduled_start_time', 'asc')->paginate(18);

        return view('lives.index', [
            'liveVideos' => $liveVideos,
            'pastVideos' => $pastVideos,
        ]);
    }

    public function show($videoId): View
    {
        $video = LiveVideo::where('id', '=', $videoId)->active()->firstOrFail();

        $channelVideos = Video::where('channel_id', $video->channel_id)->active()->where('id', '<>', $videoId)->orderBy('published_at', 'desc')->take(5)->get();

        return view('lives.show', [
            'video' => $video,
            'channelVideos' => $channelVideos,
        ]);
    }
}
