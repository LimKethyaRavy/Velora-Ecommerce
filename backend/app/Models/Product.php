<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'supplier_id',
        'name',
        'slug',
        'description',
        'base_price',
        'is_active'
    ];


    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function Category(){

    return $this->belongsTo(Category::class, 'category_id');

    }

    public function supplier(){

    return $this->belongsTo(Suppliers::class, 'supplier_id');

    }

    public function variant(){

    return $this->hasMany(Product_Variants::class, 'product_id');

    }

    public function image(){

    return $this->hasMany(Product_image::class, 'product_id');

    }

    public function primaryImage(){

    return $this->hasOne(Product_image::class,'primary_image')->where('is_primary', true);

    }

    

}
