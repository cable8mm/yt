<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    use HasFactory;

    const CREATED_AT = 'created';

    const UPDATED_AT = 'modified';

    protected $guarded = [];

    protected $casts = [
        'last_updated' => 'datetime',
        'is_auto_active' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function videos()
    {
        return $this->hasMany(Video::class);
    }
}
