<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Product_image;
use App\Models\Product_Variant;
use App\Models\Suppliers;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class productSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $categories = Category::whereNotNull('parent_id')->get();

        $suppliers = Suppliers::all();

        if ($categories->isEmpty() || $suppliers->isEmpty()) {
            $this->command->error(
                'Category and suppliers is not exit'
            );

            return;
        }

        Product::factory()->count(30)->create()->each(
            function ($product) use ($categories, $suppliers) {


                $product->update([
                    'category_id' => fn () => $categories->random()->id,
                    'supplier_id' => fn () => $suppliers->random()->id
                ]);

                Product_Variant::factory()->count(rand(2, 3))->create([
                    'product_id' => $product->id,
                ]);
            }
        );

        $this->command->info('
        Successfully seeded 20 product with varinants');
    }
}
