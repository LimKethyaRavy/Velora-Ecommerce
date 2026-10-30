<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Products;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    protected $table = 'products';

    public function index(Request $request)
    {
        $query = Product::with(['category', 'supplier', 'product_variant', 'product_image', 'primaryImage']);

        if ($request->filled('category_id')) {

            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('supplier_id')) {

            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->filled('search')) {

            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $prodcut = $query->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $prodcut
        ]);
    }


    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'supplier_id' => 'required|exists:suppliers,id',
                'name' => 'required|string|max:255',
                'slug' => 'required|string|max:155',
                'description' => 'required|string|max:655',
                'base_price' => 'required|numeric|min:0',
                'is_active' => 'boolean',

                'product_variants' => 'nullable|array',
                'product_variants.*.sku' => 'required|string|max:155',
                'product_variants.*.size' => 'required|string|max:10',
                'product_variants.*.color' => 'required|string|max:50',
                'product_variants.*.price' => 'required|numeric|min:0',
                'product_variants.*.stock_quantity' => 'required|integer|min:0',

                'images' => 'nullable|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048'
            ]);

            $prodcut = DB::transaction(function () use ($request, $validated) {

                $varinats = $validated['product_variants'] ?? [];
                unset(
                    $validated['product_variants'],
                    $validated['images']
                );

                $prodcut = Product::create($validated);

                if (!empty($varinats)) {

                    $prodcut->product_variant()->createMany(
                        $varinats
                    );
                }

                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {

                        $path = $image->store('products', 's3');

                        $prodcut->product_image()->create([
                            'image_url' => $path
                        ]);
                    }
                }

                return $prodcut;
            });

            $prodcut->load([
                'category',
                'supplier',
                'variant',
                'image'
            ]);


            return response()->json([
                'success' => true,
                'message' => 'Prodcut create successfully',
                'data' => $prodcut
            ], 201);
        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => "There an error to create prodcut $e",

            ]);
        }
    }


    public function show(string $id)
    {
        $prodcut = Product::with(['Category', 'suppliers', 'product_variant', 'product_image'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $prodcut
        ]);
    }

    public function update(Request $request, string $id)
    {
        $prodcut = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'name' => 'required|string|max:255',

            'slug' => [
                'required',
                'string',
                'max:155',
                Rule::unique('products', 'slug')->ignore($prodcut->id)
            ],

            'description' => 'required|string|max:655',
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',

            'product_variants' => 'nullable|array',

            'product_variants.*.id' => [
                'sometimes',
                'integer',
                Rule::exists('product_variants', 'id')
                    ->where('product_id', $prodcut->id),
            ],

            'product_variants.*.sku' => 'required|string|max:155',
            'product_variants.*.size' => 'required|string|max:10',
            'product_variants.*.color' => 'required|string|max:50',
            'product_variants.*.price' => 'required|numeric|min:0',
            'product_variants.*.stock_quantity' => 'required|integer|min:0',

            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $uploadedPaths = [];

        try {

            DB::transaction(function () use (
                $request,
                $prodcut,
                $validated,
                &$uploadedPaths
            ) {

             

                $variants = $validated['product_variants'] ?? [];

                $productData = $validated;

                unset(
                    $productData['product_variants'],
                    $productData['images']
                );

              

                $prodcut->update($productData);

           

                foreach ($variants as $variantData) {

                    if (isset($variantData['id'])) {

                        $variantId = $variantData['id'];

                        unset($variantData['id']);

                        $prodcut->product_variant()
                            ->where('id', $variantId)
                            ->update($variantData);
                    } else {

                        $prodcut->product_variant()
                            ->create($variantData);
                    }
                }

            

                if ($request->hasFile('images')) {

                    foreach ($request->file('images') as $image) {

                        $path = $image->store('products', 's3');

                        $uploadedPaths[] = $path;

                        $prodcut->product_image()->create([
                            'image_url' => $path,
                            'is_primary' => false,
                        ]);
                    }
                }
            });

         

            $prodcut->load([
                'category',
                'supplier',
                'product_variant',
                'product_image',
                'primaryImage'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $prodcut
            ], 200);
        } catch (\Throwable $e) {

           
            foreach ($uploadedPaths as $path) {
                try {
                    Storage::disk('s3')->delete($path);
                } catch (\Throwable $cleanupError) {
                    report($cleanupError);
                }
            }

            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update product'
            ], 500);
        }
    }


    public function destroy(string $id)
    {
        $prodcut = Product::findOrFail($id);

        if ($prodcut->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete active prodcut',

            ], 422);
        }

        DB::transaction(function () use ($prodcut) {
            foreach ($prodcut->product_image as $image) {
                if (Storage::disk('s3')->exists($image->image_url)) {
                    Storage::disk('s3')->delete($image->image_url);
                }
            }
        });

        $prodcut->product_image()->delete();
        $prodcut->product_variant()->delete();

        $prodcut->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product delete successfully'
        ]);
    }
}
