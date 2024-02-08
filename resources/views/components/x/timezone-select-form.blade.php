@props(['disabled' => false, 'name' => $name, 'value' => $value, 'options' => $options])

<select wire:model="tz" id="{{ $name }}" name="{{ $name }}" {{ $attributes->class(['form-select border-gray-300 focus:border-indigo-500
    focus:ring-indigo-500 rounded-md shadow-sm']) }}

    required autofocus autocomplete="{{ $name }}">
    @foreach($options as $key => $option)
    <option value="{{ $key }}" @if($key==$value) selected @endif>{{ __($option) }}</option>
    @endforeach
</select>
