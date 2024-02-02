<?php

namespace App\Enums;

use App\Traits\EnumCasesTrait;
use Illuminate\Support\Str;

enum TimezoneEnum: string
{
    use EnumCasesTrait;

    case Pacific_Auckland = 'Pacific/Auckland(UTC+13)';
    case Pacific_Chatham = 'Pacific/Chatham(UTC+12:45)';
    case Asia_Seoul = 'Asia/Seoul(UTC+9)';

    public static function tzCases(): array
    {
        $output = [];

        foreach (self::cases() as $value) {
            $replaced = self::timezone($value->name);
            $output[$replaced] = $value->value;
        }

        return $output;
    }

    public static function timezone($string): string
    {
        return Str::of($string)->replace('_', '/');
    }

    public static function kDefault(): string
    {
        return self::timezone(self::cases()[0]->name);
    }
}
