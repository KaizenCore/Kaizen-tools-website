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

export function Pagination<T>({ data }: PaginationProps<T>) {
    const { meta } = data;

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
                    disabled={!data.links.prev || meta.current_page === 1}
                    asChild={!!data.links.first && meta.current_page !== 1}
                    title="First page"
                >
                    {data.links.first && meta.current_page !== 1 ? (
                        <Link
                            href={data.links.first}
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
                    disabled={!data.links.prev}
                    asChild={!!data.links.prev}
                    title="Previous page"
                >
                    {data.links.prev ? (
                        <Link
                            href={data.links.prev}
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

                        if (link.url) {
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
                                        href={link.url}
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
                    disabled={!data.links.next}
                    asChild={!!data.links.next}
                    title="Next page"
                >
                    {data.links.next ? (
                        <Link
                            href={data.links.next}
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
                        !data.links.next || meta.current_page === meta.last_page
                    }
                    asChild={
                        !!data.links.last &&
                        meta.current_page !== meta.last_page
                    }
                    title="Last page"
                >
                    {data.links.last && meta.current_page !== meta.last_page ? (
                        <Link
                            href={data.links.last}
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
