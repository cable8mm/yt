<div {!! $attributes->merge([
    'class' => 'max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700',
]) !!}>
    <a href="{{ route('video.show', $item->id) }}">
        <img class="rounded-t-lg w-full" src="{{ $item->medium_thumbnail_url }}" alt="" />
    </a>
    <div class="px-2 my-2 lg:my-5 line-clamp-2 lg:line-clamp-3">
        <a href="{{ route('video.show', $item->id) }}">
            <h5 class="mb-2 tracking-tight text-gray-900 dark:text-white">{{ $item->title }}</h5>
        </a>
    </div>
</div>
