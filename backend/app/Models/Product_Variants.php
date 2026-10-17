<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_Variants extends Model
{
    use HasFactory;

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

        return $this->hasMany(Product_Variants::class, 'product_variant_id');

    }

    public function images(){

    return $this->hasMany(Product_Variants:: class, 'variant_id');

    }


}
