<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait NovaGeneralAuthorized
{
    public function authorizedToReplicate(Request $request)
    {
        return false;
    }
}
