<x-app-layout>
    <x-slot name="header">
        <h1 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ $page->title }}
        </h1>
    </x-slot>
    <div class="py-4">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div>{!! $page->content->markdown() !!}</div>
        </div>
    </div>
</x-app-layout>
