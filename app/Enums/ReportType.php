<?php

namespace App\Enums;

enum ReportType: string
{
    case Cheating = 'cheating';
    case Scamming = 'scamming';
    case Toxicity = 'toxicity';
    case SuspiciousAccount = 'suspicious_account';

    public function label(): string
    {
        return match ($this) {
            self::Cheating => 'Cheating',
            self::Scamming => 'Scamming',
            self::Toxicity => 'Toxicity',
            self::SuspiciousAccount => 'Suspicious Account',
        };
    }

    public function weight(): int
    {
        return match ($this) {
            self::Cheating => 25,
            self::Scamming => 30,
            self::Toxicity => 10,
            self::SuspiciousAccount => 15,
        };
    }
}
