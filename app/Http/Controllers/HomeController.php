<?php

namespace App\Http\Controllers;

use App\Models\Video;

class HomeController extends Controller
{
    public function index()
    {
        $videos = Video::active()->ordered()->paginate(18);
        $feturedVideos = Video::active()->byLiveBroadCasting(false)->ordered()->take(10)->get();

        return view('home', [
            'videos' => $videos,
            'feturedVideos' => $feturedVideos,
        ]);
    }
}
