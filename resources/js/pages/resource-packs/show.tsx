import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { ResourcePack, ResourcePackVersion } from '@/types/resource-packs';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Box,
    Calendar,
    Download,
    ExternalLink,
    Heart,
    Loader2,
    Package,
    Tag,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    resourcePack: ResourcePack;
    versions: ResourcePackVersion[];
}

export default function ResourcePackShow({ resourcePack, versions }: Props) {
    const [selectedVersion, setSelectedVersion] = useState<string>(
        versions[0]?.id || '',
    );

    if (!resourcePack || !resourcePack.id) {
        return (
            <AppLayout
                breadcrumbs={[
                    { title: 'Resource Packs', href: '/resource-packs' },
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
        { title: 'Resource Packs', href: '/resource-packs' },
        {
            title: resourcePack.name || 'Unknown',
            href: `/resource-packs/${resourcePack.slug}`,
        },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const currentVersion = versions.find((v) => v.id === selectedVersion);
    const primaryFile = currentVersion?.files.find((f) => f.primary);
    const downloadUrl = primaryFile?.url || currentVersion?.files[0]?.url;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={resourcePack.name} />

            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
                <Link
                    href="/resource-packs"
                    className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:gap-3 hover:text-foreground"
                >
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                    Back to resource packs
                </Link>

                <div className="grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <Card className="animate-in overflow-hidden duration-500 fade-in slide-in-from-bottom-4">
                            <CardContent className="p-6 sm:p-8">
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                                    {resourcePack.icon_url ? (
                                        <img
                                            src={resourcePack.icon_url}
                                            alt={resourcePack.name}
                                            className="size-24 shrink-0 rounded-2xl object-cover shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 sm:size-28 dark:ring-white/10"
                                        />
                                    ) : (
                                        <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg ring-1 ring-black/5 sm:size-28 dark:ring-white/10">
                                            <span className="text-4xl font-bold text-primary sm:text-5xl">
                                                {resourcePack.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1 space-y-4">
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                                {resourcePack.name}
                                            </h1>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                by {resourcePack.author}
                                            </p>
                                        </div>

                                        <Badge
                                            variant="outline"
                                            className="border-green-500/30 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                                        >
                                            <Box className="mr-1 size-3" />
                                            Modrinth
                                        </Badge>

                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg bg-muted/50 p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <Download className="size-5" />
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold">
                                                        {
                                                            resourcePack.formatted_downloads
                                                        }
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        downloads
                                                    </div>
                                                </div>
                                            </div>
                                            {resourcePack.followers > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                                        <Heart className="size-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {resourcePack.followers.toLocaleString()}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            followers
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {resourcePack.updated_at && (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                                        <Calendar className="size-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {formatDate(
                                                                resourcePack.updated_at,
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            last updated
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div>
                                    <h2 className="mb-3 text-lg font-semibold">
                                        Description
                                    </h2>
                                    <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                                        {resourcePack.summary ||
                                            'No description available.'}
                                    </p>
                                </div>

                                {resourcePack.categories &&
                                    resourcePack.categories.length > 0 && (
                                        <>
                                            <Separator className="my-6" />
                                            <div>
                                                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                                    <Tag className="size-5" />
                                                    Categories
                                                </h2>
                                                <div className="flex flex-wrap gap-2">
                                                    {resourcePack.categories.map(
                                                        (category) => (
                                                            <Badge
                                                                key={category}
                                                                variant="secondary"
                                                                className="transition-colors hover:bg-secondary/80"
                                                            >
                                                                {category}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                {resourcePack.gallery &&
                                    resourcePack.gallery.length > 0 && (
                                        <>
                                            <Separator className="my-6" />
                                            <div>
                                                <h2 className="mb-3 text-lg font-semibold">
                                                    Gallery
                                                </h2>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    {resourcePack.gallery.map(
                                                        (image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image.url}
                                                                alt={
                                                                    image.title ||
                                                                    `Screenshot ${index + 1}`
                                                                }
                                                                className="rounded-lg object-cover shadow-md ring-1 ring-black/5 dark:ring-white/10"
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6 lg:col-span-4">
                        {versions.length > 0 && (
                            <Card className="animate-in duration-500 fade-in slide-in-from-bottom-4">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Download className="size-4" />
                                        Download
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Select Version
                                        </label>
                                        <Select
                                            value={selectedVersion}
                                            onValueChange={setSelectedVersion}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a version" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {versions.map((version) => (
                                                    <SelectItem
                                                        key={version.id}
                                                        value={version.id}
                                                    >
                                                        {version.name} (
                                                        {version.game_versions.join(
                                                            ', ',
                                                        )}
                                                        )
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {currentVersion && (
                                        <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Version
                                                </span>
                                                <span className="font-medium">
                                                    {
                                                        currentVersion.version_number
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Downloads
                                                </span>
                                                <span className="font-medium">
                                                    {currentVersion.downloads.toLocaleString()}
                                                </span>
                                            </div>
                                            {currentVersion.date_published && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Published
                                                    </span>
                                                    <span className="font-medium">
                                                        {formatDate(
                                                            currentVersion.date_published,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {downloadUrl && (
                                        <Button asChild className="w-full">
                                            <a
                                                href={downloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Download className="mr-2 size-4" />
                                                Download
                                            </a>
                                        </Button>
                                    )}

                                    {resourcePack.project_url && (
                                        <Button
                                            variant="outline"
                                            asChild
                                            className="w-full"
                                        >
                                            <a
                                                href={resourcePack.project_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="mr-2 size-4" />
                                                View on Modrinth
                                            </a>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {resourcePack.game_versions &&
                            resourcePack.game_versions.length > 0 && (
                                <Card className="animate-in delay-150 duration-500 fade-in slide-in-from-bottom-4">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <Box className="size-4" />
                                            Minecraft Versions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-1.5">
                                            {resourcePack.game_versions
                                                .slice(0, 12)
                                                .map((version, index) => (
                                                    <Badge
                                                        key={version}
                                                        variant="secondary"
                                                        className="animate-in border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-700 transition-all zoom-in-95 fade-in hover:scale-105 hover:shadow-sm dark:bg-emerald-500/20 dark:text-emerald-300"
                                                        style={{
                                                            animationDelay: `${index * 30}ms`,
                                                        }}
                                                    >
                                                        {version}
                                                    </Badge>
                                                ))}
                                            {resourcePack.game_versions.length >
                                                12 && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    +
                                                    {resourcePack.game_versions
                                                        .length - 12}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        <Card className="animate-in delay-300 duration-500 fade-in slide-in-from-bottom-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Package className="size-4" />
                                    Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between rounded-lg bg-muted/50 p-3">
                                    <span className="font-medium text-muted-foreground">
                                        Total Downloads
                                    </span>
                                    <span className="text-lg font-bold">
                                        {resourcePack.downloads.toLocaleString()}
                                    </span>
                                </div>
                                {resourcePack.followers > 0 && (
                                    <div className="flex justify-between rounded-lg bg-muted/50 p-3">
                                        <span className="font-medium text-muted-foreground">
                                            Followers
                                        </span>
                                        <span className="text-lg font-bold">
                                            {resourcePack.followers.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
