<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiveVideo extends Model
{
    const CREATED_AT = 'created';

    const UPDATED_AT = 'modified';

    protected $casts = [
        'scheduled_start_time' => 'datetime',
        'scheduled_end_time' => 'datetime',
        'published' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }
}
