@props(['item'])
@foreach (explode(',', $item->tags) as $tag)
    <div
        {{ $attributes->merge(['class' => 'text-xs inline-flex items-center text-sm leading-sm uppercase px-2 py-1 rounded-full text-' . $item->color_theme . '-700 bg-' . $item->color_theme . '-200']) }}>
        {!! $tag !!}
    </div>
@endforeach
