<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_Variant extends Model
{
    use HasFactory;

    protected $table = 'product_variants'; 
    protected $guarded = [];



    protected $fillable = [

        'product_id',
        'sku',
        'size',
        'color',
        'price',
        'stock_quantity'

    ];

    public function product(){

    return $this->belongsTo(Product::class, 'product_id');

    }

    public function orderItems(){

        return $this->hasMany(Product_Variant::class, 'product_variant_id');

    }

    public function images(){

    return $this->hasMany(Product_Variant:: class, 'variant_id');

    }


}
