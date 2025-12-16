import { Pagination } from '@/components/mods/pagination';
import { ResourcePackCard } from '@/components/resource-packs/resource-pack-card';
import { ResourcePackCardSkeleton } from '@/components/resource-packs/resource-pack-card-skeleton';
import { ResourcePackFiltersComponent } from '@/components/resource-packs/resource-pack-filters';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type {
    Paginated,
    ResourcePack,
    ResourcePackFilters,
} from '@/types/resource-packs';
import { Head, router } from '@inertiajs/react';
import { Compass, Package, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    resourcePacks: Paginated<ResourcePack>;
    filters: ResourcePackFilters;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resource Packs',
        href: '/resource-packs',
    },
];

export default function ResourcePacksIndex({
    resourcePacks,
    filters,
}: Props) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const removeStartListener = router.on('start', () =>
            setIsLoading(true),
        );
        const removeFinishListener = router.on('finish', () =>
            setIsLoading(false),
        );

        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    const handleFilterChange = (newFilters: Partial<ResourcePackFilters>) => {
        router.get(
            '/resource-packs',
            { ...filters, ...newFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Browse Resource Packs" />

            <div className="mx-auto max-w-screen-2xl p-4 sm:p-6">
                <div className="mb-6 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Browse Minecraft Resource Packs
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Discover resource packs from Modrinth
                    </p>
                </div>

                <ResourcePackFiltersComponent
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                {isLoading ? (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        <ResourcePackCardSkeleton count={12} />
                    </div>
                ) : resourcePacks.data.length > 0 ? (
                    <>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {resourcePacks.data.map((pack) => (
                                <ResourcePackCard
                                    key={pack.id}
                                    resourcePack={pack}
                                />
                            ))}
                        </div>

                        {resourcePacks.meta.last_page > 1 && (
                            <div className="mt-8">
                                <Pagination data={resourcePacks} />
                            </div>
                        )}
                    </>
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
                                    ? 'No resource packs found'
                                    : 'No resource packs available'}
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
                                        Start searching for Minecraft resource
                                        packs from Modrinth.
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
