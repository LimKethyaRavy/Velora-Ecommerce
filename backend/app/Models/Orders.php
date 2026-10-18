<?php

namespace App\Models;

use Faker\Provider\Payment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_amount',
        'status',
        'payment_status',
        'shipping_address',
    ];

    public function user(){

    return $this->belongsTo(User::class, 'user_id');
    
    }

    public function payments(){

    return $this->hasMany(Payments::class, 'order_id');
    }

    public function latestpayments(){

        return $this->hasOne(Payments:: class, 'order_id')->latestOfMany();
    }

    // public function paymentStatus(){

    // return $this->hasMany(Payments::class, 'payment_status');

    // }

    public function shipping(){

    return $this->hasOne(Payments::class, 'shipping_address');
    }

    public function orderItem(){

        return $this->hasMany(Order_Items::class, 'order_id');
    }
}
