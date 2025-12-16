import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { SkinSearch } from '@/types/skins';
import { Link } from '@inertiajs/react';
import { User } from 'lucide-react';

interface SkinCardProps {
    search: SkinSearch;
}

export function SkinCard({ search }: SkinCardProps) {
    return (
        <Link href={`/skins/${search.username}`} className="group">
            <Card className="h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-primary/5">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="relative shrink-0 overflow-hidden rounded-lg bg-muted">
                            <img
                                src={`https://mc-heads.net/avatar/${search.username}/64`}
                                alt={search.username}
                                className="size-14 object-cover transition-transform duration-200 group-hover:scale-110"
                                loading="lazy"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold transition-colors duration-200 group-hover:text-primary">
                                {search.username}
                            </h3>
                            <p className="truncate font-mono text-xs text-muted-foreground">
                                {search.uuid.slice(0, 8)}...
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <User className="size-3.5 shrink-0" />
                            <span className="truncate">
                                {new Date(
                                    search.searched_at,
                                ).toLocaleDateString()}
                            </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            View Skin
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
