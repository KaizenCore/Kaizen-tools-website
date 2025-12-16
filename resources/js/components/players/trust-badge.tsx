import { Badge } from '@/components/ui/badge';
import type { TrustLevel } from '@/types/players';
import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

interface TrustBadgeProps {
    level: TrustLevel;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
}

const trustConfig: Record<
    TrustLevel,
    {
        icon: typeof CheckCircle2;
        className: string;
        defaultLabel: string;
    }
> = {
    trusted: {
        icon: CheckCircle2,
        className:
            'border-green-500/30 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
        defaultLabel: 'Trusted',
    },
    neutral: {
        icon: HelpCircle,
        className:
            'border-gray-500/30 bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400',
        defaultLabel: 'Neutral',
    },
    suspect: {
        icon: AlertTriangle,
        className:
            'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
        defaultLabel: 'Suspect',
    },
    unknown: {
        icon: CheckCircle2,
        className:
            'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
        defaultLabel: 'No Reports',
    },
};

const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-2.5',
    lg: 'text-base py-1.5 px-3',
};

export function TrustBadge({ level, label, size = 'md' }: TrustBadgeProps) {
    const config = trustConfig[level];
    const Icon = config.icon;

    return (
        <Badge
            variant="outline"
            className={`${config.className} ${sizeClasses[size]} inline-flex items-center gap-1`}
        >
            <Icon
                className={
                    size === 'sm'
                        ? 'size-3'
                        : size === 'lg'
                          ? 'size-5'
                          : 'size-4'
                }
            />
            {label ?? config.defaultLabel}
        </Badge>
    );
}
