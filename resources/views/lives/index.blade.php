@extends('layouts.app')
@section('title', 'Open Curation Channels')
@section('meta_description', 'Show open curated channels')

@section('css')
    <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.css" />
    <!-- Add the slick-theme.css if you want default styling -->
    <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick-theme.css" />
    <link rel="stylesheet" type="text/css" href="/simple-3d-coverflow/load/skin_classic_black.css" />
    <style>
        #footer {
            margin-top: 0 !important;
        }
    </style>
@endsection

@section('scripts_bottom')
    <script type="text/javascript" src="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
    <script type="text/javascript" src="/simple-3d-coverflow/java/FWDSimple3DCoverflow.js"></script>

    <script>
        $(function() {
            $(".slider").slick({
                autoplay: true
            });
            // $("#app-icon").velocity({translateY: "-50px"}).velocity("fadeIn", { duration: 1500 }).velocity({translateY: "20px"}).velocity({translateY: "0px"}).velocity({scale:0.9}, {duration:5000, loop:true});
        });

        FWDS3DCovUtils.onReady(function() {
            var coverflow = new FWDSimple3DCoverflow({
                coverflowHolderDivId: "coverflow",
                coverflowDataListDivId: "coverflowData",
                displayType: "fluidwidth",
                autoScale: "no",
                coverflowWidth: 940,
                coverflowHeight: 540,
                skinPath: "simple-3d-coverflow/load/skin_black",
                //main settings
                backgroundColor: "#000000",
                backgroundImagePath: "",
                backgroundRepeat: "repeat-x",
                showDisplay2DAlways: "no",
                coverflowStartPosition: "center",
                coverflowTopology: "flipping",
                coverflowXRotation: 0,
                coverflowYRotation: 0,
                numberOfThumbnailsToDisplayLeftAndRight: "all",
                infiniteLoop: "no",
                rightClickContextMenu: "developer",
                fluidWidthZIndex: 1000,
                //thumbnail settings
                thumbnailWidth: 480,
                thumbnailHeight: 360,
                thumbnailXOffset3D: 86,
                thumbnailXSpace3D: 78,
                thumbnailZOffset3D: 200,
                thumbnailZSpace3D: 93,
                thumbnailYAngle3D: 70,
                thumbnailXOffset2D: 20,
                thumbnailXSpace2D: 30,
                thumbnailHoverOffset: 100,
                thumbnailBorderSize: 0,
                thumbnailBackgroundColor: "#FFFFFF",
                thumbnailBorderColor1: "#FFFFFF",
                thumbnailBorderColor2: "#FFFFFF",
                transparentImages: "no",
                thumbnailsAlignment: "center",
                maxNumberOfThumbnailsOnMobile: 13,
                showThumbnailsGradient: "yes",
                thumbnailGradientColor1: "rgba(0, 0, 0, 0)",
                thumbnailGradientColor2: "rgba(0, 0, 0, 1)",
                showText: "yes",
                textOffset: 10,
                showThumbnailBoxShadow: "yes",
                thumbnailBoxShadowCss: "0px 2px 2px #111111",
                showTooltip: "no",
                dynamicTooltip: "yes",
                showReflection: "yes",
                reflectionHeight: 60,
                reflectionDistance: 0,
                reflectionOpacity: .4,
                //controls settings
                slideshowDelay: 5000,
                autoplay: "no",
                disableNextAndPrevButtonsOnMobile: "no",
                controlsMaxWidth: 700,
                slideshowTimerColor: "#FFFFFF",
                controlsPosition: "bottom",
                controlsOffset: 15,
                showPrevButton: "yes",
                showNextButton: "yes",
                showSlideshowButton: "yes",
                showScrollbar: "yes",
                disableScrollbarOnMobile: "yes",
                enableMouseWheelScroll: "no",
                scrollbarHandlerWidth: 200,
                scrollbarTextColorNormal: "#000000",
                scrollbarTextColorSelected: "#FFFFFF",
                addKeyboardSupport: "yes",
                //categories settings
                showCategoriesMenu: "no",
                startAtCategory: 1,
                categoriesMenuMaxWidth: 700,
                categoriesMenuOffset: 0,
                categoryColorNormal: "#999999",
                categoryColorSelected: "#FFFFFF",
                //lightbox settings
                addLightBoxKeyboardSupport: "yes",
                showLightBoxNextAndPrevButtons: "yes",
                showLightBoxZoomButton: "yes",
                showLightBoxInfoButton: "yes",
                showLightBoxSlideShowButton: "yes",
                showLightBoxInfoWindowByDefault: "no",
                slideShowAutoPlay: "yes",
                lightBoxVideoAutoPlay: "no",
                lightBoxVideoWidth: 640,
                lightBoxVideoHeight: 480,
                lightBoxIframeWidth: 800,
                lightBoxIframeHeight: 600,
                lightBoxBackgroundColor: "#000000",
                lightBoxInfoWindowBackgroundColor: "#FFFFFF",
                lightBoxItemBorderColor1: "#fcfdfd",
                lightBoxItemBorderColor2: "#e4FFe4",
                lightBoxItemBackgroundColor: "#333333",
                lightBoxMainBackgroundOpacity: .8,
                lightBoxInfoWindowBackgroundOpacity: .9,
                lightBoxBorderSize: 0,
                lightBoxBorderRadius: 0,
                lightBoxSlideShowDelay: 4000
            });
        });
    </script>
@endsection

@section('content')
    <div class="index-header" id="coverflow" tabindex="-1"></div>
    <ul id="coverflowData" style="display:none">
        <ul data-cat="Fetured Videos">
            @forelse($liveVideos as $featuredVideo)
                <ul>
                    <li data-type="link" data-url="/lives/{{ $featuredVideo->id }}" data-target="_self"></li>
                    <li data-thumbnail-path="{{ $featuredVideo->featured_image_url }}"></li>
                    <li data-thumbnail-text="">
                        <p class="largeLabel">{{ $featuredVideo->title }}</p>
                        <p class="smallLabel"></p>
                    </li>
                </ul>
            @empty
                <ul>
                    <li data-type="link" data-url="/" data-target="_self"></li>
                    <li data-thumbnail-path="/images/empty_live.png"></li>
                    <li data-thumbnail-text="">
                        <p class="largeLabel">현재 라이브 중인 영상이 존재하지 않습니다.</p>
                        <p class="smallLabel"></p>
                    </li>
                </ul>
            @endforelse

        </ul>
    </ul>
    </div>
    {{-- <div class="container-fluid">
    <h1 class="title-ct">Videos</h1>
</div> --}}
    <!--div class="container" style="padding-top:2em;">
      <div class="row row-xs-2up row-sm-3up row-md-4up row-lg-6up">
    @forelse($liveVideos as $video)
    <div class="col col-xs-6 col-sm-4 col-md-3 col-lg-2">
            <div class="thumbnail">
              <a href="/lives/{{ $video->id }}"><img src="{{ $video->medium_thumbnail_url }}" alt="..."></a>
              <div class="thumbnail-category">LIVE</div>
              <div class="caption">
                <h2><a href="/lives/{{ $video->id }}">{{ $video->title }}</a></h2>
                <p class="info"><span class="label label-info">Started</span><span class="info-channel">{{ date('Y년 m월 d일 H시 m분', strtotime($video->scheduled_start_time)) }}</span></p>
                 <p class="info"><span class="label label-info">Published</span><span class="info-date">{{ date('Y년 m월 d일', strtotime($video->published_at)) }}</span></p>
                <p class="info"><span class="label label-info">Channel</span><span class="info-channel">{{ $video->channel->name }}</span></p>
              </div>
            </div>
          </div>
@empty
    <div class="container">
    <div class="row text-center">
    <p style="font-size:28px;padding:50px 0">현재 라이브 중인 동영상이 없습니다.</p>
    <style>ul.pagination {display:none;}</style>
    </div>
    </div>
    @endforelse
      </div>
      <div class="row text-center">{!! $liveVideos->render() !!}</div>
    </div-->
@endsection
