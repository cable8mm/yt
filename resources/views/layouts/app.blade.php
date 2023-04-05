<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no">
    <title>@yield('title', config('app.name'))</title>
    <meta name="description"
        content="{{Str::limit(trim(View::yieldContent('meta_description', 'Welcome to Open Curation.')), 100, '...')}}" />
    <link rel="canonical"
        href="https://<?php echo $_SERVER['HTTP_HOST']; ?><?php echo parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ); ?>" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="@yield('title', config('app.name'))" />
    <meta property="og:description"
        content="{{Str::limit(trim(View::yieldContent('meta_description', 'Welcome to Open Curation.')), 100, '...')}}" />
    <meta property="og:url"
        content="https://<?php echo $_SERVER['HTTP_HOST']; ?><?php echo parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ); ?>" />
    <meta property="og:site_name" content="@yield('title', config('app.name'))" />
    <meta property="og:image:width" content="@yield('meta_image_width', '2000')" />
    <meta property="og:image:height" content="@yield('meta_image_height', '550')" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:description"
        content="{{Str::limit(trim(View::yieldContent('meta_description', 'Welcome to Open Curation.')), 100, '...')}}" />
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
    <nav class="navbar navbar-default navbar-static-top">
        <div class="container">
            <div class="navbar-header">

                <!-- Collapsed Hamburger -->
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#app-navbar-collapse">
                    <span class="sr-only">Toggle Navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <!-- Branding Image -->
                <a class="navbar-brand" href="{{ url('/') }}">
                    Open <span class="logo-square">Curation</span>
                </a>
            </div>

            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <!-- Left Side Of Navbar -->
                <ul class="nav navbar-nav">
                    <li><a href="{{ url('/videos') }}">Videos({{number_format($videoCount)}})</a></li>
                    <li class="dropdown">
                        <a href="{{ url('/channels') }}" class="dropdown-toggle" data-toggle="dropdown" role="button"
                            aria-haspopup="true" aria-expanded="false">Channels({{count($partners)}}) <span
                                class="caret"></span></a>
                        <ul class="dropdown-menu">
                            @foreach($partners as $partner)
                            <li><a href="/channels/{{ $partner->id }}">{{ $partner->name }}</a></li>
                            @endforeach
                        </ul>
                    </li>
                    <li><a href="{{ url('/lives') }}">Live <span class="label label-danger"
                                style="margin-top:-4px;">NEW</span></a></li>
                </ul>

                <!-- Right Side Of Navbar -->
                <!--ul class="nav navbar-nav navbar-right">
                    @if (Auth::guest())
                        <li><a href="{{ url('/login') }}">Login</a></li>
                        <li><a href="{{ url('/register') }}">Register</a></li>
                    @else
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                {{ Auth::user()->name }} <span class="caret"></span>
                            </a>

                            <ul class="dropdown-menu" role="menu">
                                <li><a href="{{ url('/logout') }}"><i class="fa fa-btn fa-sign-out"></i>Logout</a></li>
                            </ul>
                        </li>
                    @endif
                </ul-->
            </div>
        </div>
    </nav>

    @yield('content')

    <style>
        #copyright {
            color: #7887A5;
            text-align: center;
            line-height: 1.8em;
            font-weight: 700;
            padding-top: 30px;
            font-size: 12px;
            background-color: white;
            padding-bottom: 25px;
            height: auto;
        }

        #copyright a {
            color: #7887A5;
        }

        #footer-links {
            text-align: center;
            background-color: #455066;
            color: white;
            font-weight: 700;
            padding: 30px;
        }

        #footer-links a {
            color: white;
            font-size: 11px;
            padding: 0 10px;
            font-weight: 500;
        }
    </style>

    <footer class="main-footer">
        <div id="footer">
            <div class="container">
                <div class="row">
                    <div class="col col-xs-12 col-sm-4 col-md-3 col-lg-3 hidden-phone">
                        <h4 id="footer-logo">Open Curation</h4>
                    </div>
                    <div class="col col-xs-12 col-sm-8 col-md-3 col-lg-3" style="padding-top:10px">
                        <h3>Open Curation / YT</h3>
                        <p>What are you think about us?</p>
                        <ul>
                            <li style="display:list-item">{{ __('Curation Channels') }} {{count($partners)}}</li>
                            <li style="display:list-item">{{ __('Videos') }} {{number_format($videoCount)}}</li>
                        </ul>
                    </div>
                    <div class="col col-xs-12 col-sm-12 col-md-6 col-lg-6" style="padding-top:10px">
                        <h3>{{ __('Channels') }}</h3>
                        <ul>
                            @foreach($partners as $partner)
                            <li><a href="/channels/{{ $partner->id }}"><img src="{{ $partner->thumbnail_url }}"
                                        alt="{{ $partner->name }}" title="{{ $partner->name }}"></a></li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div id="footer-links">
            <a href="https://github.com/open-curation/yt" title="{{ __('Github') }}"><span>Github</span></a>
        </div>
        <div id="copyright">
            with Open Curation
        </div>
    </footer>
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