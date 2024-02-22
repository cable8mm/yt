<?php

namespace App\View\Components\Video;

use App\Models\Channel;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Search extends Component
{
    private Collection $partners;

    private ?string $query;

    private ?string $channelId;

    /**
     * Create a new component instance.
     */
    public function __construct(Request $request)
    {
        $this->query = $request->get('query');

        $this->channelId = $request->get('channel_id');

        $this->partners = Channel::has('videos')->active()->ordered()->get();
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.video.search', [
            'partners' => $this->partners,
            'query' => $this->query,
            'channel_id' => $this->channelId,
        ]);
    }
}
