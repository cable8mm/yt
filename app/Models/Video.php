<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $table = 'vcf_videos';

    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }
}
