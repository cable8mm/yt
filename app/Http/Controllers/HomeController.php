<?php

namespace App\Http\Controllers;

use App\Models\Video;

class HomeController extends Controller
{
    /*
    *
     * Create a new controller instance.
     *
     * @return void

    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $videos = Video::where('is_active', 1)->orderBy('published', 'desc')->paginate(18);

        $feturedVideos = Video::where('is_active', 1)->where('is_live_broadcasting', 0)->orderBy('published', 'desc')->take(10)->get();

        return view('home', ['videos' => $videos, 'feturedVideos' => $feturedVideos]);
    }
}
