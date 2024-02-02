<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->state([
            'name' => 'Sam',
            'email' => 'cable8mm@gmail.com',
            'password' => Hash::make('asdfasdf'),
            'timezone' => 'Pacific/Auckland',
        ])->create();

        User::factory()->count(10)->create();
    }
}
