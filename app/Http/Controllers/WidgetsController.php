<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Video;
use Illuminate\View\View;

class WidgetsController extends Controller
{
    /**
     * @param  string  $ids  = 1_2_3
     */
    public function show($ids): View
    {
        $idsArray = explode('_', $ids);
        $idk = array_rand($idsArray, 1);
        $id = $idsArray[$idk];

        $channel = Channel::findOrFail($id);

        $videos = Video::active()->byLiveBroadcasting()->where('channel_id', $id)->inRandomOrder()->paginate(9);

        return view('widgets.show', [
            'videos' => $videos,
            'channel' => $channel,
        ]);
    }
}
