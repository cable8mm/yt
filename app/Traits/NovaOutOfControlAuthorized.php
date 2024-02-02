<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait NovaOutOfControlAuthorized
{
    public static function authorizedToCreate(Request $request)
    {
        return false;
    }
}
