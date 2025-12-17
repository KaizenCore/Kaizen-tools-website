import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ToolLayout } from '@/components/tool-layout';
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
import { toast } from 'sonner';

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

// Play notification sound
function playNotificationSound(isOnline: boolean) {
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (isOnline) {
        // Success sound: ascending two-tone
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else {
        // Error sound: descending tone
        oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime); // F4
        oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime + 0.15); // C4
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

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

            // Show toast and play sound
            if (response.data.online) {
                playNotificationSound(true);
                toast.success('Server Online', {
                    description: `${address.trim()} is online with ${response.data.players?.online ?? 0} players`,
                });
            } else {
                playNotificationSound(false);
                toast.error('Server Offline', {
                    description: response.data.error || `${address.trim()} is not responding`,
                });
            }
        } catch (err) {
            playNotificationSound(false);
            if (axios.isAxiosError(err) && err.response) {
                const errorMessage = err.response.data.error || 'Failed to check server status.';
                setError(errorMessage);
                toast.error('Check Failed', {
                    description: errorMessage,
                });
            } else {
                setError('An unexpected error occurred.');
                toast.error('Error', {
                    description: 'An unexpected error occurred.',
                });
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

    const sidebar = (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">About Server Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
                <div className="flex gap-2">
                    <AlertCircle className="size-4 shrink-0 text-primary" />
                    <p className="text-muted-foreground">
                        <strong className="text-foreground">Query port:</strong> Uses default port 25565 if not specified
                    </p>
                </div>
                <div className="flex gap-2">
                    <AlertCircle className="size-4 shrink-0 text-primary" />
                    <p className="text-muted-foreground">
                        <strong className="text-foreground">Real-time:</strong> Shows current server status and player count
                    </p>
                </div>
                <div className="flex gap-2">
                    <AlertCircle className="size-4 shrink-0 text-primary" />
                    <p className="text-muted-foreground">
                        <strong className="text-foreground">Format:</strong> Enter as domain.com or domain.com:port
                    </p>
                </div>
            </CardContent>
        </Card>
    );

    const serverResult = (
        <>
            {/* Online Server Result */}
            {!isChecking && status && status.online && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                            {/* Server Info */}
                            <div className="flex items-center gap-4">
                                {status.icon && (
                                    <img
                                        src={status.icon}
                                        alt="Server icon"
                                        className="size-16 rounded-lg border bg-muted"
                                    />
                                )}
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {status.hostname || status.address}
                                    </h3>
                                    <Badge variant="default" className="mt-1 gap-1">
                                        <CheckCircle className="size-3" />
                                        Online
                                    </Badge>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid flex-1 gap-3 sm:grid-cols-3">
                                <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <Users className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Players</p>
                                        <p className="text-lg font-bold">
                                            {status.players?.online ?? 0} / {status.players?.max ?? 0}
                                        </p>
                                    </div>
                                </div>

                                {status.version && (
                                    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                            <Server className="size-5 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground">Version</p>
                                            <p className="truncate font-semibold">{status.version}</p>
                                        </div>
                                    </div>
                                )}

                                {status.software && (
                                    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                            <Activity className="size-5 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground">Software</p>
                                            <p className="truncate font-semibold">{status.software}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* MOTD */}
                        {status.motd && status.motd.html && (
                            <div className="mt-4 space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">
                                    Message of the Day
                                </h4>
                                <div
                                    className="rounded-lg border bg-card p-4 font-mono text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: parseMotdColors(status.motd.html),
                                    }}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Offline Server Result */}
            {!isChecking && status && !status.online && (
                <Card className="border-destructive/20 bg-destructive/5">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                            <XCircle className="size-7 text-destructive" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-destructive">Server Offline</h3>
                            <p className="text-muted-foreground">
                                {status.error || 'The server is not responding'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Server Status Checker" />
            <ToolLayout
                title="Minecraft Server Status Checker"
                description="Check the status of any Minecraft server"
                sidebar={sidebar}
                alerts={
                    error && (
                        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                            <AlertCircle className="size-4" />
                            {error}
                        </div>
                    )
                }
            >
                {/* Search Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
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

                {/* Loading State */}
                {isChecking && (
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="size-16 rounded-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                </div>
                                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                                    <Skeleton className="h-20 rounded-lg" />
                                    <Skeleton className="h-20 rounded-lg" />
                                    <Skeleton className="h-20 rounded-lg" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Server Result */}
                {serverResult}

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
                        <div className="mt-8 flex flex-col items-center justify-center space-y-4 py-12">
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
            </ToolLayout>
        </AppLayout>
    );
}
