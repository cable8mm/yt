@extends('layouts.app')
@section('title', $channel->name.' 채널' )
@section('meta_description', $channel->description )
@section('meta_image', $channel->featured_image_url )

@section('css')
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.css" />
<!-- Add the slick-theme.css if you want default styling -->
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick-theme.css" />
@endsection

@section('scripts_bottom')
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.min.js"></script>
<script>
    $(function() {
  $(".slider").slick({autoplay:true});
});
</script>
@endsection

@section('content')
<div class="background-image" style="
@if(!empty($videos[0]->thumbnail_url))
background-image:url({{ $videos[0]->thumbnail_url }})
@endif
">
</div>
<script src="https://apis.google.com/js/platform.js"></script>

<div class="container-fluid content-over-blur" id="channel-bar" style="position:absolute;">
    <div class="text-center" style="padding-top:34px;"><img src="{{ $channel->thumbnail_url }}" class="img-thumbnail">
    </div>
    <h1 class="title-ct channel-title" style="font-size:14px;margin-top:20px">{{ $channel->name }}</h1>
    <div class="text-center" style="padding-top:10px;">
        <div class="g-ytsubscribe" data-channelid="{{ $channel->channelid }}" data-layout="default" data-count="default"
            data-onytevent="onYtEvent"></div>
    </div>
    <!--p class="channel-description text-center">{{ $channel->description }}</p-->
</div>
<div class="container-fluid" style="padding-top:250px;">
    <div class="row row-xs-2up row-sm-3up row-md-4up row-lg-6up">
        @if(!empty($videos))
        @foreach($videos as $video)
        <div class="col col-xs-6 col-sm-4 col-md-3 col-lg-2">
            <div class="thumbnail">
                <a href="/videos/{{ $video->id }}"><img src="{{ $video->medium_thumbnail_url }}" alt="..."></a>
                <div class="thumbnail-category">
                    @if(!empty($video->duration) && $video->duration != 'PT0S')
                    {{duration($video->duration)}}
                    @endif
                </div>
                <div class="caption">
                    <h2><a href="/videos/{{ $video->id }}">{{ $video->title}}</a></h2>
                    <p class="info"><span class="label label-info">Published</span><span class="info-date">{{ date("Y년
                            m월 d일", strtotime($video->published)) }}</span></p>
                </div>
            </div>
        </div>
        @endforeach
        @endif
    </div>
    <div class="row text-center">{!! $videos->render() !!}</div>
</div>
@endsection
