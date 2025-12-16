import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types/mods';
import { Link } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';

interface PaginationProps<T> {
    data: Paginated<T>;
}

// Convert absolute URLs to relative paths to avoid HTTP/HTTPS issues
function toRelativeUrl(url: string | null): string | null {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        return urlObj.pathname + urlObj.search;
    } catch {
        return url; // Already a relative URL
    }
}

export function Pagination<T>({ data }: PaginationProps<T>) {
    const { meta } = data;

    // Convert all pagination links to relative URLs
    const links = {
        first: toRelativeUrl(data.links.first),
        last: toRelativeUrl(data.links.last),
        prev: toRelativeUrl(data.links.prev),
        next: toRelativeUrl(data.links.next),
    };

    if (meta.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium text-foreground">{meta.from}</span>{' '}
                to{' '}
                <span className="font-medium text-foreground">{meta.to}</span>{' '}
                of{' '}
                <span className="font-medium text-foreground">
                    {meta.total}
                </span>{' '}
                results
            </p>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="size-9"
                    disabled={!links.prev || meta.current_page === 1}
                    asChild={!!links.first && meta.current_page !== 1}
                    title="First page"
                >
                    {links.first && meta.current_page !== 1 ? (
                        <Link
                            href={links.first}
                            preserveScroll
                            preserveState
                        >
                            <ChevronsLeft className="size-4" />
                        </Link>
                    ) : (
                        <span>
                            <ChevronsLeft className="size-4" />
                        </span>
                    )}
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    className="size-9"
                    disabled={!links.prev}
                    asChild={!!links.prev}
                    title="Previous page"
                >
                    {links.prev ? (
                        <Link
                            href={links.prev}
                            preserveScroll
                            preserveState
                        >
                            <ChevronLeft className="size-4" />
                        </Link>
                    ) : (
                        <span>
                            <ChevronLeft className="size-4" />
                        </span>
                    )}
                </Button>

                <div className="hidden items-center gap-1 sm:flex">
                    {meta.links.map((link, index) => {
                        if (index === 0 || index === meta.links.length - 1) {
                            return null;
                        }

                        const relativeUrl = toRelativeUrl(link.url);
                        if (relativeUrl) {
                            return (
                                <Button
                                    key={link.label}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    className="min-w-9"
                                    asChild
                                >
                                    <Link
                                        href={relativeUrl}
                                        preserveScroll
                                        preserveState
                                    >
                                        {link.label}
                                    </Link>
                                </Button>
                            );
                        }

                        return (
                            <span
                                key={link.label}
                                className="px-2 text-sm text-muted-foreground"
                            >
                                {link.label}
                            </span>
                        );
                    })}
                </div>

                <div className="flex items-center gap-1 text-muted-foreground sm:hidden">
                    <span className="text-sm">
                        Page {meta.current_page} of {meta.last_page}
                    </span>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="size-9"
                    disabled={!links.next}
                    asChild={!!links.next}
                    title="Next page"
                >
                    {links.next ? (
                        <Link
                            href={links.next}
                            preserveScroll
                            preserveState
                        >
                            <ChevronRight className="size-4" />
                        </Link>
                    ) : (
                        <span>
                            <ChevronRight className="size-4" />
                        </span>
                    )}
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    className="size-9"
                    disabled={
                        !links.next || meta.current_page === meta.last_page
                    }
                    asChild={
                        !!links.last &&
                        meta.current_page !== meta.last_page
                    }
                    title="Last page"
                >
                    {links.last && meta.current_page !== meta.last_page ? (
                        <Link
                            href={links.last}
                            preserveScroll
                            preserveState
                        >
                            <ChevronsRight className="size-4" />
                        </Link>
                    ) : (
                        <span>
                            <ChevronsRight className="size-4" />
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
}
