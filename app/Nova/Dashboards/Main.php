<?php

namespace App\Nova\Dashboards;

use App\Nova\Metrics\NewVideos;
use App\Nova\Metrics\VideosPerChannel;
use App\Nova\Metrics\VideosPerDay;
use Laravel\Nova\Dashboards\Main as Dashboard;

class Main extends Dashboard
{
    /**
     * Get the cards for the dashboard.
     *
     * @return array
     */
    public function cards()
    {
        return [
            new NewVideos,
            new VideosPerDay,
            new VideosPerChannel,
        ];
    }
}
