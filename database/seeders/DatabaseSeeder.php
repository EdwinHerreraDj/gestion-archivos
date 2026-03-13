<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory()->create([
            'name' => 'Alminares',
            'email' => 'super@alminares.es',
            'role' => 'Super Admin',
            'email_verified_at' => now(),
            'password' => Hash::make(env('PASSWORD_ADMIN')),
            'remember_token' => Str::random(10),
        ]);
    }
}
