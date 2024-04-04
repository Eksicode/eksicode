<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobRequest extends FormRequest
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
            'title' => 'required|max:255|min:3',
            'technology' => 'required',
            'contract_type' => 'required',
            'experience_level' => 'required',
            'requirements' => 'required',
            'company_name' => 'required',
            'country' => 'required',
            'state' => 'required',
            'city' => 'required',
            'remote' => 'required',
            'salary' => 'required',
            'email' => 'required',
            'website' => 'required|url:https',
            'validity_date' => 'required|date',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'The title field is required.',
            'technology.required' => 'The technology field is required.',
            'contract_type.required' => 'The contract type field is required.',
            'experience_level.required' => 'The experience level field is required.',
            'requirements.required' => 'The requirements field is required.',
            'company_name.required' => 'The company name field is required.',
            'country.required' => 'The location field is required.',
            'state.required' => 'The location field is required.',
            'city.required' => 'The location field is required.',
            'remote.required' => 'The remote field is required.',
            'salary.required' => 'The salary field is required.',
            'email.required' => 'The email field is required.',
            'website.required' => 'The website field is required.',
            'website.url' => 'The website must be a valid URL.',
            'validity_date.required' => 'The validity date field is required.',
            'validity_date.date' => 'The validity date must be a valid date.',
        ];
    }
}
