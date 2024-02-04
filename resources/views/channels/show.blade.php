<x-app-layout>
    <div class="py-4">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">

            <div class="relative h-12 overflow-hidden rounded md:h-48">
                <div class="duration-700 ease-in-out">
                    <div class="flex justify-center items-center w-full h-full">
                        <div class="z-20 px-4 mx-auto text-center">
                            <div class="text-center py-8">
                                <img src="{{ $channel->thumbnail_url }}" class="mx-auto block rounded-lg">
                                <h1 class="text-white pt-2">{{ $channel->name }}</h1>
                            </div>
                        </div>
                        <img src="{!! asset($videos->first()->featured_image_url) !!}" class="absolute z-10 block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 blur-lg brightness-75">
                    </div>
                </div>
            </div>

            <div>
                <x-x.widget-title href="{{ route('video') }}">{{ __('Recently Videos') }}</x-x.widget-title>
                <div class="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
                    @foreach($videos as $item)
                    <x-video-card :$item />
                    @endforeach
                </div>
                <div class="py-4">{!! $videos->render() !!}</div>
            </div>
        </div>
    </div>
</x-app-layout>
