<?php

namespace App\Http\Controllers;

use App\Http\Requests\Employee\CreateEmployeeRequest;
use App\Http\Requests\Employee\DeleteEmployeeRequest;
use App\Http\Requests\Employee\FindEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use stdClass;
use Throwable;

class EmployeeController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function get_employees(): JsonResponse
    {
        $status = "OK";
        $result = "";
        $error = new stdClass;

        try {
            $result = Employee::with(["roles", "area"])->get();
        } catch (Throwable $th) {
            $status = "Error";
            $error->error = [$th->getMessage()];
        }

        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }

    /**
     * @param FindEmployeeRequest $request
     * @return JsonResponse
     */
    public function get_one(FindEmployeeRequest $request): JsonResponse
    {
        $status = "OK";
        $result = "";
        $error = new stdClass();

        try {
            $result = Employee::with(["roles", "area"])->findOrFail($request->id);
        } catch (Throwable $th) {
            $status = "Error";
            $error->error = [$th->getMessage()];
        }


        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }

    /**
     * @param CreateEmployeeRequest $request
     * @return JsonResponse
     */
    public function create(CreateEmployeeRequest $request): JsonResponse
    {
        DB::beginTransaction();
        $status = "OK";
        $error = new stdClass();
        $result = $request->all();

        try {
            $employee = new Employee();

            $employee->nombre = $request->nombre;
            $employee->email = $request->email;
            $employee->sexo = $request->sexo;
            $employee->area_id = $request->area_id;
            $employee->boletin = $request->boletin;
            $employee->descripcion = $request->descripcion;

            $employee->save();

            $employee->roles()->sync($request->roles);
            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            $status = "Error";
            $error->error = [$th->getMessage()];
        }


        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }

    /**
     * @param UpdateEmployeeRequest $request
     * @return JsonResponse
     */
    public function update(UpdateEmployeeRequest $request): JsonResponse
    {
        $status = "OK";
        $error = new stdClass();
        $result = $request->all();
        DB::beginTransaction();

        try {
            $employee = Employee::findOrFail($request->id);

            $employee->nombre = $request->nombre;
            $employee->email = $request->email;
            $employee->sexo = $request->sexo;
            $employee->area_id = $request->area_id;
            $employee->boletin = $request->boletin;
            $employee->descripcion = $request->descripcion;

            $employee->save();
            $employee->roles()->sync($request->roles);

            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            $status = "Error";
            $error->error = [$th->getMessage()];
        }


        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }

    /**
     * @param DeleteEmployeeRequest $request
     * @return JsonResponse
     */
    public function delete(DeleteEmployeeRequest $request): JsonResponse
    {
        $status = "OK";
        $error = new stdClass();
        $result = $request->all();
        DB::beginTransaction();

        try {
            $employee = Employee::findOrFail($request->id);
            $employee->delete();

            DB::commit();

        } catch (Throwable $th) {
            DB::rollBack();
            $status = "Error";
            $error->error = [$th->getMessage()];
        }

        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }
}
