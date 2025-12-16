import { PlatformComparison } from '@/components/mods/platform-comparison';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Mod } from '@/types/mods';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Box,
    Calendar,
    Download,
    Loader2,
    Package,
    Tag,
    TrendingUp,
    User,
} from 'lucide-react';

interface Props {
    mod: Mod;
}

const getLoaderIcon = (loader: string) => {
    switch (loader.toLowerCase()) {
        case 'forge':
            return '🔨';
        case 'fabric':
            return '🧵';
        case 'neoforge':
            return '⚡';
        case 'quilt':
            return '🧶';
        default:
            return '📦';
    }
};

const getLoaderColor = (loader: string) => {
    switch (loader.toLowerCase()) {
        case 'forge':
            return 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400';
        case 'fabric':
            return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400';
        case 'neoforge':
            return 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400';
        case 'quilt':
            return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400';
        default:
            return 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400';
    }
};

export default function ModShow({ mod }: Props) {
    // Handle loading/missing state
    if (!mod || !mod.id) {
        return (
            <AppLayout
                breadcrumbs={[
                    { title: 'Mods', href: '/mods' },
                    { title: 'Chargement...', href: '#' },
                ]}
            >
                <Head title="Chargement..." />
                <div className="flex min-h-[400px] items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Mods', href: '/mods' },
        { title: mod.name || 'Unknown', href: `/mods/${mod.slug}` },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const allVersions = [
        ...new Set(mod.sources?.flatMap((s) => s.supported_versions) || []),
    ]
        .sort()
        .reverse();
    const allLoaders = [
        ...new Set(mod.sources?.flatMap((s) => s.supported_loaders) || []),
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={mod.name} />

            {/* Container with max-width for 4K */}
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
                {/* Back button with animation */}
                <Link
                    href="/mods"
                    className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:gap-3 hover:text-foreground"
                >
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                    Retour aux mods
                </Link>

                {/* Responsive Grid: Stack on mobile, 2/3 + 1/3 on desktop */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main Content - 2/3 on desktop */}
                    <div className="lg:col-span-8">
                        {/* Hero Section - Enhanced */}
                        <Card className="animate-in overflow-hidden duration-500 fade-in slide-in-from-bottom-4">
                            <CardContent className="p-6 sm:p-8">
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                                    {/* Large Icon */}
                                    {mod.icon_url ? (
                                        <img
                                            src={mod.icon_url}
                                            alt={mod.name}
                                            className="size-24 shrink-0 rounded-2xl object-cover shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 sm:size-28 dark:ring-white/10"
                                        />
                                    ) : (
                                        <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg ring-1 ring-black/5 sm:size-28 dark:ring-white/10">
                                            <span className="text-4xl font-bold text-primary sm:text-5xl">
                                                {mod.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Header Info */}
                                    <div className="min-w-0 flex-1 space-y-4">
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                                {mod.name}
                                            </h1>
                                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="size-4" />
                                                <span className="font-medium">
                                                    {mod.author}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Platform Badges */}
                                        <div className="flex flex-wrap gap-2">
                                            {mod.has_modrinth && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-green-500/30 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                                                >
                                                    <Box className="mr-1 size-3" />
                                                    Modrinth
                                                </Badge>
                                            )}
                                            {mod.has_curseforge && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-orange-500/30 bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                                                >
                                                    <Package className="mr-1 size-3" />
                                                    CurseForge
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Stats - Highlighted */}
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg bg-muted/50 p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <Download className="size-5" />
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold">
                                                        {
                                                            mod.formatted_downloads
                                                        }
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        téléchargements
                                                    </div>
                                                </div>
                                            </div>
                                            {mod.last_updated_at && (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                                        <Calendar className="size-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {formatDate(
                                                                mod.last_updated_at,
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            dernière mise à jour
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Description */}
                                <div>
                                    <h2 className="mb-3 text-lg font-semibold">
                                        Description
                                    </h2>
                                    <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                        {mod.summary ||
                                            'Aucune description disponible.'}
                                    </p>
                                </div>

                                {/* Categories */}
                                {mod.categories &&
                                    mod.categories.length > 0 && (
                                        <>
                                            <Separator className="my-6" />
                                            <div>
                                                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                                    <Tag className="size-5" />
                                                    Catégories
                                                </h2>
                                                <div className="flex flex-wrap gap-2">
                                                    {mod.categories.map(
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
                            </CardContent>
                        </Card>

                        {/* Platform Comparison */}
                        <div className="mt-6 animate-in duration-700 fade-in slide-in-from-bottom-4">
                            <PlatformComparison sources={mod.sources || []} />
                        </div>
                    </div>

                    {/* Sidebar - 1/3 on desktop */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Minecraft Versions */}
                        {allVersions.length > 0 && (
                            <Card className="animate-in delay-150 duration-500 fade-in slide-in-from-bottom-4">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Box className="size-4" />
                                        Versions Minecraft
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-1.5">
                                        {allVersions
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
                                        {allVersions.length > 12 && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                +{allVersions.length - 12}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Mod Loaders - Enhanced with icons */}
                        {allLoaders.length > 0 && (
                            <Card className="animate-in delay-300 duration-500 fade-in slide-in-from-bottom-4">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Package className="size-4" />
                                        Mod Loaders
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {allLoaders.map((loader, index) => (
                                            <Badge
                                                key={loader}
                                                variant="outline"
                                                className={`animate-in capitalize transition-all zoom-in-95 fade-in hover:scale-105 hover:shadow-sm ${getLoaderColor(loader)}`}
                                                style={{
                                                    animationDelay: `${index * 50}ms`,
                                                }}
                                            >
                                                <span className="mr-1">
                                                    {getLoaderIcon(loader)}
                                                </span>
                                                {loader}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Statistics */}
                        <Card className="animate-in delay-450 duration-500 fade-in slide-in-from-bottom-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <TrendingUp className="size-4" />
                                    Statistiques
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between rounded-lg bg-muted/50 p-3">
                                    <span className="font-medium text-muted-foreground">
                                        Total téléchargements
                                    </span>
                                    <span className="text-lg font-bold">
                                        {(
                                            mod.total_downloads ?? 0
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                {mod.sources && mod.sources.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            {mod.sources.map((source) => (
                                                <div
                                                    key={source.id}
                                                    className="flex justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
                                                >
                                                    <span
                                                        className={`font-medium ${
                                                            source.platform ===
                                                            'modrinth'
                                                                ? 'text-green-600 dark:text-green-400'
                                                                : 'text-orange-600 dark:text-orange-400'
                                                        }`}
                                                    >
                                                        {source.platform ===
                                                        'modrinth'
                                                            ? 'Modrinth'
                                                            : 'CurseForge'}
                                                    </span>
                                                    <span className="font-medium text-muted-foreground">
                                                        {(
                                                            source.downloads ??
                                                            0
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
