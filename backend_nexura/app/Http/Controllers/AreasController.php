<?php

namespace App\Http\Controllers;

use App\Models\Areas;
use Illuminate\Http\JsonResponse;
use stdClass;
use Throwable;

class AreasController extends Controller
{
    /**
     * @return JsonResponse
     */
    function get_areas(): JsonResponse
    {
        $status = "OK";
        $result = "";
        $error = new stdClass();

        try {
            $result = Areas::all();

        } catch (Throwable $th) {
            $status = "Error";
            $error->error =  [$th->getMessage()];
        }

        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }
}
