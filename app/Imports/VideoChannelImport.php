<?php

namespace App\Imports;

use App\Models\Channel;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class VideoChannelImport implements SkipsEmptyRows, ToModel, WithHeadingRow, WithValidation
{
    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Channel([
            'featured_video_url' => $row['video_url'],
        ]);
    }

    public function rules(): array
    {
        return [
            'video_url' => ['required', 'string'],
        ];
    }
}
