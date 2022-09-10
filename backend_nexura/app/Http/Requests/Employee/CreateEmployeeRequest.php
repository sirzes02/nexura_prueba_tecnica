<?php

namespace App\Http\Requests\Employee;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\ValidationException;

class CreateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            "nombre" => "required|string|max:255",
            "email" => "required|string|unique:empleado,email|max:255|email",
            "sexo" => "required|string|max:1",
            "area_id" => "required|numeric|exists:areas,id",
            "boletin" => "required|boolean",
            "descripcion" => "required|string|max:255",
            "roles" => "required|array",
            "roles.*" => "required|numeric|exists:roles,id",
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $aux = (new ValidationException($validator))->errors();

        throw new HttpResponseException(response()->json(["error" => $aux, "status" => "error"]));
    }
}
