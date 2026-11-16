<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class VarinatfactoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            
        'sku' => strtoupper(fake() -> unique()->bothify('SKU-###-???')),
        'size' => fake()->randomElement(['S','M','L','XL','XXL']),
        'color' => fake()->safeColorName(),
        'price' => fake()->randomFloat(2,10,200),
        'stock_quantity' => fake()->numberBetween(5,50)
        ];
    }
}
