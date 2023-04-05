<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no">
    <title>@yield('title', config('app.name'))</title>
    <meta name="description"
        content="{{str_limit(trim(View::yieldContent('meta_description', 'Welcome to Open Curation.')), 100, '...')}}" />
    <link rel="canonical"
        href="http://<?php echo $_SERVER['HTTP_HOST']; ?><?php echo parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ); ?>" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="@yield('title', config('app.name'))" />
    <meta property="og:description"
        content="{{str_limit(trim(View::yieldContent('meta_description', 'Welcome to Open Curation.')), 100, '...')}}" />
    <meta property="og:url"
        content="http://<?php echo $_SERVER['HTTP_HOST']; ?><?php echo parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ); ?>" />
    <meta property="og:site_name" content="@yield('title', config('app.name'))" />
    <meta property="og:image:width" content="@yield('meta_image_width', '2000')" />
    <meta property="og:image:height" content="@yield('meta_image_height', '550')" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:description"
        content="{{str_limit(trim(View::yieldContent('meta_description', 'Welcome to Open Curation.')), 100, '...')}}" />
    <meta name="twitter:title" content="@yield('title', config('app.name'))" />

    @yield('metas')

    <!-- Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Sansita+One' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css"
        integrity="sha384-XdYbMnZ/QjLh6iI4ogqCTaIjrFk87ip+ekIjefZch0Y+PvJ8CDYtEs1ipDmPorQ+" crossorigin="anonymous">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700">

    <!-- Styles -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css"
        integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
    {{--
    <link href="{{ elixir('css/app.css') }}" rel="stylesheet"> --}}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css"
        integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
    @yield('css')
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/responsive.css">
    <link rel="stylesheet" href="/css/style-ie10-over.css">

    @yield('scripts')
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body id="app-layout">
    @yield('body')
    @yield('content')
    <!-- JavaScripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js"
        integrity="sha384-I6F5OKECLVtK/BL+8iSLDEHowSAfUo76ZL9+kGAgTRdiByINKJaqTPH/QVNS1VDb" crossorigin="anonymous">
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"
        integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous">
    </script>
    {{-- <script src="{{ elixir('js/app.js') }}"></script> --}}
    @yield('scripts_bottom')
</body>

</html>