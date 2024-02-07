<?php

namespace App\View\Components\Widgets;

use App\Models\Channel;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Channels extends Component
{
    private Collection $channels;

    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        $this->channels = Channel::withCount('videos')->hasVideo()->active()->ordered()->get();
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.widgets.channels', [
            'channels' => $this->channels,
        ]);
    }
}
