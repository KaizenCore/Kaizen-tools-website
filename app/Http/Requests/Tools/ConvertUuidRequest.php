<?php

namespace App\Http\Requests\Tools;

use Illuminate\Foundation\Http\FormRequest;

class ConvertUuidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'input' => ['required', 'string', 'min:1', 'max:36'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'input.required' => 'Please provide a username or UUID.',
            'input.min' => 'Input is too short.',
            'input.max' => 'Input is too long.',
        ];
    }
}
