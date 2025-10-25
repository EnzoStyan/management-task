<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Kita tidak pakai Facade Auth, tapi helper auth()
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth; // Kita bisa pakai Facade JWTAuth jika perlu

class AuthController extends Controller
{
    /**
     * Registrasi user baru.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422); // Unprocessable Entity
        }

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash password [cite: 22]
        ]);

        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user 
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $credentials = $request->only('email', 'password');

        if (! $token = auth('api')->attempt($credentials)) {
            // Jika gagal, kirim response error Unauthorized
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Jika berhasil, kirim response dengan token
        return $this->respondWithToken($token);
    }

    /**
     * Mendapatkan detail user yang sedang login.
     * Method ini otomatis diproteksi oleh middleware 'auth:api' di constructor.
     */
    public function me()
    {
        // Helper auth('api')->user() akan mengambil data user berdasarkan token
        return response()->json(auth('api')->user());
    }

    /**
     * Logout user (Invalidate token).
     * Method ini otomatis diproteksi oleh middleware 'auth:api' di constructor.
     */
    public function logout()
    {
        auth('api')->logout(); // Invalidate token saat ini

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh token. User harus sudah login.
     * Method ini otomatis diproteksi oleh middleware 'auth:api' di constructor.
     */
    public function refresh()
    {
        // Membuat token baru berdasarkan token lama (yang masih valid)
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Format response JSON dengan token.
     *
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            // Mengambil TTL (Time To Live) token dari config jwt.php (dalam menit), dikali 60 jadi detik
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user() // Sertakan juga data user
        ]);
    }
}