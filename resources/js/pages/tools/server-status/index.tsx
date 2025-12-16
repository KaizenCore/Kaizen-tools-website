import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type {
    RecentServerSearch,
    ServerStatusResponse,
} from '@/types/tools';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import {
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    Globe,
    Server,
    Users,
    XCircle,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '/tools/server-status',
    },
    {
        title: 'Server Status',
        href: '/tools/server-status',
    },
];

const RECENT_SEARCHES_KEY = 'minecraft_recent_server_searches';
const MAX_RECENT_SEARCHES = 5;

export default function ServerStatusIndex() {
    const [address, setAddress] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [status, setStatus] = useState<ServerStatusResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [recentSearches, setRecentSearches] = useState<RecentServerSearch[]>(
        [],
    );

    useEffect(() => {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch {
                localStorage.removeItem(RECENT_SEARCHES_KEY);
            }
        }

        const params = new URLSearchParams(window.location.search);
        const addressParam = params.get('address');
        if (addressParam) {
            setAddress(addressParam);
            const form = document.querySelector('form');
            if (form) {
                setTimeout(() => {
                    form.dispatchEvent(
                        new Event('submit', { bubbles: true, cancelable: true }),
                    );
                }, 100);
            }
        }
    }, []);

    const saveToRecentSearches = (
        serverAddress: string,
        online: boolean,
    ) => {
        const newSearch: RecentServerSearch = {
            address: serverAddress,
            timestamp: Date.now(),
            online,
        };

        const updated = [
            newSearch,
            ...recentSearches.filter((s) => s.address !== serverAddress),
        ].slice(0, MAX_RECENT_SEARCHES);

        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!address.trim()) {
            return;
        }

        setIsChecking(true);
        setError(null);
        setStatus(null);

        try {
            const response = await axios.post<ServerStatusResponse>(
                '/api/tools/server-status/check',
                { address: address.trim() },
            );

            setStatus(response.data);
            saveToRecentSearches(address.trim(), response.data.online);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(
                    err.response.data.error ||
                        'Failed to check server status.',
                );
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsChecking(false);
        }
    };

    const loadRecentSearch = (serverAddress: string) => {
        setAddress(serverAddress);
        setStatus(null);
        setError(null);
    };

    const parseMotdColors = (html: string[]): string => {
        return html.join('<br>');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Server Status Checker" />

            <div className="mx-auto max-w-screen-2xl p-4 sm:p-6">
                <div className="mb-6 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Minecraft Server Status Checker
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Check the status of any Minecraft server
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Globe className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Enter server address (e.g., hypixel.net or play.example.com:25566)"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="h-12 pr-4 pl-10 text-base"
                                disabled={isChecking}
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            disabled={!address.trim() || isChecking}
                            className="h-12 px-8"
                        >
                            {isChecking ? (
                                <>
                                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Checking...
                                </>
                            ) : (
                                <>
                                    <Activity className="size-5" />
                                    Check Status
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Error Message */}
                {error && (
                    <Card className="mb-8 border-destructive">
                        <CardContent className="flex items-center gap-3 pt-6">
                            <AlertCircle className="size-5 text-destructive" />
                            <p className="text-sm text-destructive">{error}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Loading State */}
                {isChecking && (
                    <Card className="mb-8">
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </CardContent>
                    </Card>
                )}

                {/* Server Status Result */}
                {!isChecking && status && (
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="space-y-1.5">
                                    <CardTitle className="flex items-center gap-2">
                                        <Server className="size-5" />
                                        {status.hostname || status.address}
                                    </CardTitle>
                                    <CardDescription>
                                        {status.address}
                                        {status.port && status.port !== 25565
                                            ? `:${status.port}`
                                            : ''}
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant={
                                        status.online
                                            ? 'default'
                                            : 'destructive'
                                    }
                                    className="gap-1.5 px-3 py-1.5 text-sm"
                                >
                                    {status.online ? (
                                        <>
                                            <CheckCircle className="size-4" />
                                            Online
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="size-4" />
                                            Offline
                                        </>
                                    )}
                                </Badge>
                            </div>
                        </CardHeader>

                        {status.online && (
                            <CardContent className="space-y-6">
                                {/* Server Icon and MOTD */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                    {status.icon && (
                                        <div className="shrink-0">
                                            <img
                                                src={status.icon}
                                                alt="Server icon"
                                                className="size-16 rounded-lg border bg-muted"
                                            />
                                        </div>
                                    )}
                                    {status.motd && status.motd.html && (
                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Message of the Day
                                            </h3>
                                            <div
                                                className="font-mono text-sm leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: parseMotdColors(
                                                        status.motd.html,
                                                    ),
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Server Info Grid */}
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {/* Players */}
                                    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                            <Users className="size-5 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Players
                                            </p>
                                            <p className="truncate text-lg font-semibold">
                                                {status.players?.online ?? 0} /{' '}
                                                {status.players?.max ?? 0}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Version */}
                                    {status.version && (
                                        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                <Server className="size-5 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Version
                                                </p>
                                                <p className="truncate text-lg font-semibold">
                                                    {status.version}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Software */}
                                    {status.software && (
                                        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                <Activity className="size-5 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Software
                                                </p>
                                                <p className="truncate text-lg font-semibold">
                                                    {status.software}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        )}

                        {!status.online && status.error && (
                            <CardContent>
                                <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 dark:bg-destructive/10">
                                    <AlertCircle className="size-5 text-destructive" />
                                    <p className="text-sm text-muted-foreground">
                                        {status.error}
                                    </p>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Clock className="size-5" />
                            <h2 className="text-xl font-semibold">
                                Recent Searches
                            </h2>
                            <Badge variant="secondary" className="ml-2">
                                {recentSearches.length}
                            </Badge>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {recentSearches.map((search) => (
                                <button
                                    key={search.address}
                                    onClick={() =>
                                        loadRecentSearch(search.address)
                                    }
                                    className="group flex items-center gap-3 rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent"
                                >
                                    <div
                                        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                                            search.online
                                                ? 'bg-primary/10'
                                                : 'bg-destructive/10'
                                        }`}
                                    >
                                        {search.online ? (
                                            <CheckCircle className="size-5 text-primary" />
                                        ) : (
                                            <XCircle className="size-5 text-destructive" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium group-hover:text-accent-foreground">
                                            {search.address}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(
                                                search.timestamp,
                                            ).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isChecking &&
                    !status &&
                    !error &&
                    recentSearches.length === 0 && (
                        <div className="mt-16 flex flex-col items-center justify-center space-y-4 py-12">
                            <div className="flex size-20 items-center justify-center rounded-full bg-muted/50">
                                <Server className="size-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-2 text-center">
                                <h3 className="text-xl font-semibold">
                                    No servers checked yet
                                </h3>
                                <p className="max-w-md text-sm text-muted-foreground">
                                    Enter a Minecraft server address above to
                                    check its status and view player
                                    information.
                                </p>
                            </div>
                        </div>
                    )}
            </div>
        </AppLayout>
    );
}
