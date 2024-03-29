<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\PageCategoryController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SourceController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\NewPasswordController;

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

Route::group([

    'middleware' => ['api'],
    'prefix' => 'auth'

], function ($router) {

    Route::post('signup', [AuthController::class, 'signup']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});

Route::post('/email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail'])->middleware('JWT');
Route::get('/verify-email/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify')->middleware('JWT');

Route::post('/forgot-password', [NewPasswordController::class, 'forgotPassword']);
Route::post('/reset-password', [NewPasswordController::class, 'reset']);


Route::apiResource('/posts', PostController::class);
Route::apiResource('/categories', CategoryController::class);
Route::apiResource('/groups', GroupController::class);
Route::apiResource('/posts/{post}/comments', CommentController::class);
Route::apiResource('/menus', MenuController::class);
Route::apiResource('/roles', RoleController::class);
Route::get('/tags/total-count', [TagController::class, 'totalCount']);
Route::apiResource('/tags', TagController::class);
Route::apiResource('/page-categories', PageCategoryController::class);
Route::apiResource('/pages', PageController::class);
Route::apiResource('/sources', SourceController::class);
Route::apiResource('/jobs', JobController::class);




