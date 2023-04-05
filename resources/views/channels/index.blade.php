@extends('layouts.app')
@section('title', '채널 리스트' )

@section('content')
<div class="container-fluid">
    <h1 class="title-ct">Channels</h1>
</div>
<div class="container">
    <div class="row row-xs-2up row-sm-3up row-md-4up row-lg-6up">
        @foreach($channels as $channel)
        <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
            <div class="thumbnail">
                <a href="/channels/{{ $channel->id }}"><img src="{{ $channel->medium_thumbnail_url }}" alt="..."></a>
                <div class="caption">
                    <h2 class="text-center"><a href="/channel/{{ $channel->id }}">{{ $channel->name}}</a></h2>
                </div>
            </div>
        </div>
        @endforeach
    </div>
</div>
@endsection
