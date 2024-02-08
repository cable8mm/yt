<?php

namespace App\Enums;

use App\Traits\EnumCasesTrait;

enum LocaleEnum: string
{
    use EnumCasesTrait;

    case en = 'English';
    case ko = '한글';

    public static function real(string $locale): string
    {
        $realLocales = [
            self::en->name => 'en_US',
            self::ko->name => 'ko_KR',
        ];

        return $realLocales[$locale];
    }
}
