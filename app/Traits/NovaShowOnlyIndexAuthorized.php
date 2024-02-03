<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait NovaShowOnlyIndexAuthorized
{
    public function authorizedToView(Request $request)
    {
        return false;
    }

    public function authorizedToDelete(Request $request)
    {
        return false;
    }

    public function authorizedToUpdate(Request $request)
    {
        return false;
    }
}
