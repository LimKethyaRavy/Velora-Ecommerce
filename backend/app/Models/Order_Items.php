<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order_Items extends Model
{
    use HasFactory;

    protected $fillable = [

        'order_id',
        'product_variant_id',
        'quantity',
        'unit_price'
        
    ];

    public function order(){

    return $this->belongsTo(Orders::class, 'order_id');
    }

    public function variants(){

    return $this->belongsTo(Product_Variant::class, 'product_variant_id');

    }

    
}
