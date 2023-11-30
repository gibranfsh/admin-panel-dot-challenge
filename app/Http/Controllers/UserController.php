<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserLoginRequest;
use App\Http\Requests\UserRegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Register a new user.
     *
     * @param  UserRegisterRequest  $request
     * @return JsonResponse
     *
     * @throws HttpResponseException
     */
    public function register(UserRegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (User::where('email', $data['email'])->count() === 1) {
            throw new HttpResponseException(response([
                "errors" => [
                    "message" => [
                        "Email already exists"
                    ]
                ]
            ], 400));
        }

        $user = new User($data);
        $user->password = Hash::make($data['password']);
        $user->save();

        return (new UserResource($user))->response()->setStatusCode(201);
    }

    /**
     * Log in a user.
     *
     * @param  UserLoginRequest  $request
     * @return UserResource
     *
     * @throws HttpResponseException
     */
    public function login(UserLoginRequest $request): UserResource
    {
        $data = $request->validated();

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw new HttpResponseException(response([
                "errors" => [
                    "message" => [
                        "Email or password is incorrect"
                    ]
                ]
            ], 401));
        }

        $user->token = Str::uuid()->toString();
        $user->save();

        return new UserResource($user);
    }

    /**
     * Get the authenticated user information.
     *
     * @param  Request  $request
     * @return UserResource
     */
    public function get(Request $request): UserResource
    {
        $user = Auth::user();

        if (!$user) {
            throw new HttpResponseException(response([
                "errors" => [
                    "message" => [
                        "Unauthenticated"
                    ]
                ]
            ], 401));
        }

        return new UserResource($user);
    }

    /**
     * Log out the authenticated user.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $user = Auth::user();
        $user->token = null;
        $user->save();

        return response()->json([
            "data" => [
                "message" => [
                    "Successfully logged out"
                ]
            ]
        ]);
    }
}
