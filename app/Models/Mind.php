<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Mind extends Model
{
    use HasFactory;

    protected $casts = [
        'displayed_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function videos(): BelongsToMany
    {
        return $this->belongsToMany(Video::class, 'videos_minds');
    }
}
