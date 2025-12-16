import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
    password: string;
    className?: string;
}

interface PasswordRequirement {
    label: string;
    met: boolean;
}

function calculatePasswordStrength(password: string): {
    strength: 'weak' | 'fair' | 'good' | 'strong';
    score: number;
    requirements: PasswordRequirement[];
} {
    const requirements: PasswordRequirement[] = [
        {
            label: 'At least 8 characters',
            met: password.length >= 8,
        },
        {
            label: 'Contains uppercase letter',
            met: /[A-Z]/.test(password),
        },
        {
            label: 'Contains lowercase letter',
            met: /[a-z]/.test(password),
        },
        {
            label: 'Contains number',
            met: /\d/.test(password),
        },
        {
            label: 'Contains special character',
            met: /[^A-Za-z0-9]/.test(password),
        },
    ];

    const metCount = requirements.filter((r) => r.met).length;
    const score = (metCount / requirements.length) * 100;

    let strength: 'weak' | 'fair' | 'good' | 'strong';
    if (score < 40) {
        strength = 'weak';
    } else if (score < 60) {
        strength = 'fair';
    } else if (score < 80) {
        strength = 'good';
    } else {
        strength = 'strong';
    }

    return { strength, score, requirements };
}

export default function PasswordStrengthIndicator({
    password,
    className,
}: PasswordStrengthIndicatorProps) {
    const { strength, score, requirements } = useMemo(
        () => calculatePasswordStrength(password),
        [password],
    );

    if (!password) {
        return null;
    }

    const strengthConfig = {
        weak: {
            color: 'bg-red-500 dark:bg-red-600',
            text: 'text-red-600 dark:text-red-400',
            label: 'Weak',
        },
        fair: {
            color: 'bg-orange-500 dark:bg-orange-600',
            text: 'text-orange-600 dark:text-orange-400',
            label: 'Fair',
        },
        good: {
            color: 'bg-yellow-500 dark:bg-yellow-600',
            text: 'text-yellow-600 dark:text-yellow-400',
            label: 'Good',
        },
        strong: {
            color: 'bg-green-500 dark:bg-green-600',
            text: 'text-green-600 dark:text-green-400',
            label: 'Strong',
        },
    };

    const config = strengthConfig[strength];

    return (
        <div
            className={cn(
                'animate-in space-y-3 duration-300 fade-in slide-in-from-top-1',
                className,
            )}
        >
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                        Password strength
                    </span>
                    <span className={cn('font-medium', config.text)}>
                        {config.label}
                    </span>
                </div>
                <div className="flex gap-1.5">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'h-1.5 flex-1 rounded-full bg-muted transition-all duration-300',
                                i < Math.ceil(score / 25) && config.color,
                            )}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-1.5 rounded-md border border-border/50 bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                    Password requirements:
                </p>
                <ul className="space-y-1">
                    {requirements.map((req, index) => (
                        <li
                            key={index}
                            className={cn(
                                'flex items-center gap-2 text-xs transition-colors duration-200',
                                req.met
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {req.met ? (
                                <Check className="size-3.5 shrink-0" />
                            ) : (
                                <X className="size-3.5 shrink-0" />
                            )}
                            <span>{req.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
