@extends('layouts.app')
@section('title', '라이브 - '.$video->title )
@section('meta_description', $video->description )
@section('meta_image', $video->featured_image_url )
@section('meta_image_width', 480 )
@section('meta_image_height', 360 )

@section('body')
<div id="fb-root"></div>
<script>
    (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/ko_KR/sdk.js#xfbml=1&version=v2.7&appId=1534412176862824";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
</script>
@stop
@section('content')
<div class="container-fluid" style="background-color:black">
    <div class="container">
        <div class="row video-show" style="background-color:black">
            <div class="col-lg-12 col-sm-12 col-xs-12">
                <div class="embed-responsive embed-responsive-16by9 video-player">
                    {!! preg_replace('/(src="[^"]+)"/',
                    "\\1".'?autoplay=1&cc_load_policy=1&rel=0&hd=1&hl=en&cc_lang_pref=ko"', $video->embed_html) !!}

                    {{-- {!! $video->embed_html !!} --}}
                </div>
            </div>
        </div>
    </div>
</div>
<div class="container">
    <div class="row">
        <div class="col-lg-8 col-sm-12 col-xs-12">
            <div class="text-left" style="margin-top:20px">
                <div class="fb-like" data-href="{{ route('live.show', $video->id) }}" data-width="345"
                    data-layout="standard" data-action="like" data-size="large" data-show-faces="false"
                    data-share="true"></div>
            </div>
            <h1 class="video-title">{{ $video->title }}</h1>
            <p>{!! nl2br($video->description) !!}</p>
            {{-- <h2>Tags</h2>
            <p><span class="label label-info">{!! implode('</span> <span class="label label-info">',
                    explode(',',$video->tag)) !!}</span></p> --}}
            <h2>정보</h2>
            <div class="row">
                <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4">
                    Lisence : {{ $video->license }}
                </div>
                @if(!empty($video->Definition))
                <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4">
                    Definition : {{ $video->definition }}
                </div>
                @endif
                <div class="col-xs-6 col-sm-4 col-md-3 col-lg-4">
                    자막 : {{ empty($video->has_caption)? '없음' : '있음' }}
                </div>
            </div>
            <div class="wrap">
                <div class="fb-comments" data-href="{{ route('live.show', $video->id) }}" data-width="100%"
                    data-numposts="10"></div>
            </div>
        </div>
        <div class="col-lg-4 col-sm-12 col-xs-12 sidebar">
            <div class="wrap text-center hidden-phone"><img src="{{ $video->channel->featured_image_url }}"
                    class="img-responsive"></div>
            <h3>Channel's Recent Videos</h3>
            @foreach($channelVideos as $video)
            <div class="media">
                <a class="media-left" href="/videos/{{ $video->id }}">
                    <img class="media-object" src="{{ $video->thumbnail_url }}" alt="...">
                    <div class="thumbnail-channel-video">
                        <?=duration($video->duration)?>
                    </div>
                </a>
                <div class="media-body">
                    <h4 class="media-heading channel-video-title"><a href="/videos/{{ $video->id }}">{{
                            $video->title}}</a></h4>
                    <p class="info"><span class="label label-info">Published</span><span class="info-date">{{ date("Y년
                            m월 d일", strtotime($video->published_at)) }}</span></p>
                </div>
            </div>
            @endforeach

        </div>
    </div>
</div>
@endsection
