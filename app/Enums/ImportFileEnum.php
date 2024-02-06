<?php

namespace App\Enums;

use App\Traits\EnumCasesTrait;

enum ImportFileEnum: string
{
    use EnumCasesTrait;

    case channel = 'Channel';
    case video = 'Video';
}
