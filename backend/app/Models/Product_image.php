<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_image extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'variant_id',
        'image_url',
        'is_primary'
    ];

    protected $casts = [
        'is_primary' => 'boolean'
    ];

    public function product(){

        return $this->belongsTo(Product::class, 'product_id');
    }

    public function variant(){
        return $this->belongsTo(Product_Variant::class, 'variant_id');
    }
}
