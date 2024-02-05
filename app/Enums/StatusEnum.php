<?php

namespace App\Enums;

use App\Traits\EnumCasesTrait;

enum StatusEnum
{
    use EnumCasesTrait;

    case ready;
    case waiting;
    case running;
    case failed;
    case finished;

    public static function loadingWhen()
    {
        return [self::waiting->name, self::running->name];
    }

    public static function failedWhen()
    {
        return [self::failed->name];
    }

    public static function running()
    {
        return self::running->name;
    }

    public static function failed()
    {
        return self::failed->name;
    }

    public static function finished()
    {
        return self::finished->name;
    }
}
