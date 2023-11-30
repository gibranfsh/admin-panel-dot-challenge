<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\ApiAuthMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('v1')->group(function () {
    Route::prefix('users')->group(function () {
        Route::post('/register', [UserController::class, 'register']);
        Route::post('/login', [UserController::class, 'login']);

        Route::middleware(ApiAuthMiddleware::class)->group(function () {
            Route::get('/current', [UserController::class, 'get']);
            Route::delete('/logout', [UserController::class, 'logout']);
        });
    });

    Route::prefix('clients')->group(function () {
        Route::middleware(ApiAuthMiddleware::class)->group(function () {
            Route::post('/', [ClientController::class, 'create']);
            Route::get('/', [ClientController::class, 'search']);
            Route::get('/{id}', [ClientController::class, 'getById'])->where('id', '[0-9]+');
            Route::put('/{id}', [ClientController::class, 'update'])->where('id', '[0-9]+');
            Route::delete('/{id}', [ClientController::class, 'delete'])->where('id', '[0-9]+');

            Route::prefix('{idClient}/projects')->group(function () {
                Route::post('/', [ProjectController::class, 'create'])->where('idClient', '[0-9]+');
                Route::get('/', [ProjectController::class, 'getAll'])->where('idClient', '[0-9]+');
                Route::get('/{idProject}', [ProjectController::class, 'get'])
                    ->where('idClient', '[0-9]+')
                    ->where('idProject', '[0-9]+');
                Route::put('/{idProject}', [ProjectController::class, 'update'])
                    ->where('idClient', '[0-9]+')
                    ->where('idProject', '[0-9]+');
                Route::delete('/{idProject}', [ProjectController::class, 'delete'])
                    ->where('idClient', '[0-9]+')
                    ->where('idProject', '[0-9]+');
            });
        });
    });
});
