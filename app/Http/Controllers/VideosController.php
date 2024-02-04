<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\View\View;

class VideosController extends Controller
{
    public function index(Request $request): View
    {
        $q = $request->input('q');
        $channelId = $request->input('channel_id');
        $videoModel = Video::active();

        if (! empty($q)) {
            $videoModel = $videoModel->where('title', 'LIKE', '%'.$q.'%');
        }

        if (! empty($channelId)) {
            $videoModel = $videoModel->where('channel_id', '=', $channelId);
        }

        $videos = $videoModel->ordered()->paginate(36);

        return view('videos.index', [
            'videos' => $videos,
            'q' => $q,
            'channelId' => $channelId,
        ]);
    }

    public function show(Video $video): View
    {
        $channelVideos = Video::where('channel_id', $video->channel_id)->active()->where('id', '<>', $video->id)->ordered()->take(5)->get();

        return view('videos.show', [
            'video' => $video,
            'channelVideos' => $channelVideos,
        ]);
    }
}
