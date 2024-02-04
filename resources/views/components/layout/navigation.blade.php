<!-- Left Side Of Navbar -->
<ul class="nav navbar-nav">
    <li><a href="{{ url('/videos') }}">Videos({{number_format($videoCount)}})</a></li>
    <li class="dropdown">
        <a href="{{ url('/channels') }}" class="dropdown-toggle" data-toggle="dropdown" role="button"
            aria-haspopup="true" aria-expanded="false">Channels({{count($partners)}}) <span
                class="caret"></span></a>
        <ul class="dropdown-menu">
            @foreach($partners as $partner)
            <li><a href="{{ route('channel.show', $partner->id) }}">{{ $partner->name }}</a></li>
            @endforeach
        </ul>
    </li>
    <li><a href="{{ url('/lives') }}">Live <span class="label label-danger"
                style="margin-top:-4px;">NEW</span></a></li>
</ul>
