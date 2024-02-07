<x-app-layout>
    <x-slot name="header">
        <h1 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ $video->title }}
        </h1>
    </x-slot>
    <div class="py-4">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <x-breadcrumb :paths="[['Videos', route('video')], [$video->title, route('video.show', $video->id)]]" />
            <div class="container">
                <div class="grid grid-cols-3 gap-4">
                    <div class="col-span-2 bg-white dark:bg-black">
                        <div class="aspect-w-16 aspect-h-9">
                            {!! $video->embed_html !!}
                        </div>
                        <div class="p-4">
                            <div class="fb-like" data-href="{{ route('video.show', $video->id) }}" data-width="345"
                                data-layout="standard" data-action="like" data-size="large" data-show-faces="false"
                                data-share="true"></div>
                            <p class="pb-4">{!! nl2br($video->description) !!}</p>
                            <div class="bg-slate-400 p-4 rounded-lg">
                                <h2>{{ __('Informations') }}</h2>
                                @if (!empty($video->duration))
                                    <div class="">
                                        {{ __('Duration') }} : {{ duration($video->duration) ?? 'Caculating...' }}
                                    </div>
                                @endif
                                <div class="">
                                    {{ __('Lisence') }} : {{ $video->license ?? '(maybe) Youtube License' }}
                                </div>
                                @if (!empty($video->Definition))
                                    <div class="">
                                        {{ __('Definition') }} : {{ $video->definition ?? 'Caculating...' }}
                                    </div>
                                @endif
                                <div class="">
                                    {{ __('Subtitle') }} : {{ empty($video->has_caption) ? 'none' : 'include' }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="">
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
                                            $("#fb-anad2").css('padding-left', lp + 'px');
                                        },
                                        onAdError: function(errorCode, errorMessage) {
                                            console.log('Audience Network [1769201740007513_1800928120168208] error (' + errorCode + ') ' +
                                                errorMessage);
                                        }
                                    };
                                    (function(w, l, d, t) {
                                        var a = t();
                                        var b = d.currentScript || (function() {
                                            var c = d.getElementsByTagName('script');
                                            return c[c.length - 1];
                                        })();
                                        var e = b.parentElement;
                                        e.dataset.placementid = data.placementid;
                                        var f = function(v) {
                                            try {
                                                return v.document.referrer;
                                            } catch (e) {}
                                            return '';
                                        };
                                        var g = function(h) {
                                            var i = h.indexOf('/', h.indexOf('://') + 3);
                                            if (i === -1) {
                                                return h;
                                            }
                                            return h.substring(0, i);
                                        };
                                        var j = [l.href];
                                        var k = false;
                                        var m = false;
                                        if (w !== w.parent) {
                                            var n;
                                            var o = w;
                                            while (o !== n) {
                                                var h;
                                                try {
                                                    m = m || (o.$sf && o.$sf.ext);
                                                    h = o.location.href;
                                                } catch (e) {
                                                    k = true;
                                                }
                                                j.push(h || f(n));
                                                n = o;
                                                o = o.parent;
                                            }
                                        }
                                        var p = l.ancestorOrigins;
                                        if (p) {
                                            if (p.length > 0) {
                                                data.domain = p[p.length - 1];
                                            } else {
                                                data.domain = g(j[j.length - 1]);
                                            }
                                        }
                                        data.url = j[j.length - 1];
                                        data.channel = g(j[0]);
                                        data.width = screen.width;
                                        data.height = screen.height;
                                        data.pixelratio = w.devicePixelRatio;
                                        data.placementindex = w.ADNW && w.ADNW.Ads ? w.ADNW.Ads.length : 0;
                                        data.crossdomain = k;
                                        data.safeframe = !!m;
                                        var q = {};
                                        q.iframe = e.firstElementChild;
                                        var r = 'https://www.facebook.com/audiencenetwork/web/?sdk=5.3';
                                        for (var s in data) {
                                            q[s] = data[s];
                                            if (typeof(data[s]) !== 'function') {
                                                r += '&' + s + '=' + encodeURIComponent(data[s]);
                                            }
                                        }
                                        q.iframe.src = r;
                                        q.tagJsInitTime = a;
                                        q.rootElement = e;
                                        q.events = [];
                                        w.addEventListener('message', function(u) {
                                            if (u.source !== q.iframe.contentWindow) {
                                                return;
                                            }
                                            u.data.receivedTimestamp = t();
                                            if (this.sdkEventHandler) {
                                                this.sdkEventHandler(u.data);
                                            } else {
                                                this.events.push(u.data);
                                            }
                                        }.bind(q), false);
                                        q.tagJsIframeAppendedTime = t();
                                        w.ADNW = w.ADNW || {};
                                        w.ADNW.Ads = w.ADNW.Ads || [];
                                        w.ADNW.Ads.push(q);
                                        w.ADNW.init && w.ADNW.init(q);
                                    })(window, location, document, Date.now || function() {
                                        return +new Date;
                                    });
                                </script>
                                <script type="text/javascript" src="https://connect.facebook.net/en_US/fbadnw.js" async></script>
                            </div>
                        </div>
                        <div class="">
                            <a href="{{ route('channel.show', $video->channel_id) }}"><img
                                    src="{{ $video->channel->featured_image_url }}" class="w-full rounded-lg"></a>
                        </div>
                        <x-x.widget-title>{{ __('Channel\'s Recent Videos') }}</x-x.widget-title>
                        @foreach ($channelVideos as $item)
                            <x-videos.side.video-card :item="$item" />
                        @endforeach
                    </div>
                </div>
            </div>

        </div>
    </div>
</x-app-layout>
