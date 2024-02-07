<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\View\View;

class VideosController extends Controller
{
    public function index(Request $request): View
    {
        $query = $request->input('query');
        $channelId = $request->input('channel_id');

        $videoModel = empty($channelId) ? new Video() : Video::where('channel_id', $channelId);

        if (! empty($query)) {
            $videoModel = $videoModel->search($query);
        }

        $videos = $videoModel->paginate(36);

        return view('videos.index', [
            'videos' => $videos,
            'query' => $query,
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
