<a href="{!! route('video.show', $item->id) !!}">
    <div class="flex justify-center items-center w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500">
        <img src="{!! asset($item->featured_image_url) !!}"
            class="absolute z-10 block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            alt="{!! $item->title !!}">
    </div>
</a>
