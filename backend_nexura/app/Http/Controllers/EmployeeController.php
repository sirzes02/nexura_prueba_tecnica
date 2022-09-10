<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use stdClass;
use Throwable;

class EmployeeController extends Controller
{
    function get_employees()
    {
        $status = "OK";
        $result = "";
        $error = new stdClass;

        try {
            $employees = Employee::all();

            foreach ($employees as $employee) {
                $employee->roles;
                $employee->area;
            }

            $result = $employees;
        } catch (Throwable $th) {
            $status = "Error";
            $error->error =  [$th->getMessage()];
        }

        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }

    function get_one(Request $request)
    {
        $status = "OK";
        $result = "";
        $error = new stdClass;

        $validator = Validator::make($request->all(), [
            "id" => "required|numeric"
        ]);

        if ($validator->fails()) {
            $error = $validator->errors();
        }

        if ($validator->passes()) {
            try {
                $employee = Employee::findOrFail($request->id);

                $employee->roles;
                $employee->area;

                $result = $employee;
            } catch (Throwable $th) {
                $status = "Error";
                $error->error =  [$th->getMessage()];
            }
        }

        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }

    function create(Request $request)
    {
        $status = "OK";
        $result = "";
        $error = new stdClass;

        $validator = Validator::make($request->all(), [
            "nombre" => "required|string|max:255",
            "email" => "required|string|unique:empleado,email|max:255|email",
            "sexo" => "required|string|max:1",
            "area_id" => "required|numeric|exists:areas,id",
            "boletin" => "required|boolean",
            "descripcion" => "required|string|max:255",
            "roles" => "required|array",
            "roles.*" => "required|numeric|exists:roles,id",
        ]);

        if ($validator->fails()) {
            $error = $validator->errors();
        }

        if ($validator->passes()) {
            $result = $request->all();

            DB::beginTransaction();

            try {
                $employee = new Employee;

                $employee->nombre = $request->nombre;
                $employee->email = $request->email;
                $employee->sexo = $request->sexo;
                $employee->area_id = $request->area_id;
                $employee->boletin = $request->boletin;
                $employee->descripcion = $request->descripcion;

                $employee->save();

                $employee->roles()->sync($request->roles);
                DB::commit();
            } catch (\Throwable $th) {
                DB::rollBack();
                $status = "Error";
                $error->error =  [$th->getMessage()];
            }
        }

        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }

    function update(Request $request)
    {
        $status = "OK";
        $result = "";
        $error = new stdClass;

        $validator = Validator::make($request->all(), [
            "id" => "required|numeric|exists:empleado,id",
            "nombre" => "string|max:255",
            "email" => "string|max:255|email",
            "sexo" => "string|max:1",
            "area_id" => "numeric|exists:areas,id",
            "boletin" => "boolean",
            "descripcion" => "string|max:255",
            "roles" => "array",
            "roles.*" => "numeric|exists:roles,id",
        ]);

        if ($validator->fails()) {
            $error = $validator->errors();
        }

        if ($validator->passes()) {
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
            } catch (\Throwable $th) {
                DB::rollBack();
                $status = "Error";
                $error->error =  [$th->getMessage()];
            }
        }

        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }

    function delete(Request $request)
    {
        $status = "OK";
        $result = "";
        $error = new stdClass;

        $validator = Validator::make($request->all(), [
            "id" => "required|numeric|exists:empleado,id",
        ]);

        if ($validator->fails()) {
            $error = $validator->errors();
        }

        if ($validator->passes()) {
            $result = $request->all();

            DB::beginTransaction();

            try {
                $employee = Employee::findOrFail($request->id);
                $employee->delete();

                DB::commit();
            } catch (\Throwable $th) {
                DB::rollBack();
                $status = "Error";
                $error->error =  [$th->getMessage()];
            }
        }

        return response()->json(["status" => $status, "result" => $result, "error" => $error]);
    }
}
