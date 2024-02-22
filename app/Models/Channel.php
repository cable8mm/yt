<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Laravel\Nova\Actions\Actionable;
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Searchable;

class Channel extends Model
{
    use Actionable, HasFactory, Searchable;

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

    public function pastCrawlEnd(): void
    {
        $this->update([
            'youtube_published_before_at' => null,
        ]);
    }

    public function futureCrawlEnd(Carbon $youtubePublishedAfterAt): void
    {
        $this->update([
            'youtube_published_after_at' => $youtubePublishedAfterAt,
        ]);
    }

    /* SCOUT require methods */

    /**
     * Get the name of the index associated with the model.
     */
    public function searchableAs(): string
    {
        return 'channels_index';
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    #[SearchUsingFullText(['description'])]
    public function toSearchableArray(): array
    {
        return [
            'id' => (int) $this->id,
            'name' => (string) $this->name,
            'description' => (string) $this->description,
        ];
    }

    /**
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable(): bool
    {
        return $this->is_active;
    }
}
