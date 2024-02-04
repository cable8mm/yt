<?php

namespace App\View\Components\Layout;

use App\Models\Channel;
use App\Models\Video;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Navigation extends Component
{
    private Collection $channels;

    private int $videoCount;

    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        $this->channels = Channel::active()->ordered()->get();

        $this->videoCount = Video::count();
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.layout.navigation', [
            'channels' => $this->channels,
            'videoCount' => $this->videoCount,
        ]);
    }
}
