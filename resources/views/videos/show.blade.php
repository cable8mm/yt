@extends('layouts.app')
@section('title', $video->title )
@section('meta_description', $video->description )
@section('meta_image', $video->featured_image_url )

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
<div class="container">
    <div class="row video-show">
        <div class="col-lg-8 col-sm-12 col-xs-12">
            <div class="embed-responsive embed-responsive-16by9 video-player">
                @if(empty($video->has_caption))
                {!! $video->embed_html !!}
                @else
                {!! preg_replace('/(src="[^"]+)"/', "\\1".'?cc_load_policy=1&rel=0&hd=1&hl=en&cc_lang_pref=ko"',
                $video->embed_html) !!}
                @endif
            </div>
            <div class="text-left" style="margin-top:20px">
                <div class="fb-like" data-href="{{ route('video.show', $video->id) }}" data-width="345"
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
                @if(!empty($video->duration))
                <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4">
                    Duration : {{ duration($video->duration) }}
                </div>
                @endif
                <div class="col-xs-6 col-sm-4 col-md-3 col-lg-3">
                    Lisence : {{ $video->license }}
                </div>
                @if(!empty($video->Definition))
                <div class="col-xs-6 col-sm-4 col-md-3 col-lg-3">
                    Definition : {{ $video->definition }}
                </div>
                @endif
                <div class="col-xs-6 col-sm-4 col-md-3 col-lg-3">
                    자막 : {{ empty($video->has_caption)? '없음' : '있음' }}
                </div>
            </div>
            <div class="wrap">
                <div class="fb-comments" data-href="{{ route('video.show', $video->id) }}" data-width="100%"
                    data-numposts="10"></div>
            </div>
        </div>
        <div class="col-lg-4 col-sm-12 col-xs-12 sidebar">
            <div id="fb-anad2" class="container-fluid text-center" style="padding:0">
                <div style="display:none; position: relative;">
                    <iframe style="display:none;"></iframe>
                    <script type="text/javascript">
                        var data = {
      placementid: '1769201740007513_1800928120168208',
      format: '300x250',
      testmode: false,
      onAdLoaded: function(element) {
        console.log('Audience Network [1769201740007513_1800928120168208] ad loaded');
        element.style.display = 'block';
        var containerWidth = $("#fb-anad2").width();
        var lp = (containerWidth - 300) / 2;
        $("#fb-anad2").css('padding-left', lp+'px');
      },
      onAdError: function(errorCode, errorMessage) {
        console.log('Audience Network [1769201740007513_1800928120168208] error (' + errorCode + ') ' + errorMessage);
      }
    };
    (function(w,l,d,t){var a=t();var b=d.currentScript||(function(){var c=d.getElementsByTagName('script');return c[c.length-1];})();var e=b.parentElement;e.dataset.placementid=data.placementid;var f=function(v){try{return v.document.referrer;}catch(e){}return'';};var g=function(h){var i=h.indexOf('/',h.indexOf('://')+3);if(i===-1){return h;}return h.substring(0,i);};var j=[l.href];var k=false;var m=false;if(w!==w.parent){var n;var o=w;while(o!==n){var h;try{m=m||(o.$sf&&o.$sf.ext);h=o.location.href;}catch(e){k=true;}j.push(h||f(n));n=o;o=o.parent;}}var p=l.ancestorOrigins;if(p){if(p.length>0){data.domain=p[p.length-1];}else{data.domain=g(j[j.length-1]);}}data.url=j[j.length-1];data.channel=g(j[0]);data.width=screen.width;data.height=screen.height;data.pixelratio=w.devicePixelRatio;data.placementindex=w.ADNW&&w.ADNW.Ads?w.ADNW.Ads.length:0;data.crossdomain=k;data.safeframe=!!m;var q={};q.iframe=e.firstElementChild;var r='https://www.facebook.com/audiencenetwork/web/?sdk=5.3';for(var s in data){q[s]=data[s];if(typeof(data[s])!=='function'){r+='&'+s+'='+encodeURIComponent(data[s]);}}q.iframe.src=r;q.tagJsInitTime=a;q.rootElement=e;q.events=[];w.addEventListener('message',function(u){if(u.source!==q.iframe.contentWindow){return;}u.data.receivedTimestamp=t();if(this.sdkEventHandler){this.sdkEventHandler(u.data);}else{this.events.push(u.data);}}.bind(q),false);q.tagJsIframeAppendedTime=t();w.ADNW=w.ADNW||{};w.ADNW.Ads=w.ADNW.Ads||[];w.ADNW.Ads.push(q);w.ADNW.init&&w.ADNW.init(q);})(window,location,document,Date.now||function(){return+new Date;});
                    </script>
                    <script type="text/javascript" src="https://connect.facebook.net/en_US/fbadnw.js" async></script>
                </div>
            </div>
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
