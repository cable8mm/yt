<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Video;

class WidgetsController extends Controller
{
    /*
    *
     * Create a new controller instance.
     *
     * @return void
    */
    public function __construct()
    {
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function show($ids)  // $ids = 1_2_3
    {
        $idsArray = explode('_', $ids);
        $idk = array_rand($idsArray, 1);
        $id = $idsArray[$idk];
        $channel = Channel::where('id', $id)->firstOrFail();
        $videos = Video::where('is_active', 1)->where('is_live_broadcasting', 0)->where('channel_id', $id)->inRandomOrder()->paginate(9);

        return view('widgets.show', ['videos' => $videos, 'channel' => $channel]);
    }
}
