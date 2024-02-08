<?php

namespace App\View\Components\Layout;

use App\Models\Channel;
use App\Models\Page;
use App\Models\Video;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Footer extends Component
{
    private Collection $partners;

    private int $videoCount;

    private Collection $pages;

    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        $this->partners = Channel::active()->ordered()->get();

        $this->videoCount = Video::count();

        $this->pages = Page::active()->localed()->ordered()->get();
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.layout.footer', [
            'partners' => $this->partners,
            'videoCount' => $this->videoCount,
            'pages' => $this->pages,
        ]);
    }
}
