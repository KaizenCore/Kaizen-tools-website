<?php

namespace App\Http\Requests\Mods;

use Illuminate\Foundation\Http\FormRequest;

class ModIndexRequest extends FormRequest
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
            'category' => ['nullable', 'string', 'exists:mod_categories,slug'],
            'loader' => ['nullable', 'string', 'in:forge,fabric,quilt,neoforge'],
            'version' => ['nullable', 'string', 'max:20'],
            'sort' => ['nullable', 'string', 'in:downloads,updated,name'],
            'order' => ['nullable', 'string', 'in:asc,desc'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
