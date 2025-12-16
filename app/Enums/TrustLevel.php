<?php

namespace App\Enums;

enum TrustLevel: string
{
    case Trusted = 'trusted';
    case Neutral = 'neutral';
    case Suspect = 'suspect';
    case Unknown = 'unknown';

    public function label(): string
    {
        return match ($this) {
            self::Trusted => 'Trusted',
            self::Neutral => 'Neutral',
            self::Suspect => 'Suspect',
            self::Unknown => 'No Reports',
        };
    }

    public static function fromScore(int $score): self
    {
        return match (true) {
            $score >= 80 => self::Trusted,
            $score >= 40 => self::Neutral,
            $score > 0 => self::Suspect,
            default => self::Unknown,
        };
    }
}
