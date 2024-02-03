<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    const CREATED_AT = 'created';

    const UPDATED_AT = 'modified';

    protected $guarded = [];

    protected $casts = [
        'scheduled_start_time' => 'datetime',
        'scheduled_end_time' => 'datetime',
        'published' => 'datetime',
        'has_caption' => 'boolean',
        'is_live_broadcasting' => 'boolean',
        'is_active' => 'boolean',
        'is_podcast_active' => 'boolean',
    ];

    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }
}
