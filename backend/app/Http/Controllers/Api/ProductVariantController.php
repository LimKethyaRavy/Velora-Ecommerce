<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product_Variant;
use App\Models\Product_Variants;
use Exception;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{

    public function index()
    {
        $variant = Product_Variant::with('product');

        return response()->json([
            'success' => true,
            'data' => $variant
        ]);
    }


    public function store(Request $request)
    {
        try {

            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
                'sku' => 'required|string|max:155',
                'size' => 'required|string|max:10',
                'color' => 'required|string|max:50',
                'price' => 'required|numeric|min:0',
                'stock_quantity' => 'required|integer|min:0'
            ]);

            $variant = Product_Variant::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Prodcut variant create successfully',
                'data' => $variant
            ]);
        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => "Error to creat prodcut varint $e"
            ]);
        }
    }

    public function show(string $id)
    {
        $variant = Product_Variant::with('product')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $variant
        ]);
    }


    public function update(Request $request, string $id)
    {
        try {

            $variant = Product_Variant::findOrFail($id);

            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
                'sku' => 'required|string|max:155',
                'size' => 'required|string|max:10',
                'color' => 'required|string|max:50',
                'price' => 'required|numberic|min:0',
                'stock_quantity' => 'required|integer|min:0'
            ]);

            $variant->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Prodcut update successfully'
            ]);
        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => "Error $e"
            ]);
        }
    }


    public function destroy(string $id) {

        $variant = Product_Variant::findOrFail($id);

        $product = $variant->product;

        if($product->variants()->count() <= 1){
            return response()->json([
                'success' => false,
            'message' => 'Cannot delete, A Prodcut must have at least one varinat'
            ]);
        }

        $variant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Prodcut varint delete successfully'
        ]);

    }
}
