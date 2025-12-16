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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { OutputPanel, ToolLayout } from '@/components/tool-layout';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Clock,
    Download,
    Image as ImageIcon,
    Search,
    User,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '/tools/skin-viewer',
    },
    {
        title: 'Skin Viewer',
        href: '/tools/skin-viewer',
    },
];

const SEARCH_HISTORY_KEY = 'minecraft_skin_searches';
const MAX_HISTORY_ITEMS = 8;

type ViewMode = 'head-2d' | 'head-3d' | 'body' | 'combo';
type SkinSize = 64 | 128 | 256 | 512;

interface SearchHistory {
    username: string;
    timestamp: number;
}

const VIEW_MODES: { value: ViewMode; label: string; description: string }[] = [
    { value: 'head-2d', label: 'Head (2D)', description: 'Flat avatar view' },
    {
        value: 'head-3d',
        label: 'Head (3D)',
        description: '3D isometric head',
    },
    { value: 'body', label: 'Full Body', description: 'Full player body' },
    { value: 'combo', label: 'Bust', description: 'Head and body combo' },
];

const SIZES: SkinSize[] = [64, 128, 256, 512];

export default function SkinViewerIndex() {
    const [username, setUsername] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [currentUsername, setCurrentUsername] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('head-3d');
    const [size, setSize] = useState<SkinSize>(256);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<SearchHistory[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch {
                localStorage.removeItem(SEARCH_HISTORY_KEY);
            }
        }

        const params = new URLSearchParams(window.location.search);
        const usernameParam = params.get('username');
        if (usernameParam) {
            setUsername(usernameParam);
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

    const saveToHistory = (searchUsername: string) => {
        const newEntry: SearchHistory = {
            username: searchUsername,
            timestamp: Date.now(),
        };

        const updated = [
            newEntry,
            ...history.filter(
                (h) =>
                    h.username.toLowerCase() !==
                    searchUsername.toLowerCase(),
            ),
        ].slice(0, MAX_HISTORY_ITEMS);

        setHistory(updated);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username.trim()) {
            return;
        }

        setIsSearching(true);
        setError(null);

        // Simulate a brief loading state to check if the player exists
        // In a real scenario, you might verify the player via API first
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
            // For this client-side only tool, we'll just assume the username is valid
            // The mc-heads.net API will handle invalid usernames by showing a default skin
            setCurrentUsername(username.trim());
            saveToHistory(username.trim());
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsSearching(false);
        }
    };

    const loadFromHistory = (entry: SearchHistory) => {
        setUsername(entry.username);
        setCurrentUsername(entry.username);
        setError(null);
    };

    const getRenderUrl = (
        mode: ViewMode,
        user: string,
        renderSize: SkinSize,
    ) => {
        const endpoint =
            mode === 'head-2d'
                ? 'avatar'
                : mode === 'head-3d'
                  ? 'head'
                  : mode === 'body'
                    ? 'body'
                    : 'combo';
        return `https://mc-heads.net/${endpoint}/${user}/${renderSize}`;
    };

    const getSkinUrl = (user: string) => {
        return `https://mc-heads.net/skin/${user}`;
    };

    const getAvatarUrl = (user: string) => {
        return `https://mc-heads.net/avatar/${user}/64`;
    };

    const handleDownloadSkin = () => {
        if (!currentUsername) {
            return;
        }
        const url = getSkinUrl(currentUsername);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentUsername}-skin.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const sidebar = (
        <>
            {!isSearching && currentUsername && (
                <OutputPanel
                    title="Rendered Skin"
                    actions={
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownloadSkin}
                        >
                            <Download className="mr-1 size-3" />
                            Download
                        </Button>
                    }
                >
                    <div className="flex flex-col items-center gap-3">
                        <div className="rounded-lg border bg-[oklch(0.87_0.04_85)] p-6 dark:bg-[oklch(0.23_0.02_85)]">
                            <img
                                src={getRenderUrl(viewMode, currentUsername, size)}
                                alt={`${currentUsername}'s skin`}
                                className="block"
                                style={{ imageRendering: 'pixelated' }}
                            />
                        </div>
                        <div className="w-full space-y-1 text-center">
                            <p className="font-semibold">{currentUsername}</p>
                            <p className="text-xs text-muted-foreground">
                                {VIEW_MODES.find((m) => m.value === viewMode)?.label} -{' '}
                                {size}x{size}px
                            </p>
                        </div>
                    </div>
                </OutputPanel>
            )}

            {/* Display Options */}
            {!isSearching && currentUsername && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <ImageIcon className="size-4" />
                            Display Options
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium">View Mode</label>
                            <Select
                                value={viewMode}
                                onValueChange={(value: ViewMode) => setViewMode(value)}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {VIEW_MODES.map((mode) => (
                                        <SelectItem key={mode.value} value={mode.value}>
                                            {mode.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium">Size</label>
                            <Select
                                value={size.toString()}
                                onValueChange={(value) =>
                                    setSize(parseInt(value) as SkinSize)
                                }
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SIZES.map((s) => (
                                        <SelectItem key={s} value={s.toString()}>
                                            {s}x{s}px
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Info Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">About Skins</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                    <div className="flex gap-2">
                        <AlertCircle className="size-4 shrink-0 text-primary" />
                        <p className="text-muted-foreground">
                            <strong className="text-foreground">64x64:</strong> Standard Minecraft skin texture size
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <AlertCircle className="size-4 shrink-0 text-primary" />
                        <p className="text-muted-foreground">
                            <strong className="text-foreground">Layers:</strong> Skins support outer layers for accessories
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <AlertCircle className="size-4 shrink-0 text-primary" />
                        <p className="text-muted-foreground">
                            <strong className="text-foreground">Format:</strong> PNG format with transparency support
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Skin Viewer" />
            <ToolLayout
                title="Minecraft Skin Viewer"
                description="View Minecraft player skins with different render modes"
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
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <User className="size-5" />
                                    View Skin
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Loading State */}
                {isSearching && (
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-96 w-full" />
                        </CardContent>
                    </Card>
                )}

                {/* Raw Skin Texture */}
                {!isSearching && currentUsername && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Raw Skin Texture</CardTitle>
                            <CardDescription>
                                The original skin texture file for {currentUsername}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center">
                                <div className="rounded-lg border bg-[oklch(0.87_0.04_85)] p-4 dark:bg-[oklch(0.23_0.02_85)]">
                                    <img
                                        src={getSkinUrl(currentUsername)}
                                        alt={`${currentUsername}'s raw skin texture`}
                                        className="block size-64"
                                        style={{ imageRendering: 'pixelated' }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Searches */}
                {history.length > 0 && (
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Clock className="size-5" />
                            <h2 className="text-xl font-semibold">
                                Recent Searches
                            </h2>
                            <Badge variant="secondary" className="ml-2">
                                {history.length}
                            </Badge>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {history.map((entry, index) => (
                                <button
                                    key={index}
                                    onClick={() => loadFromHistory(entry)}
                                    className="group flex items-center gap-3 rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent"
                                >
                                    <img
                                        src={getAvatarUrl(entry.username)}
                                        alt={entry.username}
                                        className="size-10 shrink-0 rounded-lg border bg-muted"
                                        style={{
                                            imageRendering: 'pixelated',
                                        }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium group-hover:text-accent-foreground">
                                            {entry.username}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {new Date(
                                                entry.timestamp,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isSearching &&
                    !currentUsername &&
                    !error &&
                    history.length === 0 && (
                        <div className="mt-8 flex flex-col items-center justify-center space-y-4 py-12">
                            <div className="flex size-20 items-center justify-center rounded-full bg-muted/50">
                                <User className="size-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-2 text-center">
                                <h3 className="text-xl font-semibold">
                                    No skins viewed yet
                                </h3>
                                <p className="max-w-md text-sm text-muted-foreground">
                                    Enter a Minecraft username above to view
                                    their skin with different render modes.
                                </p>
                            </div>
                        </div>
                    )}
            </ToolLayout>
        </AppLayout>
    );
}
