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
use Cloudinary\Cloudinary;
use Illuminate\Support\Facades\Log;

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

        $uploadedPaths = [];

        try {

            $cloundinary = new Cloudinary();

            $product = DB::transaction(function () use (
                $validated,
                $request,
                $cloundinary,
                &$uploadedPaths
            ) {

                $variants = $validated['product_variants'] ?? [];
                unset(
                    $validated['product_variants'],
                    $validated['images']
                );

                $product = Product::create($validated);

                if (!empty($variants)) {

                    $product->product_variant()->createMany(
                        $variants
                    );
                }

                if ($request->hasFile('images')) {

                    foreach ($request->file('images') as $index => $image) {

                        $uploadedFile = $cloundinary->uploadApi()->upload($image->getRealPath(), [
                            'folder' => 'velora-ecommerce/products'
                        ]);

                        $uploadedPaths[] = $uploadedFile['public_id'];

                        $product->product_image()->create([
                            'image_url' => $uploadedFile['secure_url'],
                            'is_primary' => $index === 0,
                            'cloudinary_id' => $uploadedFile['public_id']
                        ]);
                    }
                }

                return $product;
            });
        } catch (Exception $e) {

            foreach ($uploadedPaths as $publicId) {
                try {

                    $cloundinary->uploadApi()->destroy($publicId);
                } catch (\Throwable $cleanupError) {


                    Log::error('Cloundinary failed', [
                        'public_id' => $publicId,
                        'error' => $cleanupError->getMessage()
                    ]);
                }
            }

            Log::error('Product creation failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create product'
            ], 500);
        }


        $product->load([
            'category',
            'supplier',
            'product_variant',
            'product_image',
            'primaryImage'
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }


    public function show(string $id)
    {
        $prodcut = Product::with(['Category', 'supplier', 'product_variant', 'product_image'])->findOrFail($id);

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
            'removed_image_ids' => 'nullable|array',
            'removed_image_ids.*' => [
                'integer',
                Rule::exists('product_images', 'id')
                    ->where('product_id', $prodcut->id),
            ],
            'primary_image_id' => [
                'nullable',
                'integer',
                Rule::exists('product_images', 'id')
                    ->where('product_id', $prodcut->id),
            ],
        ]);

        $uploadedPaths = [];
        $deletedImagePaths = [];
        $cloundinary = new Cloudinary();

        try {

            DB::transaction(function () use (
                $request,
                $prodcut,
                $validated,
                $cloundinary,
                &$uploadedPaths,
                &$deletedImagePaths
            ) {



                $variants = $validated['product_variants'] ?? [];

                $productData = $validated;

                unset(
                    $productData['product_variants'],
                    $productData['images'],
                    $productData['removed_image_ids'],
                    $productData['primary_image_id']
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

                $removedImageIds = $validated['removed_image_ids'] ?? [];
                if (!empty($removedImageIds)) {
                    $imagesToDelete = $prodcut->product_image()
                        ->whereIn('id', $removedImageIds)
                        ->get();

                    foreach ($imagesToDelete as $imageToDelete) {
                        if ($imageToDelete->cloudinary_id) {
                            $deletedImagePaths[] = $imageToDelete->cloudinary_id;
                        }
                    }

                    $prodcut->product_image()
                        ->whereIn('id', $removedImageIds)
                        ->delete();
                }

                $remainingImages = $prodcut->product_image()->orderBy('id')->get();
                $requestedPrimaryId = $validated['primary_image_id'] ?? null;
                $remainingPrimaryId = $remainingImages->contains(
                    'id',
                    $requestedPrimaryId
                )
                    ? (int) $requestedPrimaryId
                    : $remainingImages->first()?->id;

                $prodcut->product_image()->update(['is_primary' => false]);
                if ($remainingPrimaryId) {
                    $prodcut->product_image()
                        ->where('id', $remainingPrimaryId)
                        ->update(['is_primary' => true]);
                }

                $cloundinary = new Cloudinary();


                if ($request->hasFile('images')) {

                    $hasPrimaryImage = (bool) $remainingPrimaryId;
                    foreach ($request->file('images') as $image) {

                        $uploadedFile = $cloundinary->uploadApi()->upload(
                            $image->getRealPath(),
                            [
                                'folder' => 'velora-ecommerce/products'
                            ]
                        );

                        $publicId = $uploadedFile['public_id'];

                        $uploadedPaths[] = $publicId;

                        $prodcut->product_image()->create([
                            'image_url' => $uploadedFile['secure_url'],
                            'is_primary' => !$hasPrimaryImage,
                            'cloudinary_id' => $publicId
                        ]);

                        $hasPrimaryImage = true;
                    }
                }
            });

            foreach ($deletedImagePaths as $publicId) {
                try {
                    $cloundinary->uploadApi()->destroy($publicId);
                } catch (\Throwable $cleanupError) {
                    Log::error('Cloudinary image removal failed', [
                        'public_id' => $publicId,
                        'error' => $cleanupError->getMessage(),
                    ]);
                }
            }

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
                    $cloundinary->uploadApi()->destroy($path);
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

        $cloundinary = new Cloudinary();

        try {

        DB::transaction(function () use ($prodcut, $cloundinary) {

            foreach ($prodcut->product_image as $image) {
                try {
                    $cloundinary->uploadApi()->destroy($image->cloudinary_id);
                } catch (\Throwable $cleanupError) {
                    report($cleanupError);
                }
            }

            $prodcut->product_image()->delete();
            $prodcut->product_variant()->delete();
            $prodcut->delete();
        });

        }catch (\Throwable $e) {

            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product delete successfully'
        ]);
    }
}
