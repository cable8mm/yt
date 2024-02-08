<?php

namespace Database\Seeders;

use App\Models\Mind;
use Illuminate\Database\Seeder;

class MindSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Mind::factory()->count(10)->create();
    }
}
