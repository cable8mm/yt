<?php

namespace App\Http\Controllers;

use App\Models\LiveVideo;
use App\Models\Video;
use Illuminate\Http\Request;

class LivesController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $liveVideos = LiveVideo::where('is_active', '=', 1)->where('scheduled_end_time', '>', date('Y-m-d H:i:s'))->orderBy('scheduled_start_time', 'asc')->paginate(18);

        $pastVideos = LiveVideo::where('is_active', '=', 1)->where('scheduled_end_time', '<=', date('Y-m-d H:i:s'))->orderBy('scheduled_start_time', 'asc')->paginate(18);

        return view('lives.index', ['liveVideos' => $liveVideos, 'pastVideos' => $pastVideos]);
    }

    public function show($videoId)
    {
        // $youtube    = new Youtube('AIzaSyAH6pKwtkziZbtxBcF_EZnrYPickntDJvc');
        // $video = $youtube->getVideoInfo($id);
        $video = LiveVideo::where('id', '=', $videoId)->where('is_active', '=', 1)->firstOrFail();
        // if ($video === null) {
        //     return response()->
        // }
        $channelVideos = Video::where('channel_id', $video->channel_id)->where('is_active', '=', 1)->where('id', '<>', $videoId)->orderBy('published', 'desc')->take(5)->get();

        return view('lives.show', ['video' => $video, 'channelVideos' => $channelVideos]);
    }
}
