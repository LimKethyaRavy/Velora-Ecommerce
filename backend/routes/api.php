<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductImageController;
use App\Http\Controllers\Api\ProductVariantController;
use App\Http\Controllers\Api\SupplierController;
use App\Models\Product_Variants;
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


Route::get('/suppliers/all', [SupplierController::class, 'index'])->name('suppliers.index');

Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store');

Route::put('/suppliers/{id}', [SupplierController:: class, 'update'])->name('suppliers.update');

Route::get('/suppliers/show/{id}', [SupplierController::class, 'show'])->name('suppliers.show');

Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy'])->name('suppliers.destroy');


Route::prefix('categories')->group(function () {

    Route::get('/' , [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::put('/{id}', [CategoryController::class, 'update']);
    Route::get('/{id}', [CategoryController::class, 'show']);
    Route::delete('/{id}', [CategoryController::class, 'destroy']);
    
});

Route::prefix('product')->group(function () {

    Route::get('/', [ProductController::class, 'index']);
    Route::post('/', [ProductController::class, 'store']);
    Route::get('/{id}', [ProductController::class, 'show']);
    Route::put('/update/{id}', [ProductController::class, 'update']);
    Route::delete('/delete/{id}', [ProductController::class, 'destroy']);
});

Route::prefix('variant')->group(function() {

    Route::get('/', [ProductVariantController::class, 'index']);

    Route::post('/', [ProductVariantController::class, 'store']);

    Route::get('/{id}', [ProductVariantController::class, 'show']);

    Route::put('/update/{id}', [ProductVariantController::class, 'update']);

    Route::delete('/delete/{id}', [ProductVariantController::class, 'destroy']);


});


Route::prefix('image')->group(function() {

    Route::get('/', [ProductImageController::class, 'index']);

    Route::post('/', [ProductImageController::class, 'store']);

    Route::get('/{id}', [ProductImageController::class, 'show']);

    Route::put('/update/{id}', [ProductImageController::class, 'update']);

    Route::delete('/delete/{id}', [ProductImageController::class, 'destroy']);
    

});