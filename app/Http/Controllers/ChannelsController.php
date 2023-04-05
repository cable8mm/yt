<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Video;

class ChannelsController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $channels = Channel::where('is_active', 1)->paginate(12);

        return view('channels.index', ['channels' => $channels]);
    }

    public function show($id)
    {
        $channel = Channel::where('id', $id)->firstOrFail();
        $videos = Video::where('is_active', 1)->where('channel_id', $id)->orderBy('published', 'desc')->paginate(24);

        return view('channels.show', ['videos' => $videos, 'channel' => $channel]);
    }
}
