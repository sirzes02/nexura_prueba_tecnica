<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use Illuminate\Http\JsonResponse;
use stdClass;
use Throwable;

class RolesController extends Controller
{
    /**
     * @return JsonResponse
     */
    function get_roles(): JsonResponse
    {
        $status = "OK";
        $result = "";
        $error = new stdClass;

        try {

            $result = Roles::all();

        } catch (Throwable $th) {
            $status = "Error";
            $error->error =  [$th->getMessage()];
        }

        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }
}
