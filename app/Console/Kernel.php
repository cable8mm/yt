<?php

namespace App\Console;

use App\Jobs\FutureCrawlYoutubeVideos;
use App\Jobs\PastCrawlYoutubeVideos;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\App;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->job(new PastCrawlYoutubeVideos)->everyMinute();

        $schedule->job(new FutureCrawlYoutubeVideos)->everyMinute();

        if (App::environment('local')) {
            $schedule->command('telescope:prune')->daily();
        }
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
