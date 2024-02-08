<?php

namespace App\Enums;

use App\Traits\EnumCasesTrait;

enum MindRuleEnum: string
{
    use EnumCasesTrait;

    case manual = 'Manual';
    case latest = 'Latest';
}
