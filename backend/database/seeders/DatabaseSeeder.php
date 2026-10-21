<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Suppliers;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $suppliers = [];

        for($i = 1; $i <= 10; $i++){
            $suppliers[] = Suppliers::create([
                'name' => "Supplier Atelier $i",
                'contact_name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'phone' => fake()->unique()->phoneNumber(),
                'address' => fake()->address(),
                'is_active' => fake()->is_bool()
            ]);
        }

        $gender = ['Men', 'Women', 'Unisex'];
        
    }
}
