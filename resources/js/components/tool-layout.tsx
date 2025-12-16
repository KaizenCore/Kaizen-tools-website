import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface ToolLayoutProps {
    title: string;
    description?: string;
    children: ReactNode;
    /** Sidebar/output panel content - shown on the right on desktop */
    sidebar?: ReactNode;
    /** If true, sidebar sticks to the top on scroll (desktop only) */
    stickySidebar?: boolean;
    /** Custom className for the main content area */
    className?: string;
    /** Alerts/notifications to show below the header */
    alerts?: ReactNode;
}

/**
 * A responsive layout component for tool pages.
 * - Mobile: Single column, stacked layout
 * - Desktop: Two columns with main content and optional sidebar
 */
export function ToolLayout({
    title,
    description,
    children,
    sidebar,
    stickySidebar = true,
    className,
    alerts,
}: ToolLayoutProps) {
    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground md:text-base">
                        {description}
                    </p>
                )}
            </div>

            {/* Alerts */}
            {alerts && <div className="flex flex-col gap-3">{alerts}</div>}

            {/* Main Content Area */}
            {sidebar ? (
                <div className="grid gap-6 xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_450px]">
                    {/* Main Content */}
                    <div className={cn('flex flex-col gap-6', className)}>
                        {children}
                    </div>

                    {/* Sidebar */}
                    <div
                        className={cn(
                            'flex flex-col gap-6',
                            stickySidebar && 'xl:sticky xl:top-4 xl:self-start',
                        )}
                    >
                        {sidebar}
                    </div>
                </div>
            ) : (
                <div
                    className={cn(
                        'mx-auto w-full max-w-5xl flex flex-col gap-6',
                        className,
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

interface ToolSectionProps {
    title?: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

/**
 * A section within a tool page with optional title and description.
 */
export function ToolSection({
    title,
    description,
    children,
    className,
}: ToolSectionProps) {
    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {(title || description) && (
                <div className="flex flex-col gap-1">
                    {title && (
                        <h2 className="text-lg font-semibold">{title}</h2>
                    )}
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}

interface ToolGridProps {
    children: ReactNode;
    /** Number of columns on different breakpoints */
    cols?: {
        default?: number;
        sm?: number;
        md?: number;
        lg?: number;
    };
    className?: string;
}

/**
 * A responsive grid for tool inputs/controls.
 */
export function ToolGrid({
    children,
    cols = { default: 1, sm: 2, lg: 3 },
    className,
}: ToolGridProps) {
    const gridCols = cn(
        'grid gap-4',
        cols.default === 1 && 'grid-cols-1',
        cols.default === 2 && 'grid-cols-2',
        cols.default === 3 && 'grid-cols-3',
        cols.sm === 2 && 'sm:grid-cols-2',
        cols.sm === 3 && 'sm:grid-cols-3',
        cols.md === 2 && 'md:grid-cols-2',
        cols.md === 3 && 'md:grid-cols-3',
        cols.md === 4 && 'md:grid-cols-4',
        cols.lg === 2 && 'lg:grid-cols-2',
        cols.lg === 3 && 'lg:grid-cols-3',
        cols.lg === 4 && 'lg:grid-cols-4',
        className,
    );

    return <div className={gridCols}>{children}</div>;
}

interface OutputPanelProps {
    title?: string;
    children: ReactNode;
    className?: string;
    /** Actions like copy button */
    actions?: ReactNode;
}

/**
 * A panel for displaying tool output (commands, generated code, etc.)
 */
export function OutputPanel({
    title = 'Output',
    children,
    className,
    actions,
}: OutputPanelProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-3 rounded-lg border bg-card p-4',
                className,
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{title}</h3>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
            {children}
        </div>
    );
}
