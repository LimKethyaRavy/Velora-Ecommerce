<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Product_image;
use Exception;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
   
    public function index()
    {
        $image = Product_image::with('product')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $image
        ]);
    }

  
    public function store(Request $request, Product $product)
    {
        try{

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'required|exists:product_variants',
            'image_url' => 'required|string',
            'is_primary' => 'boolean'
        ]);

        $image = $product->images()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product image add successfully',
            'data' => $image
        ], 201);

        }catch(Exception $e){

        return response()->json([
            'success' => false,
            'message' => "Error $e"
        ]);

        }
    }

    
    public function show(string $id)
    {
        $image = Product_image::with('product')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $image
        ]);
    }

    public function update(Request $request, string $id, Product $product)
    {
        try{

        $image = Product_image::findOrFail($id);

           $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'required|exists:product_variants',
            'image_url' => 'required|string',
            'is_primary' => 'boolean'
        ]);

          $image = $product->images()->update($validated);

          return response()->json([
            'success' => true,
            'message' => "prodcut image update successfully",
            'data' => $image
          ], 201);


        }catch(Exception $e){

        return response()->json([
            'success' => false,
            'message' => "Error $e"
        ]);

        }
    }

    public function destroy(string $id)
    {
        $image = Product_image::findOrFail($id);

        if($image->is_primary) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete primary image Please set anther image first'
            ], 422);
        }

        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Prodcut image delete successfully'
        ]);
    }
}
