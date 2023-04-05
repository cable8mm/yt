<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiveVideo extends Model
{
    protected $table = 'vcf_live_videos';

    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }
}
