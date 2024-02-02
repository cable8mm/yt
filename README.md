# Open Curation - YT

[![Tests](https://github.com/cable8mm/yt/actions/workflows/laravel-tests.yml/badge.svg)](https://github.com/cable8mm/yt/actions/workflows/laravel-tests.yml)
[![PHP Linting (Pint)](https://github.com/cable8mm/yt/actions/workflows/coding-style-php.yml/badge.svg)](https://github.com/cable8mm/yt/actions/workflows/coding-style-php.yml)
[![release date](https://img.shields.io/github/release-date/cable8mm/yt)](https://github.com/cable8mm/yt/releases)
[![minimum PHP version](https://img.shields.io/badge/php-%3E%3D_8.2.0-8892BF.svg)](https://github.com/cable8mm/yt)

Open Curation - YT is a web application that allows users to curate YouTube videos into playlists. It is built on the Laravel framework.

Enjoy it!

## Installation

```sh
git clone https://github.com/cable8mm/yt.git

cd yt

composer update

cp .env.example .env

valet secure
```

Make `yt` database in MySQL. After database setup:

```sh
php artisan migrate:fresh --seed --force

npm install

valet open
```

visit : https://yt.test

## Test

```sh
composer test
```

## Build

Development:

```sh
npm run dev
```

Live:

```sh
npm run build
```

## License

The Laravel framework is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
