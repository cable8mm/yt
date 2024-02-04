<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Video;
use Illuminate\View\View;

class ChannelsController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $channels = Channel::active()->paginate(12);

        return view('channels.index', [
            'channels' => $channels,
        ]);
    }

    public function show(Channel $channel): View
    {
        $videos = Video::active()->where('channel_id', $channel->id)->ordered()->paginate(24);

        return view('channels.show', [
            'videos' => $videos,
            'channel' => $channel,
        ]);
    }
}
