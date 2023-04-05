<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Video;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests;
    use ValidatesRequests;

    public function __construct()
    {
        $partners = Channel::where('is_active', 1)->orderBy('name')->get();
        view()->share('partners', $partners);
        $videoCount = Video::where('is_active', 1)->count();
        view()->share('videoCount', $videoCount);
    }
}
