import { SkinCard } from '@/components/skins/skin-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { RecentSearches } from '@/types/skins';
import { Head, router } from '@inertiajs/react';
import { Clock, Search, TrendingUp, User } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface Props {
    recentSearches: RecentSearches;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Skin Explorer',
        href: '/skins',
    },
];

export default function SkinsIndex({ recentSearches }: Props) {
    const [username, setUsername] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username.trim()) {
            return;
        }

        setIsSearching(true);
        router.visit(`/skins/${username.trim()}`, {
            onFinish: () => setIsSearching(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Skin Explorer" />

            <div className="mx-auto max-w-screen-2xl p-4 sm:p-6">
                <div className="mb-6 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Minecraft Skin Explorer
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Search for any Minecraft player's skin and download it
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Enter Minecraft username..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="h-12 pr-4 pl-10 text-base"
                                disabled={isSearching}
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            disabled={!username.trim() || isSearching}
                            className="h-12 px-8"
                        >
                            {isSearching ? (
                                <>
                                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="size-5" />
                                    Search Skin
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Recent Searches Section */}
                {recentSearches.recent.length > 0 && (
                    <div className="mb-8">
                        <div className="mb-4 flex items-center gap-2">
                            <Clock className="size-5" />
                            <h2 className="text-xl font-semibold">
                                Recent Searches
                            </h2>
                            <Badge variant="secondary" className="ml-2">
                                {recentSearches.recent.length}
                            </Badge>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {recentSearches.recent.map((search) => (
                                <SkinCard key={search.id} search={search} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Popular Searches Section */}
                {recentSearches.popular.length > 0 && (
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <TrendingUp className="size-5" />
                            <h2 className="text-xl font-semibold">
                                Popular Searches
                            </h2>
                            <Badge variant="secondary" className="ml-2">
                                {recentSearches.popular.length}
                            </Badge>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {recentSearches.popular.map((search) => (
                                <SkinCard key={search.id} search={search} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {recentSearches.recent.length === 0 &&
                    recentSearches.popular.length === 0 && (
                        <div className="mt-16 flex flex-col items-center justify-center space-y-4 py-12">
                            <div className="flex size-20 items-center justify-center rounded-full bg-muted/50">
                                <User className="size-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-2 text-center">
                                <h3 className="text-xl font-semibold">
                                    No searches yet
                                </h3>
                                <p className="max-w-md text-sm text-muted-foreground">
                                    Start by searching for a Minecraft username
                                    above to view their skin.
                                </p>
                            </div>
                        </div>
                    )}
            </div>
        </AppLayout>
    );
}
