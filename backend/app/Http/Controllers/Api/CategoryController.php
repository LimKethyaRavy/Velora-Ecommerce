<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    
    public function index()
    {
        $categories = Category::with('children')->whereNull('parent_id')->get();

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


        }catch(Exception $e){

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
            'slug' => 'required|string|max:255|unique:categories,slug',
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

        // ==========if category have sub category cannot deleye=============
        if($categories->children()->count() > 0){

            return response()->json([

                'success' => false,
                'message' => 'Cannot delete main category while sub-category still have'

            ], 422);

        }

        // =============if category have active prodcut cannot delete============ 
        if($categories->products()->count() > 0){

            return response()->json([
                'success' => false,
                'message' => 'Cannot delete this category because it still have active products'
            ], 422);
        }

        // =============if category did not have sub and did not have prodcut active can be delete======
        $categories->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category delete successfully',
            
        ], 200);
    }
}
