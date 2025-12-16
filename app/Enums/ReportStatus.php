<?php

namespace App\Enums;

enum ReportStatus: string
{
    case Pending = 'pending';
    case Verified = 'verified';
    case Rejected = 'rejected';
    case Resolved = 'resolved';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending Review',
            self::Verified => 'Verified',
            self::Rejected => 'Rejected',
            self::Resolved => 'Resolved',
        };
    }
}
