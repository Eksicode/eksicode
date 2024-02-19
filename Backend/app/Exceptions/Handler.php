<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            
        });
    }

    public function render($request, Throwable $exception)
    {
        if($exception instanceof TokenBlacklistedException)
        {
            return response(['error' => 'This Token cannot be used, you need to obtain a new one.'], Response::HTTP_BAD_REQUEST);
        }
        elseif($exception instanceof TokenInvalidException)
        {
            return response(['error' => 'Token could not be verified.'], Response::HTTP_BAD_REQUEST);
        }
        elseif($exception instanceof TokenExpiredException)
        {
            return response(['error' => 'Token Expired.'], Response::HTTP_BAD_REQUEST);
        }
        elseif($exception instanceof JWTException)
        {
            return response(['error' => 'Token not found.'], Response::HTTP_BAD_REQUEST);
        }
        elseif($exception instanceof \Illuminate\Database\QueryException)
        {
            return response(['error' => $exception->errorInfo], Response::HTTP_BAD_REQUEST);
        }


        return parent::render($request, $exception);
    }
}
