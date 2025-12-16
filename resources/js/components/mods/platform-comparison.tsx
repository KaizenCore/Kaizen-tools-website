import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ModSource } from '@/types/mods';
import {
    ArrowUpRight,
    Box,
    Download,
    ExternalLink,
    Package,
} from 'lucide-react';
import { useMemo } from 'react';

interface PlatformComparisonProps {
    sources: ModSource[];
}

function getPlatformUrl(source: ModSource): string {
    if (source.project_url) {
        return source.project_url;
    }

    if (source.platform === 'modrinth') {
        return `https://modrinth.com/mod/${source.external_slug || source.external_id}`;
    }

    return `https://www.curseforge.com/minecraft/mc-mods/${source.external_slug || source.external_id}`;
}

const LOADER_ICONS: Record<string, string> = {
    forge: '🔨',
    fabric: '🧵',
    neoforge: '⚡',
    quilt: '🧶',
};

const getLoaderIcon = (loader: string): string => {
    return LOADER_ICONS[loader.toLowerCase()] ?? '📦';
};

const LOADER_COLORS: Record<string, string> = {
    forge: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400',
    fabric: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400',
    neoforge:
        'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400',
    quilt: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400',
};

const getLoaderColor = (loader: string): string => {
    return (
        LOADER_COLORS[loader.toLowerCase()] ??
        'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400'
    );
};

export function PlatformComparison({ sources }: PlatformComparisonProps) {
    const modrinth = useMemo(
        () => sources.find((s) => s.platform === 'modrinth'),
        [sources],
    );
    const curseforge = useMemo(
        () => sources.find((s) => s.platform === 'curseforge'),
        [sources],
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="size-5" />
                    Télécharger depuis
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                {modrinth && (
                    <PlatformCard
                        name="Modrinth"
                        source={modrinth}
                        platform="modrinth"
                    />
                )}
                {curseforge && (
                    <PlatformCard
                        name="CurseForge"
                        source={curseforge}
                        platform="curseforge"
                    />
                )}
                {!modrinth && !curseforge && (
                    <p className="col-span-2 text-center text-sm text-muted-foreground">
                        Aucune plateforme disponible
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function PlatformCard({
    name,
    source,
    platform,
}: {
    name: string;
    source: ModSource;
    platform: 'modrinth' | 'curseforge';
}) {
    const url = getPlatformUrl(source);

    // Platform-specific styling
    const platformStyles = {
        modrinth: {
            gradient: 'from-green-500/10 via-emerald-500/5 to-transparent',
            border: 'border-green-500/30 hover:border-green-500/50',
            text: 'text-green-600 dark:text-green-400',
            icon: <Box className="size-5" />,
            buttonBg:
                'bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30',
            shadow: 'hover:shadow-green-500/10',
        },
        curseforge: {
            gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
            border: 'border-orange-500/30 hover:border-orange-500/50',
            text: 'text-orange-600 dark:text-orange-400',
            icon: <Package className="size-5" />,
            buttonBg:
                'bg-orange-500/10 hover:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
            shadow: 'hover:shadow-orange-500/10',
        },
    };

    const styles = platformStyles[platform];

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative overflow-hidden rounded-xl border-2 bg-gradient-to-br ${styles.gradient} ${styles.border} ${styles.shadow} p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
        >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={styles.text}>{styles.icon}</div>
                    <span className={`text-lg font-bold ${styles.text}`}>
                        {name}
                    </span>
                </div>
                <ArrowUpRight
                    className={`${styles.text} size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                />
            </div>

            {/* Stats */}
            <div className="mb-4 flex items-center gap-2">
                <div
                    className={`${styles.buttonBg} flex size-9 items-center justify-center rounded-lg`}
                >
                    <Download className="size-4" />
                </div>
                <div>
                    <div className="text-sm font-bold">
                        {source.formatted_downloads}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        téléchargements
                    </div>
                </div>
            </div>

            {/* Latest Version */}
            {source.latest_version && (
                <div className="mb-3">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                        Dernière version
                    </p>
                    <Badge variant="secondary" className="text-xs font-medium">
                        {source.latest_version}
                    </Badge>
                </div>
            )}

            {/* Loaders */}
            {source.supported_loaders &&
                source.supported_loaders.length > 0 && (
                    <div className="mb-3">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                            Loaders supportés
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {source.supported_loaders.map((loader) => (
                                <Badge
                                    key={loader}
                                    variant="outline"
                                    className={`text-xs capitalize transition-transform hover:scale-105 ${getLoaderColor(loader)}`}
                                >
                                    <span className="mr-1">
                                        {getLoaderIcon(loader)}
                                    </span>
                                    {loader}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

            {/* Minecraft Versions */}
            {source.supported_versions &&
                source.supported_versions.length > 0 && (
                    <div className="mb-4">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                            Versions Minecraft
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {source.supported_versions
                                .slice(0, 6)
                                .map((version) => (
                                    <Badge
                                        key={version}
                                        variant="secondary"
                                        className="border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-700 transition-transform hover:scale-105 dark:bg-emerald-500/20 dark:text-emerald-300"
                                    >
                                        {version}
                                    </Badge>
                                ))}
                            {source.supported_versions.length > 6 && (
                                <Badge variant="outline" className="text-xs">
                                    +{source.supported_versions.length - 6}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

            {/* Visit Button */}
            <Button
                variant="outline"
                size="sm"
                className={`pointer-events-none w-full ${styles.buttonBg} transition-all duration-300 group-hover:shadow-md`}
            >
                <ExternalLink className="mr-2 size-4" />
                Visiter {name}
            </Button>
        </a>
    );
}
