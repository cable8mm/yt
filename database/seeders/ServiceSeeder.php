<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    private $seeds = [
        'Youtube',
        'Facebook',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->seeds as $seed) {
            Service::factory()->state([
                'name' => $seed,
                'on_service' => 1,
            ])->create();
        }
    }
}
