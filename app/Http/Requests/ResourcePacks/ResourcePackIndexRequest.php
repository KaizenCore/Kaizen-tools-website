<?php

namespace App\Http\Requests\ResourcePacks;

use Illuminate\Foundation\Http\FormRequest;

class ResourcePackIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'version' => ['nullable', 'string', 'max:20'],
            'sort' => ['nullable', 'string', 'in:downloads,updated,name'],
            'order' => ['nullable', 'string', 'in:asc,desc'],
        ];
    }
}
