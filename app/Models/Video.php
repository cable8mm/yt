<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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

    public function channel(): BelongsTo
    {
        return $this->belongsTo(Channel::class);
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('published_at', 'desc');
    }

    public function scopeByLiveBroadcasting(Builder $query, $active = true): void
    {
        $query->where('is_live_broadcasting', $active);
    }
}
