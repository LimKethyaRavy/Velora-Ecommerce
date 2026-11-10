<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function ensureCustomerPf(User $user): void {

    if($user->role === "customer") {

    $nameParts = explode('', $user->name, 2);

    User::create([

        'user_id'  => $user->id,
        'first_name' => $nameParts[0] ?? $user->name,
        'last_name' => $nameParts[1] ?? '',

    ]);
    }

    }

    public function register(Request $request) {

    

    }
}
