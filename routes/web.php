<?php

use App\Http\Controllers\ChannelsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\VideosController;
use App\Livewire\Settings\Appearance;
use App\Livewire\Settings\Password;
use App\Livewire\Settings\Profile;
use App\Livewire\Settings\TwoFactor;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
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
Route::get('/', [HomeController::class, 'index'])->name('home');

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

    Route::middleware(['auth'])->group(function () {
        Route::redirect('settings', 'settings/profile');

        Route::get('settings/profile', Profile::class)->name('profile.edit');
        Route::get('settings/password', Password::class)->name('settings.password');
        Route::get('settings/appearance', Appearance::class)->name('settings.appearance');

        Route::get('settings/two-factor', TwoFactor::class)
            ->middleware(
                when(
                    Features::canManageTwoFactorAuthentication()
                        && Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword'),
                    ['password.confirm'],
                    [],
                ),
            )
            ->name('two-factor.show');
    });
});

Route::get('/go/youtube/{channel}', function ($channel) {
    return redirect('https://youtube.com/channel/'.$channel);
})->name('youtube');

require __DIR__.'/auth.php';
