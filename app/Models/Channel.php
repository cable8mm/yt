<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Nova\Actions\Actionable;

class Channel extends Model
{
    use Actionable, HasFactory;

    protected $guarded = [];

    protected $casts = [
        'youtube_published_after_at' => 'datetime',
        'youtube_published_before_at' => 'datetime',
        'is_auto_active' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function videos(): HasMany
    {
        return $this->hasMany(Video::class);
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('name', 'asc');
    }

    public function scopeShouldPastCrawled(Builder $query): void
    {
        $query->whereNotNull('youtube_published_before_at');
    }

    public function status(string $status): bool
    {
        return $this->update([
            'status' => $status,
        ]);
    }

    public function pastCrawlEnd()
    {
        $this->update([
            'youtube_published_before_at' => null,
        ]);
    }
}
