<?php

namespace App\Traits;

trait EnumCasesTrait
{
    public static function kvCases(): array
    {
        $output = [];

        foreach (self::cases() as $value) {
            $output[$value->name] = $value->value ?? $value->name;
        }

        return $output;
    }

    public static function kCases(): array
    {
        $output = [];

        foreach (self::cases() as $value) {
            $output[] = $value->name;
        }

        return $output;
    }

    public static function default(): string
    {
        return self::cases()[0]->value ?? self::cases()[0]->name;
    }

    public static function kDefault(): string
    {
        return self::cases()[0]->name;
    }
}
