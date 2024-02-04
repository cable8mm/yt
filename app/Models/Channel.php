<?php

namespace App\Models;

use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use InvalidArgumentException;
use Laravel\Nova\Actions\Actionable;

class Channel extends Model
{
    use Actionable, HasFactory;

    protected $guarded = [];

    protected $casts = [
        'last_updated_at' => 'datetime',
        'is_auto_active' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function videos(): HasMany
    {
        return $this->hasMany(Video::class);
    }

    public function status(string $status): bool
    {
        if (! StatusEnum::kValid($status)) {
            throw new InvalidArgumentException('Channel status InvalidArgumentException.');
        }

        return $this->update(['status' => $status]);
    }
}
