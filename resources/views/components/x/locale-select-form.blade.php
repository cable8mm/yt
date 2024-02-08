@props(['disabled' => false, 'name' => $name, 'value' => $value, 'options' => $options])

<select wire:model="locale" id="{{ $name }}" name="{{ $name }}"
    {{ $attributes->class([
        'form-select border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm',
    ]) }}
    autofocus autocomplete="{{ $name }}">
    <option value="" @empty($value) selected @endempty>---</option>
    @foreach ($options as $key => $option)
        <option value="{{ $key }}" @if ($key == $value) selected @endif>{{ __($option) }}
        </option>
    @endforeach
</select>
