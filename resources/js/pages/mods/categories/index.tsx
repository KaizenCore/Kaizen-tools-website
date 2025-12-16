import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Category } from '@/types/mods';
import { Head, Link } from '@inertiajs/react';
import { Folder, Package } from 'lucide-react';

interface Props {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mods',
        href: '/mods',
    },
    {
        title: 'Categories',
        href: '/mods/categories',
    },
];

export default function CategoriesIndex({ categories }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mod Categories" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Mod Categories</h1>
                    <p className="text-muted-foreground">
                        Browse mods by category
                    </p>
                </div>

                {categories.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/mods/categories/${category.slug}`}
                            >
                                <Card className="h-full transition-shadow hover:shadow-md">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                                <Folder className="size-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {category.name}
                                                </CardTitle>
                                                {category.mods_count !==
                                                    undefined && (
                                                    <CardDescription>
                                                        {category.mods_count}{' '}
                                                        mod
                                                        {category.mods_count !==
                                                        1
                                                            ? 's'
                                                            : ''}
                                                    </CardDescription>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    {category.description && (
                                        <CardContent>
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {category.description}
                                            </p>
                                        </CardContent>
                                    )}
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="mt-12 flex flex-col items-center justify-center">
                        <Package className="size-16 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">
                            No categories found
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Run the seeder to populate categories.
                        </p>
                        <code className="mt-4 rounded bg-muted px-3 py-2 text-sm">
                            php artisan db:seed --class=ModCategorySeeder
                        </code>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
