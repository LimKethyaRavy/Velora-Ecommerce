<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product_Variants;
use Exception;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
   
    public function index()
    {
        $variant = Product_Variants::with('products');
    }

 
    public function store(Request $request)
    {
        try{

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'sku' => 'required|string|max:155',
            'size' => 'required|string|max:10',
            'color' => 'required|string|max:50',
            'price' => 'required|numberic|min:0',
            'stock_quantity' => 'required|integer|min:0'
        ]);

        $variant = Product_Variants::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Prodcut variant create successfully',
            'data' => $variant
        ]);



        }catch(Exception $e){

        return response()->json([
            'success' => false,
            'message' => "Error to creat prodcut varint $e"
        ]);

        }
    }

    public function show(string $id)
    {
        
    }

   
    public function update(Request $request, string $id)
    {
        
    }


    public function destroy(string $id)
    {
        
    }
}
