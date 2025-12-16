import { ModCard } from '@/components/mods/mod-card';
import { Pagination } from '@/components/mods/pagination';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Category, Mod, Paginated } from '@/types/mods';
import { Head } from '@inertiajs/react';
import { Package } from 'lucide-react';

interface Props {
    category: Category;
    mods: Paginated<Mod>;
}

export default function CategoryShow({ category, mods }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Mods',
            href: '/mods',
        },
        {
            title: 'Categories',
            href: '/mods/categories',
        },
        {
            title: category.name,
            href: `/mods/categories/${category.slug}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${category.name} Mods`} />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">{category.name}</h1>
                    {category.description && (
                        <p className="text-muted-foreground">
                            {category.description}
                        </p>
                    )}
                </div>

                {mods.data.length > 0 ? (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {mods.data.map((mod) => (
                                <ModCard key={mod.id} mod={mod} />
                            ))}
                        </div>

                        <div className="mt-6">
                            <Pagination data={mods} />
                        </div>
                    </>
                ) : (
                    <div className="mt-12 flex flex-col items-center justify-center">
                        <Package className="size-16 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">
                            No mods in this category
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            There are no mods in the {category.name} category
                            yet.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
