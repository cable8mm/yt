<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Nova\Actions\Actionable;
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Searchable;

class Video extends Model
{
    use Actionable, HasFactory, Searchable;

    protected $guarded = [];

    protected $casts = [
        'published_at' => 'datetime',
        'has_caption' => 'boolean',
        'is_active' => 'boolean',
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

    /* SCOUT require methods */

    /**
     * Get the name of the index associated with the model.
     */
    public function searchableAs(): string
    {
        return 'videos_index';
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
            'channel_id' => (int) $this->channel_id,
            'title' => (string) $this->title,
            'description' => (string) $this->description,
        ];
    }

    /**
     * Modify the query used to retrieve models when making all of the models searchable.
     */
    protected function makeAllSearchableUsing(Builder $query): Builder
    {
        return $query->with('channel');
    }

    /**
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable(): bool
    {
        return $this->is_active;
    }
}
