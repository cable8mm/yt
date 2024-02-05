<div
    class="w-full mt-4 lg:mt-0 p-4 bg-white border border-gray-200 lg:rounded-lg shadow sm:p-7 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
        <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">{{ __('Channels') }}</h5>
        <a href="{{ route('channel') }}" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
            {{ __('View all') }}
        </a>
    </div>
    <div class="flow-root">
        <div class="grid grid-cols-8 gap-2">
            @foreach ($channels as $item)
                <a href="{{ route('channel.show', $item->id) }}">
                    <div class="py-3 sm:py-4">
                        <img src="{{ $item->thumbnail_url }}" class="">
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</div>
