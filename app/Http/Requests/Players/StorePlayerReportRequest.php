<?php

namespace App\Http\Requests\Players;

use App\Enums\ReportType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePlayerReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'report_type' => ['required', 'string', Rule::enum(ReportType::class)],
            'reason' => ['required', 'string', 'min:10', 'max:1000'],
            'evidence_url' => ['nullable', 'url', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'report_type.required' => 'Please select a report type.',
            'report_type.enum' => 'Invalid report type selected.',
            'reason.required' => 'Please provide a reason for your report.',
            'reason.min' => 'The reason must be at least 10 characters.',
            'reason.max' => 'The reason must not exceed 1000 characters.',
            'evidence_url.url' => 'Please provide a valid URL for the evidence.',
        ];
    }
}
