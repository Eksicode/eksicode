<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PageCategoryRequest extends FormRequest
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
            'name' => 'required|max:255|min:3',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The name field is required.'
        ];
    }
}
