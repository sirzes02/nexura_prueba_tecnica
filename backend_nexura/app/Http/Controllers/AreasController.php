<?php

namespace App\Http\Controllers;

use App\Models\Areas;
use stdClass;
use Throwable;

class AreasController extends Controller
{
    function get_areas()
    {
        $status = "OK";
        $result = "";
        $error = new stdClass;

        try {
            $areas = Areas::all();

            $result = $areas;
        } catch (Throwable $th) {
            $status = "Error";
            $error->error =  [$th->getMessage()];
        }

        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }
}
