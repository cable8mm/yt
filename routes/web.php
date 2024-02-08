<?php

use App\Http\Controllers\ChannelsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VideosController;
use Illuminate\Support\Facades\Route;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

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
Route::group(['prefix' => LaravelLocalization::setLocale()], function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::get('/videos', [VideosController::class, 'index'])->name('video');
    Route::get('/videos/{video}', [VideosController::class, 'show'])->name('video.show');
    Route::get('/channels', [ChannelsController::class, 'index'])->name('channel');
    Route::get('/channels/{channel}', [ChannelsController::class, 'show'])->name('channel.show');

    Route::get('/pages/{slug}', [PageController::class, 'show'])->name('page.show');

    Route::get('/dashboard', function () {
        return view('dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});

Route::get('/go/youtube/{channel}', function ($channel) {
    return redirect('https://youtube.com/channel/'.$channel);
})->name('youtube');

require __DIR__.'/auth.php';
