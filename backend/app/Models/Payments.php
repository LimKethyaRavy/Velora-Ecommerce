<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'amount',
        'currency',
        'payment_method',
        'payment_status',
        'md5',
        'qr_string',
        'bakong_txn_hash',
        'collected_by',
        'paid_at'
    ];

    public function order(){
        return $this->belongsTo(Orders::class, 'order_id');
    }

    
}
