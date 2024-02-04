<?php

namespace App\View\Components\Home\Top;

use App\Models\Channel;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;
use Illuminate\View\Component;

class PartnerChannels extends Component
{
    private Collection $partners;

    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        $this->partners = Channel::active()->ordered()->get();
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.home.top.partner-channels', [
            'partners' => $this->partners,
        ]);
    }
}
