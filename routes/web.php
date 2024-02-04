<?php

use App\Http\Controllers\ChannelsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LivesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VideosController;
use App\Http\Controllers\WidgetsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/videos', [VideosController::class, 'index'])->name('video');
Route::get('/videos/{video}', [VideosController::class, 'show'])->name('video.show');
Route::get('/channels', [ChannelsController::class, 'index'])->name('channel');
Route::get('/channels/{channel}', [ChannelsController::class, 'show'])->name('channel.show');
Route::get('/lives', [LivesController::class, 'index'])->name('live');
Route::get('/lives/{id}', [LivesController::class, 'show'])->name('live.show');
Route::get('/widgets/{id}', [WidgetsController::class, 'show'])->name('widget');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
