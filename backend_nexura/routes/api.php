<?php

use App\Http\Controllers\AreasController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\RolesController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix("employee")->group(function () {
    Route::get('/get_all', [EmployeeController::class, "get_employees"])->name('get_employees');
    Route::get('/get_one', [EmployeeController::class, "get_one"])->name('get_one');
    Route::post('/create', [EmployeeController::class, "create"])->name('create');
    Route::put('/update', [EmployeeController::class, "update"])->name('update');
    Route::delete('/delete', [EmployeeController::class, "delete"])->name('delete');
});

Route::prefix("area")->group(function () {
    Route::get('/get_all', [AreasController::class, "get_areas"])->name('get_areas');
});

Route::prefix("roles")->group(function () {
    Route::get('/get_all', [RolesController::class, "get_roles"])->name('get_roles');
});
