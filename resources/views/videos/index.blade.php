<x-app-layout>
    <x-slot name="header">
        <h1 class="font-semibold text-xl text-gray-800 leading-tight">
            Videos
        </h1>
    </x-slot>
    <div class="py-4">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <x-video.search />
            <div>
                <div class="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
                    @foreach ($videos as $item)
                        <x-video-card :$item />
                    @endforeach
                </div>
            </div>

            <div class="my-4">{!! $videos->render() !!}</div>
        </div>
    </div>
</x-app-layout>
