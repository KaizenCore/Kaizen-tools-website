import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Mod } from '@/types/mods';
import { Link } from '@inertiajs/react';
import { Download, Tag } from 'lucide-react';
import { memo } from 'react';

interface ModCardProps {
    mod: Mod;
}

export const ModCard = memo(function ModCard({ mod }: ModCardProps) {
    return (
        <Link href={`/mods/${mod.slug}`} className="group">
            <Card className="h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-primary/5">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        {mod.icon_url ? (
                            <div className="relative shrink-0 overflow-hidden rounded-lg">
                                <img
                                    src={mod.icon_url}
                                    alt={mod.name}
                                    className="size-14 object-cover transition-transform duration-200 group-hover:scale-110"
                                />
                            </div>
                        ) : (
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 transition-colors duration-200 group-hover:from-primary/30 group-hover:to-primary/10">
                                <span className="text-xl font-bold text-primary">
                                    {mod.name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold transition-colors duration-200 group-hover:text-primary">
                                {mod.name}
                            </h3>
                            <p className="truncate text-sm text-muted-foreground">
                                by {mod.author}
                            </p>
                        </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {mod.summary || 'No description available.'}
                    </p>

                    {mod.categories && mod.categories.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                            {mod.categories.slice(0, 2).map((category) => (
                                <Badge
                                    key={category}
                                    variant="secondary"
                                    className="gap-1 text-xs"
                                >
                                    <Tag className="size-3" />
                                    {category}
                                </Badge>
                            ))}
                            {mod.categories.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                    +{mod.categories.length - 2}
                                </Badge>
                            )}
                        </div>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                            <Download className="size-4 shrink-0" />
                            <span className="truncate">
                                {mod.formatted_downloads}
                            </span>
                        </div>
                        <div className="flex shrink-0 gap-1.5">
                            {mod.has_modrinth && (
                                <Badge
                                    variant="outline"
                                    className="border-green-600/20 bg-green-600/10 text-xs font-semibold text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-500"
                                >
                                    MR
                                </Badge>
                            )}
                            {mod.has_curseforge && (
                                <Badge
                                    variant="outline"
                                    className="border-orange-500/20 bg-orange-500/10 text-xs font-semibold text-orange-500 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-400"
                                >
                                    CF
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
});
