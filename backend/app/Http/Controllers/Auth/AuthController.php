<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;



class AuthController extends Controller
{
    // public function ensureCustomerPf(User $user): void {

    // if($user->role === "customer") {

    // $nameParts = explode('', $user->name, 2);

    // User::create([

    //     'user_id'  => $user->id,
    //     'first_name' => $nameParts[0] ?? $user->name,
    //     'last_name' => $nameParts[1] ?? ' ',

    // ]);
    // }

    // }

    public function index(){

    $users = User::lastest()->get();

    return response()->json([
        'success' => true,
        'message' => 'Get user successfully',
        'data' => $users
    ], 200);

    }

    public function register(Request $request) {

    try {

    $validated = $request->validate([

    'name' => 'required|string|max:255',
    'email' => 'required|email|max:255|unique:users',
    'password' => [
        'required',
        'confirmed',
        Password::min(8)->mixedCase()  
            ->numbers()
            ->symbols()    
            ->uncompromised()
    ]

    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'customer'
    ]);

    // $this->ensureCustomerPf($user);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'success' => true,
        'message' => 'User create successfully',
        'token' => $token,
        'token_type' => 'Bearer',
        'data' => $user

    ], 201);

    }catch(Exception $e){

    return response()->json([
        'success' => false,
        'message' => 'failed to create an account'. $e,

    ], 400);



    }

    }

    public function login(Request $request) {

    try {

    $credentials = $request->validate([

    'email' => 'required|email|',
    'password' => 'required|string' 

    ]);

    $user = User::where('email', strtolower($credentials[
        'email'
    ]))->first();

    if(!$user || !Hash::check($credentials['password'], $user->password)){

    return response()->json([

        'message' => 'Inccorect Email or Password'
    ], 401);

    }

    $user->tokens()->delete();

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'success' => true,
        'message' =>'Login Successfully',
        'token' => $token,
        'token_type' => 'Bearer',
        'user' =>$user
    ], 200);

    }catch(Exception $e){

    return response()->json([
        'success' => false,
        'message' => 'Error'.$e
        
    ], 500);

    }
    }
}
