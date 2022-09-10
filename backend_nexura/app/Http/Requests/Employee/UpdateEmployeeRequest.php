<?php

namespace App\Http\Requests\Employee;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\ValidationException;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            "id" => "required|numeric|exists:empleado,id",
            "nombre" => "string|max:255",
            "email" => "string|max:255|email",
            "sexo" => "string|max:1",
            "area_id" => "numeric|exists:areas,id",
            "boletin" => "boolean",
            "descripcion" => "string|max:255",
            "roles" => "array",
            "roles.*" => "numeric|exists:roles,id",
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $aux = (new ValidationException($validator))->errors();

        throw new HttpResponseException(response()->json(["error" => $aux, "status" => "error"]));
    }

}
