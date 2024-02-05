<x-app-layout>
    <div class="py-4">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="lg:grid lg:grid-cols-3 lg:gap-4 lg:mb-4">
                <div class="lg:col-span-2">
                    <x-widgets.banner-carousel :items="$feturedVideos" />
                </div>
                <div>
                    <x-widgets.channels />
                </div>
            </div>
            <div>
                <x-x.widget-title href="{{ route('video') }}">{{ __('Recently Videos') }}</x-x.widget-title>
                <div class="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
                    @foreach ($videos as $item)
                        <x-video-card :$item />
                    @endforeach
                </div>
            </div>
            <section class="bg-white dark:bg-gray-900 mt-4">
                <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
                    <h1
                        class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        We introduce best channels</h1>
                    <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
                        Go youtube channel directly.</p>
                    <div class="grid grid-cols-4 md:grid-cols-8 gap-4">
                        @foreach ($channels as $item)
                            <div class="mx-auto">
                                <a href="https://youtube.com/channel/{{ $item->channelid }}"><img
                                        class="h-auto max-w-full rounded-lg mx-auto" src="{{ $item->thumbnail_url }}"
                                        alt=""></a>
                                <x-youtube-subscriber-count :channelId="$item->channelid" />
                            </div>
                        @endforeach
                    </div>
                </div>
            </section>
        </div>
    </div>
</x-app-layout>
