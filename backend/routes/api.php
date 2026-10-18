<?php

use App\Http\Controllers\Api\SupplierController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index');

Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store');

Route::put('/suppliers/{id}', [SupplierController:: class, 'update'])->name('suppliers.update');

Route::get('/suppliers', [SupplierController::class, 'show'])->name('suppliers.show');

Route::delete('/suppliers/{id}', [SupplierController::class, 'destory'])->name('suppliers.destory');
