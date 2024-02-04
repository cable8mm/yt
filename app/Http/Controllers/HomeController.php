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
        $channels = Channel::active()->ordered()->get();

        return view('home', [
            'videos' => $videos,
            'feturedVideos' => $feturedVideos,
            'channels' => $channels,
        ]);
    }
}
