<?php

namespace App\Imports;

use App\Models\Channel;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ChannelImport implements SkipsEmptyRows, ToModel, WithHeadingRow, WithValidation
{
    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Channel([
            'channelid' => $row['channel_id'],
        ]);
    }

    public function rules(): array
    {
        return [
            'channel_id' => ['required', 'string'],
        ];
    }
}
