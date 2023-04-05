@extends('layouts.widget')
@section('css')
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.css" />
<!-- Add the slick-theme.css if you want default styling -->
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick-theme.css" />
<style scoped>
    .button-success,
    .button-error,
    .button-warning,
    .button-secondary {
        color: white;
        border-radius: 4px;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    }

    .button-success {
        background: rgb(28, 184, 65);
        /* this is a green */
    }

    .button-error {
        background: rgb(202, 60, 60);
        /* this is a maroon */
    }

    .button-warning {
        background: rgb(223, 117, 20);
        /* this is an orange */
    }

    .button-secondary {
        background: rgb(66, 184, 221);
        /* this is a light blue */
    }
</style>
@endsection
@section('scripts_bottom')
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.min.js"></script>
<script>
    $(function() {
  $(".slider").slick({autoplay:true, arrows:false, dots:true});
});
</script>
@endsection
@section('content')
{{-- 325 x 320--}}
<div style="max-width:325px;background-color:#F5F5F5;max-height:293px;position:relative;">
    <div style="background-color:#1a2c4d;padding:0.5em;">
        <a href="{{ route('channel.show', $channel->id) }}" target="_blank">
            <div style="float:left;width:15%;"><img
                    style="display:block;margin:0 auto; width:46px;height:46px;border-radius:50%;border:5px solid white;"
                    src="{{$channel->thumbnail_url}}" alt="{{ $videos[0]->title}}"></div>
            <div
                style="float:left;width:75%;margin-left:5%;text-align:left;height:46px;display:table;vertical-align: middle">
                <h2
                    style="margin:0;padding:0;height:46px;color:white;font-size:1em;font-weight:400;display:table-cell;vertical-align:middle;">
                    {{$channel->name}}</h2>
            </div>
        </a>
        <div style="clear:both"></div>
    </div>
    <div style="margin:0; background-color:#F5F5F5" class="row slider text-center"
        data-slick='{"slidesToShow": 1, "slidesToScroll": 1}'>
        @foreach($videos as $video)
        <a href="{{ route('video.show', $video->id) }}" target="_parent"><img
                style="margin:0 auto;width:100%;width:325px;height:182px" src="{{ $video->medium_thumbnail_url }}"
                alt="{{ $video->title}}">
            <div style="margin:5px;font-size:0.8em;height:3em;">{{ $video->title}}</div>
        </a>
        @endforeach
    </div>
</div>
@endsection
