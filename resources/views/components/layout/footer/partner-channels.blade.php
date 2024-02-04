<div class="col col-xs-12 col-sm-12 col-md-6 col-lg-6" style="padding-top:10px">
    <h3>{{ __('Channels') }}</h3>
    <ul>
        @foreach($partners as $partner)
        <li><a href="{{ route('channel.show', $partner->id) }}"><img src="{{ $partner->thumbnail_url }}"
                    alt="{{ $partner->name }}" title="{{ $partner->name }}"></a></li>
        @endforeach
    </ul>
</div>
