<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Products;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    protected $table = 'products';

    public function index(Request $request)
    {
        $query = Products::with(['category', 'suppliers']);

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
                'supplier_id' => 'required|exists:supplier,id',
                'name' => 'required|string|max:255',
                'slug' => 'required|string|max:155',
                'description' => 'required|string|max:255',
                'base_price' => 'required|numeric|min:0',
                'is_active' => 'boolean'
            ]);

            $prodcut = Products::create($validated);

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
        $prodcut = Products::with(['category', 'suppliers', 'product_variants', 'product_image'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $prodcut
        ]);
    }


    public function update(Request $request, string $id)
    {
        try {

            $prodcut = Products::findOrFail($id);

            $validated = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'supplier_id' => 'required|exists:suppliers,id',
                'name' => 'required|string|max:255',
                'slug' => ['required', 'string', 'max:155', Rule::unique('products', 'slug')->ignore($prodcut->id)],
                'description' => 'required|string|max:255',
                'base_price' => 'required|numeric|min:0',
                'is_active' => 'boolean'
            ]);

            $prodcut->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'prodcut update successfully',
                'data' => $prodcut
            ]);
        } catch (Exception $e) {

            return response()->json([
                'message' => "Error $e"
            ]);
        }
    }


    public function destroy(string $id)
    {
        $prodcut = Products::findOrFail($id);

        if ($prodcut->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete active prodcut',

            ], 422);
        }

        $prodcut->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product delete successfully'
        ]);
    }
}
