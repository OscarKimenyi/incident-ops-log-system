<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard', [IncidentController::class, 'dashboard']);

    // Incidents
    Route::get('/incidents', [IncidentController::class, 'index']);
    Route::get('/incidents/{incident}', [IncidentController::class, 'show']);
    Route::post('/incidents/{incident}/comment', [IncidentController::class, 'addComment']);

    // Reporter + above
    Route::middleware('role:reporter,operator,admin')->group(function () {
        Route::post('/incidents', [IncidentController::class, 'store']);
    });

    // Operator + Admin
    Route::middleware('role:operator,admin')->group(function () {
        Route::patch('/incidents/{incident}/status', [IncidentController::class, 'updateStatus']);
    });

    // Admin only
    Route::middleware('role:admin')->group(function () {
        Route::patch('/incidents/{incident}/assign', [IncidentController::class, 'assign']);
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });

    // Used when assigning (admin only but needs list of operators)
    Route::middleware('role:admin')->get('/operators', [UserController::class, 'operators']);
});