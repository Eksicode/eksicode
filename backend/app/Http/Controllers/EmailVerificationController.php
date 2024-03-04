<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

class EmailVerificationController extends Controller
{

    public function sendVerificationEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response(['message' => 'Email already verified.'], Response::HTTP_OK);
        }

        $request->user()->sendEmailVerificationNotification();
        return response(['message' => 'Email verification link sent!'], Response::HTTP_OK);
    }


    public function verify(EmailVerificationRequest $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return [
                'message' => 'Email already verified'
            ];
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return [
            'message'=>'Email has been verified'
        ];
    }
}
