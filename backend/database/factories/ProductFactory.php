<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Suppliers;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         $name = fake()->unique()->words(3, true);

        return [

            'category_id' => Category::inRandomOrder()->first()?->id??1,
            'supplier_id' => Suppliers::inRandomOrder()->first()?->id??1,

            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(),
            'base_price' => fake()->randomFloat(2,10,500),
            'is_active' => true,
            'tags' => fake()->words(3)

            
           


        ];
    }
}
