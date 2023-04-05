<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiveVideo extends Model
{
    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }
}
