<div class="container-fluid" id="channel-bar">
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 channel-bar-title"><img src="/images/icon-channel-bar.png"
                    style="width:33px;height:33px;margin-right:30px" alt="채널 아이콘">{{ __('Channels') }}</div>
            <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 channel-bar-items ">
                <div class="row slider" style="padding:0 50px" data-slick='{"slidesToShow": 4, "slidesToScroll": 4}'>
                    @foreach($partners as $partner)
                    <a href="{{ route('channel.show', $partner->id) }}">
                        <div class="channel-bar-item"><img src="{{ $partner->thumbnail_url }}" alt="{{$partner->name}}">
                            {{$partner->name}}</div>
                    </a>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
