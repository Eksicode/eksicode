<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class PostRequest extends FormRequest
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
            'title' => 'required',
            'post' => 'required',
            'tags' => 'required',
            'category_id' => 'required',
            'user_id' => 'required',
            'status' => 'required',
        ];
    }


    public function messages()
    {
        return [
            'title.required' => 'The title field is required.',
            'post.required' => 'The post field is required.',
            'tags.required' => 'The tag field is required.',
            'category_id.required' => 'The category field is required.',
            'user_id.required' => 'The user field is required.',
            'status.required' => 'The status field is required.',
        ];
    }
    
}
