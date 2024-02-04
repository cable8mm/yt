<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;

class VideosController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = $request->input('q');
        $channelId = $request->input('channel_id');
        $videoModel = Video::where('is_active', '=', 1);
        if (! empty($q)) {
            $videoModel = $videoModel->where('title', 'LIKE', '%'.$q.'%');
        }
        if (! empty($channelId)) {
            $videoModel = $videoModel->where('channel_id', '=', $channelId);
        }

        $videos = $videoModel->orderBy('published_at', 'desc')->paginate(36);

        return view('videos.index', ['videos' => $videos, 'q' => $q, 'channelId' => $channelId]);
    }

    public function show($videoId)
    {
        $video = Video::where('id', '=', $videoId)->where('is_active', '=', 1)->firstOrFail();

        $channelVideos = Video::where('channel_id', $video->channel_id)->where('is_active', '=', 1)->where('id', '<>', $videoId)->orderBy('published_at', 'desc')->take(5)->get();

        return view('videos.show', ['video' => $video, 'channelVideos' => $channelVideos]);
    }
}
