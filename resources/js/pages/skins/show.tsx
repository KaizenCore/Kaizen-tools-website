import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Skin } from '@/types/skins';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, Loader2, Shirt, User } from 'lucide-react';

interface Props {
    skin: Skin;
}

export default function SkinShow({ skin }: Props) {
    // Handle loading/missing state
    if (!skin || !skin.uuid) {
        return (
            <AppLayout
                breadcrumbs={[
                    { title: 'Skin Explorer', href: '/skins' },
                    { title: 'Loading...', href: '#' },
                ]}
            >
                <Head title="Loading..." />
                <div className="flex min-h-[400px] items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Skin Explorer', href: '/skins' },
        { title: skin.username, href: `/skins/${skin.username}` },
    ];

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${skin.username}'s Skin`} />

            {/* Container with max-width for 4K */}
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
                {/* Back button with animation */}
                <Link
                    href="/skins"
                    className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:gap-3 hover:text-foreground"
                >
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                    Back to Skin Explorer
                </Link>

                {/* Responsive Grid: Stack on mobile, 2/3 + 1/3 on desktop */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main Content - 2/3 on desktop */}
                    <div className="lg:col-span-8">
                        {/* Hero Section */}
                        <Card className="animate-in overflow-hidden duration-500 fade-in slide-in-from-bottom-4">
                            <CardContent className="p-6 sm:p-8">
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <img
                                            src={`https://mc-heads.net/avatar/${skin.username}/128`}
                                            alt={skin.username}
                                            className="size-28 rounded-2xl object-cover shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 dark:ring-white/10"
                                        />
                                    </div>

                                    {/* Header Info */}
                                    <div className="min-w-0 flex-1 space-y-4">
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                                {skin.username}
                                            </h1>
                                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="size-4" />
                                                <span className="font-mono text-xs">
                                                    {skin.uuid}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Model Badge */}
                                        <div className="flex flex-wrap gap-2">
                                            <Badge
                                                variant="outline"
                                                className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                                            >
                                                <Shirt className="mr-1 size-3" />
                                                {skin.is_slim
                                                    ? 'Slim (Alex)'
                                                    : 'Classic (Steve)'}
                                            </Badge>
                                        </div>

                                        {/* Download Button */}
                                        <Button
                                            onClick={() =>
                                                handleDownload(
                                                    skin.skin_url,
                                                    `${skin.username}_skin.png`,
                                                )
                                            }
                                            className="w-full sm:w-auto"
                                        >
                                            <Download className="size-4" />
                                            Download Skin
                                        </Button>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Full Body Preview */}
                                <div>
                                    <h2 className="mb-4 text-lg font-semibold">
                                        Full Body Preview
                                    </h2>
                                    <div className="flex items-center justify-center rounded-lg bg-muted/50 p-8">
                                        <img
                                            src={`https://mc-heads.net/body/${skin.username}/600`}
                                            alt={`${skin.username}'s skin`}
                                            className="max-h-[500px] w-auto object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Cape Section */}
                                {skin.cape_url && (
                                    <>
                                        <Separator className="my-6" />
                                        <div>
                                            <h2 className="mb-4 text-lg font-semibold">
                                                Cape
                                            </h2>
                                            <div className="flex items-center justify-center rounded-lg bg-muted/50 p-8">
                                                <img
                                                    src={skin.cape_url}
                                                    alt={`${skin.username}'s cape`}
                                                    className="max-h-[400px] w-auto object-contain"
                                                />
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    handleDownload(
                                                        skin.cape_url!,
                                                        `${skin.username}_cape.png`,
                                                    )
                                                }
                                                variant="outline"
                                                className="mt-4 w-full sm:w-auto"
                                            >
                                                <Download className="size-4" />
                                                Download Cape
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 1/3 on desktop */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Skin Previews */}
                        <Card className="animate-in delay-150 duration-500 fade-in slide-in-from-bottom-4">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Different Views
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Front View */}
                                <div>
                                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                                        Front View
                                    </p>
                                    <div className="flex items-center justify-center rounded-lg bg-muted/50 p-4">
                                        <img
                                            src={`https://mc-heads.net/player/${skin.username}/200`}
                                            alt="Front view"
                                            className="h-auto w-full max-w-[200px] object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Head View */}
                                <div>
                                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                                        Head (Isometric)
                                    </p>
                                    <div className="flex items-center justify-center rounded-lg bg-muted/50 p-4">
                                        <img
                                            src={`https://mc-heads.net/head/${skin.username}/200`}
                                            alt="Head view"
                                            className="h-auto w-full max-w-[150px] object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Avatar View */}
                                <div>
                                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                                        Avatar (2D)
                                    </p>
                                    <div className="flex items-center justify-center rounded-lg bg-muted/50 p-4">
                                        <img
                                            src={`https://mc-heads.net/avatar/${skin.username}/200`}
                                            alt="Avatar view"
                                            className="h-auto w-full max-w-[150px] object-contain"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Information */}
                        <Card className="animate-in delay-300 duration-500 fade-in slide-in-from-bottom-4">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between rounded-lg bg-muted/50 p-3">
                                    <span className="font-medium text-muted-foreground">
                                        Model Type
                                    </span>
                                    <span className="font-semibold">
                                        {skin.is_slim
                                            ? 'Slim (3px arms)'
                                            : 'Classic (4px arms)'}
                                    </span>
                                </div>
                                <div className="flex justify-between rounded-lg bg-muted/50 p-3">
                                    <span className="font-medium text-muted-foreground">
                                        UUID
                                    </span>
                                    <span className="ml-2 truncate font-mono text-xs">
                                        {skin.uuid}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
