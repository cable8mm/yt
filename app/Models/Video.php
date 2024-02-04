<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Nova\Actions\Actionable;

class Video extends Model
{
    use Actionable, HasFactory;

    protected $guarded = [];

    protected $casts = [
        'scheduled_start_time' => 'datetime',
        'scheduled_end_time' => 'datetime',
        'published_at' => 'datetime',
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
