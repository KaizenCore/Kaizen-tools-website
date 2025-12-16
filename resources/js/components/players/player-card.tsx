import { Card, CardContent } from '@/components/ui/card';
import type { Player } from '@/types/players';
import { Link } from '@inertiajs/react';
import { TrustBadge } from './trust-badge';

interface PlayerCardProps {
    player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
    return (
        <Link href={`/players/${player.username}`}>
            <Card className="group cursor-pointer transition-all duration-200 hover:border-primary/20 hover:shadow-md">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={`https://mc-heads.net/avatar/${player.username}/64`}
                            alt={player.username}
                            className="size-16 rounded-lg object-cover ring-1 ring-black/5 transition-transform group-hover:scale-105 dark:ring-white/10"
                        />
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-lg font-semibold transition-colors group-hover:text-primary">
                                {player.username}
                            </h3>
                            <p className="mb-2 truncate font-mono text-xs text-muted-foreground">
                                {player.uuid}
                            </p>
                            <TrustBadge level={player.trust_level} size="sm" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
