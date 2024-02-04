@extends('layouts.app')
@section('title', 'Open Curation Videos' )
@section('meta_description', 'Show open curated videos' )
@section('content')
{{-- <div class="container-fluid">
    <h1 class="title-ct">Videos</h1>
</div> --}}
<x-video.search />
<div class="container-fluid">
    <div class="row row-xs-2up row-sm-3up row-md-4up row-lg-6up">
        @forelse($videos as $video)
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
                            m월 d일", strtotime($video->published_at)) }}</span></p>
                    <p class="info"><span class="label label-info">Channel</span><span class="info-channel">{{
                            $video->channel->name }}</span></p>
                </div>
            </div>
        </div>
        @empty
        <div class="container">
            <div class="row text-center">
                <p style="font-size:28px;padding:50px 0">{{ __('검색 결과가 존재하지 않습니다.') }}</p>
                <p style="padding-bottom:100px">{{ __('다른 검색어를 넣어보세요.') }}</p>
                <style>
                    ul.pagination {
                        display: none;
                    }
                </style>
            </div>
        </div>
        @endforelse
    </div>
    <div class="row text-center">{!! $videos->render() !!}</div>
</div>
@endsection
