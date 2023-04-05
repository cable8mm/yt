<?php

use App\Http\Controllers\ChannelsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LivesController;
use App\Http\Controllers\VideosController;
use App\Http\Controllers\WidgetsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/videos', [VideosController::class, 'index'])->name('video');
Route::get('/videos/{id}', [VideosController::class, 'show'])->name('video.show');
Route::get('/channels', [ChannelsController::class, 'index'])->name('channel');
Route::get('/channels/{id}', [ChannelsController::class, 'show'])->name('channel.show');
Route::get('/lives', [LivesController::class, 'index'])->name('live');
Route::get('/lives/{id}', [LivesController::class, 'show'])->name('live.show');
Route::get('/widgets/{id}', [WidgetsController::class, 'show'])->name('widget');
