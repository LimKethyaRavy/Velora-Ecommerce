<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{

    public function index(Request $request)
    {

        $query = Category::with(['children', 'parent', 'products']);
        
        if($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        if($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $categories = $query->paginate(10);

            

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);

    }


    public function store(Request $request)
    {
        try {

            $validate = $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'required|string|max:255|unique:categories,slug',
                'gender' => ['required', Rule::in(['women', 'men', 'unisex'])],
                'parent_id' => 'nullable|exists:categories,id'

            ]);


            $categories = Category::create($validate);

            return response()->json([
                'success' => true,
                'message' => 'Category create successfully',
                'data' => $categories

            ], 201);
        } catch (Exception $e) {

            return response()->json([
                'message' => "Error $e"
            ]);
        }
    }


    public function show(string $id)
    {
        $categories = Category::with('parent', 'children', 'products')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }


    public function update(Request $request, string $id)
    {
        $categories = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => ['required', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($categories->id)],
            'gender' => ['required', Rule::in(['women', 'men', 'unisex'])],
            'parent_id' => 'nullable|exists:categories,id'
        ]);

        $categories->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category update successfully',
            'data' => $categories
        ]);
    }


    public function destroy(string $id)
    {
        $categories = Category::findOrFail($id);

        if ($categories->children()->count() > 0) {

            return response()->json([

                'success' => false,
                'message' => 'Cannot delete main category while sub-category still have'

            ], 422);
        }

        if ($categories->products()->count() > 0) {

            return response()->json([
                'success' => false,
                'message' => 'Cannot delete this category because it still have active products'
            ], 422);
        }

        $categories->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category delete successfully',

        ], 200);
    }
}
