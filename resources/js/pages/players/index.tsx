import { PlayerCard } from '@/components/players/player-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Player } from '@/types/players';
import { Head, router } from '@inertiajs/react';
import { Loader2, Search, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
    recentPlayers: Player[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Player Lookup', href: '/players' },
];

export default function PlayersIndex({ recentPlayers }: Props) {
    const [searchQuery, setSearchQuery] = useState(() => {
        // Initialize from URL params
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('search') || '';
        }
        return '';
    });
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasAutoSearched = useRef(false);

    const performSearch = async (username: string) => {
        if (!username.trim() || username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        setIsSearching(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/players/search?username=${encodeURIComponent(username)}`,
            );
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Player not found');
                return;
            }

            router.visit(`/players/${data.data.username}`);
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    // Auto-search if URL has search param
    useEffect(() => {
        if (hasAutoSearched.current) return;

        const params = new URLSearchParams(window.location.search);
        const searchParam = params.get('search');

        if (searchParam && searchParam.length >= 3) {
            hasAutoSearched.current = true;
            performSearch(searchParam);
        }
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(searchQuery);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Player Lookup" />

            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                        <Users className="size-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Player Lookup
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Search for Minecraft players and check their community
                        trust level
                    </p>
                </div>

                {/* Search Section */}
                <Card className="mx-auto mb-8 max-w-xl">
                    <CardContent className="p-6">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Enter Minecraft username..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setError(null);
                                    }}
                                    className="pl-10"
                                    disabled={isSearching}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSearching || !searchQuery.trim()}
                            >
                                {isSearching ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    'Search'
                                )}
                            </Button>
                        </form>
                        {error && (
                            <p className="mt-2 text-sm text-destructive">
                                {error}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Players */}
                {recentPlayers.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Recently Searched
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {recentPlayers.map((player) => (
                                    <PlayerCard
                                        key={player.id}
                                        player={player}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {recentPlayers.length === 0 && (
                    <div className="py-12 text-center">
                        <Users className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                        <p className="text-muted-foreground">
                            No recent searches. Try searching for a player
                            above!
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
