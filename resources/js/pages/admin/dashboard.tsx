import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Flag, Shield, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admin', href: '/admin' }];

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Admin Dashboard
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage players, review reports, and moderate the
                        community.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/admin/reports">
                        <Card className="cursor-pointer transition-all hover:border-primary/20 hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending Reports
                                </CardTitle>
                                <Flag className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">
                                    Review Reports
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Verify or reject player reports
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/players">
                        <Card className="cursor-pointer transition-all hover:border-primary/20 hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Players
                                </CardTitle>
                                <Users className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">
                                    Manage Players
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    View and override trust levels
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Trust System
                            </CardTitle>
                            <Shield className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">Overview</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                System health and statistics
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
