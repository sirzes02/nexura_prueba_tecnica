<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use stdClass;
use Throwable;

class RolesController extends Controller
{
    function get_roles()
    {
        $status = "OK";
        $result = "";
        $error = new stdClass;

        try {
            $areas = Roles::all();

            $result = $areas;
        } catch (Throwable $th) {
            $status = "Error";
            $error->error =  [$th->getMessage()];
        }

        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }
}
