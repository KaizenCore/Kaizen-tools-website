import { ModCard } from '@/components/mods/mod-card';
import { ModFiltersComponent } from '@/components/mods/mod-filters';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Category, Mod, ModFilters, Paginated } from '@/types/mods';
import { Head, InfiniteScroll, router } from '@inertiajs/react';
import { Loader2, Package, Search, Zap } from 'lucide-react';
import { useCallback } from 'react';

interface Props {
    mods: Paginated<Mod>;
    categories: Category[];
    filters: ModFilters;
    isLiveSearch?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mods',
        href: '/mods',
    },
];

export default function ModsIndex({
    mods,
    categories,
    filters,
    isLiveSearch,
}: Props) {
    const handleFilterChange = useCallback(
        (newFilters: Partial<ModFilters>) => {
            router.get(
                '/mods',
                { ...filters, ...newFilters },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        },
        [filters],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Browse Mods" />

            <div className="mx-auto max-w-screen-2xl p-4 sm:p-6">
                <div className="mb-6 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Browse Minecraft Mods
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Discover mods from Modrinth and CurseForge
                    </p>
                </div>

                <ModFiltersComponent
                    filters={filters}
                    categories={categories}
                    onFilterChange={handleFilterChange}
                />

                {isLiveSearch && filters.search && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg border bg-card p-3">
                        <Badge variant="secondary" className="gap-1.5 px-2.5">
                            <Zap className="size-3.5" />
                            Live Search
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            Searching Modrinth &amp; CurseForge for "
                            {filters.search}"
                        </span>
                    </div>
                )}

                {mods.data.length > 0 ? (
                    isLiveSearch ? (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {mods.data.map((mod) => (
                                <ModCard key={mod.id} mod={mod} />
                            ))}
                        </div>
                    ) : (
                        <InfiniteScroll
                            data="mods"
                            onlyNext
                            preserveUrl
                            loading={() => (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                                </div>
                            )}
                        >
                            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                {mods.data.map((mod) => (
                                    <ModCard key={mod.id} mod={mod} />
                                ))}
                            </div>
                        </InfiniteScroll>
                    )
                ) : (
                    <div className="mt-16 flex flex-col items-center justify-center space-y-4 py-12">
                        <div className="flex size-20 items-center justify-center rounded-full bg-muted/50">
                            {filters.search ? (
                                <Search className="size-10 text-muted-foreground" />
                            ) : (
                                <Package className="size-10 text-muted-foreground" />
                            )}
                        </div>
                        <div className="space-y-2 text-center">
                            <h3 className="text-xl font-semibold">
                                {filters.search
                                    ? 'No mods found'
                                    : 'No mods available'}
                            </h3>
                            <p className="max-w-md text-sm text-muted-foreground">
                                {filters.search ? (
                                    <>
                                        No results found for "{filters.search}".{' '}
                                        <br className="hidden sm:inline" />
                                        Try adjusting your search terms or
                                        filters.
                                    </>
                                ) : (
                                    <>
                                        Get started by syncing mods from
                                        Modrinth and CurseForge.
                                    </>
                                )}
                            </p>
                        </div>
                        {!filters.search && (
                            <code className="mt-4 rounded-lg border bg-muted/50 px-4 py-3 font-mono text-sm">
                                php artisan mods:sync --sync --limit=50
                            </code>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
