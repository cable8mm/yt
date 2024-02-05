<title>@yield('title', config('meta.title'))</title>
<meta charset="utf-8">
<meta name="csrf-token" content="{{ csrf_token() }}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{!! Str::limit(View::yieldContent('meta_description', config('meta.description')), 100, '...') !!}" />
<link rel="canonical" href="{{ URL::current() }}" />
{{-- <meta property="fb:app_id" content="{{ config('services.facebook.client_id') }}" /> --}}
<meta property="og:locale" content="ko_KR" />
<meta property="og:type" content="website" />
<meta property="og:title" content="@yield('title', config('meta.title'))" />
<meta property="og:description" content="{!! Str::limit(View::yieldContent('meta_description', config('meta.description')), 100, '...') !!}" />
<meta property="og:url" content="{{ URL::current() }}" />
<meta property="og:site_name" content="{{ config('meta.title') }}" />
<meta property="og:image" content="@yield('meta_image', url(config('meta.image')))" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:description" content="{!! Str::limit(View::yieldContent('meta_description', config('meta.description')), 100, '...') !!}" />
<meta name="twitter:title" content="@yield('title', config('meta.title'))" />
<meta name="twitter:image" content="@yield('meta_image', url(config('meta.image')))" />
<link rel="apple-touch-icon" sizes="180x180" href="{{ url('apple-touch-icon.png') }}">
<link rel="icon" type="image/png" sizes="32x32" href="{{ url('favicon-32x32.png') }}">
<link rel="icon" type="image/png" sizes="16x16" href="{{ url('favicon-16x16.png') }}">
<link rel="icon" sizes="192x192" href="{{ url('android-chrome-192x192.png') }}">
<link rel="icon" sizes="512x512" href="{{ url('android-chrome-512x512.png') }}">
