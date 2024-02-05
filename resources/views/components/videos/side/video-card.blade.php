@props(['item'])

<a href="{{ route('video.show', $item->id) }}"
    class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
    <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
        src="{{ $item->medium_thumbnail_url }}" alt="{{ $item->title }}">
    <div class="flex flex-col justify-between p-2 leading-normal">
        <h5 class="mb-2 text-sm tracking-tight text-gray-900 dark:text-white">{{ $item->title }}</h5>
        <p class="mb-3 text-xs font-normal text-gray-700 dark:text-gray-400">{{ $item->published_at->diffForHumans() }}
        </p>
    </div>
</a>
