import { Badge } from '@/components/ui/badge';
import type { ReportStatus } from '@/types/players';
import { Archive, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface StatusBadgeProps {
    status: ReportStatus;
    label?: string;
}

const statusConfig: Record<
    ReportStatus,
    {
        icon: typeof Clock;
        className: string;
        defaultLabel: string;
    }
> = {
    pending: {
        icon: Clock,
        className:
            'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
        defaultLabel: 'Pending',
    },
    verified: {
        icon: CheckCircle2,
        className:
            'border-green-500/30 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
        defaultLabel: 'Verified',
    },
    rejected: {
        icon: XCircle,
        className:
            'border-red-500/30 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
        defaultLabel: 'Rejected',
    },
    resolved: {
        icon: Archive,
        className:
            'border-gray-500/30 bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400',
        defaultLabel: 'Resolved',
    },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge
            variant="outline"
            className={`${config.className} inline-flex items-center gap-1`}
        >
            <Icon className="size-3" />
            {label ?? config.defaultLabel}
        </Badge>
    );
}
