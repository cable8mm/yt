# Open Curation - YT

Open Curation - YT is a web application that allows users to curate YouTube videos into playlists. It is built on the Laravel framework.

Enjoy!

## Installation

```sh
git clone https://github.com/open-curation/yt.git

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
