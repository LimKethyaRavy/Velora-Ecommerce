<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Suppliers;
use Exception;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
  
     
    public function index()
    {
        $suppliers = Suppliers::withCount(
            'prodcuts'
        )->get();

        return response()->json([
            'success' => true,
            'data' => $suppliers
        ]);
    }

 
    public function store(Request $request)
    {
        try {

         $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' =>'required|string|max:255',
            'email' => 'nullable|email|unique:suppliers,email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string'
        ]);

        $suppliers = Suppliers::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'supplier crerate successfully',
            'data' => $suppliers,
            
        ], 201);

        }catch(Exception $e){

        return response()->json([
            'message' => "Error.$e."
        ]);



        }
       
    }


    public function show(string $id)
    {
        $suppliers = Suppliers::with('products.primaryImage')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $suppliers
        ]);
    }


    public function update(Request $request, string $id)
    {
        $supplider = Suppliers::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:suppliers,email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string'
        ]);

        $supplider->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Supplier update sucessfully',
            'data' => $supplider
        ]);
    }

 
    public function destroy(string $id)
    {
        $supplider = Suppliers::findOrFail($id);

        if($supplider->products()->count() > 0){
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete supplier because they still active with product'
            ], 422);
        }

        $supplider->delete();

        return response()->json([
            'success' => true,
            'message' => 'Supplier delete successfully'
        ]);
    }
}
