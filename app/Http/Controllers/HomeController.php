<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Video;

class HomeController extends Controller
{
    public function index()
    {
        $videos = Video::active()->ordered()->paginate(20);
        $feturedVideos = Video::active()->byLiveBroadCasting(false)->ordered()->take(10)->get();
        $ongoingChannels = Channel::withCount('videos')->where('videos_count', '>', 0)->active()->ordered()->get();
        $futureChannels = Channel::withCount('videos')->where('videos_count', 0)->active();

        return view('home', [
            'videos' => $videos,
            'feturedVideos' => $feturedVideos,
            'ongoingChannels' => $ongoingChannels,
            'futureChannels' => $futureChannels,
        ]);
    }
}
