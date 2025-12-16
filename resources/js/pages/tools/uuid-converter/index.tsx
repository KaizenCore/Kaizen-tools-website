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
import { OutputPanel, ToolLayout } from '@/components/tool-layout';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { ConversionHistory, UuidConversion } from '@/types/tools';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertCircle,
    Check,
    Clock,
    Copy,
    Hash,
    Search,
    User,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '/tools/uuid-converter',
    },
    {
        title: 'UUID Converter',
        href: '/tools/uuid-converter',
    },
];

const CONVERSION_HISTORY_KEY = 'minecraft_uuid_conversions';
const MAX_HISTORY_ITEMS = 8;

export default function UuidConverterIndex() {
    const [input, setInput] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const [result, setResult] = useState<UuidConversion | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<ConversionHistory[]>([]);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(CONVERSION_HISTORY_KEY);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch {
                localStorage.removeItem(CONVERSION_HISTORY_KEY);
            }
        }

        const params = new URLSearchParams(window.location.search);
        const uuidParam = params.get('uuid');
        if (uuidParam) {
            setInput(uuidParam);
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

    const saveToHistory = (
        searchInput: string,
        conversionResult: UuidConversion,
    ) => {
        const newEntry: ConversionHistory = {
            input: searchInput,
            result: conversionResult,
            timestamp: Date.now(),
        };

        const updated = [
            newEntry,
            ...history.filter(
                (h) =>
                    h.result.uuid !== conversionResult.uuid ||
                    h.input !== searchInput,
            ),
        ].slice(0, MAX_HISTORY_ITEMS);

        setHistory(updated);
        localStorage.setItem(CONVERSION_HISTORY_KEY, JSON.stringify(updated));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) {
            return;
        }

        setIsConverting(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post<{
                success: boolean;
                data: UuidConversion;
            }>('/api/tools/uuid-converter', { input: input.trim() });

            setResult(response.data.data);
            saveToHistory(input.trim(), response.data.data);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(
                    err.response.data.message ||
                        'Player not found. Please check the username or UUID.',
                );
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsConverting(false);
        }
    };

    const loadFromHistory = (entry: ConversionHistory) => {
        setInput(entry.input);
        setResult(entry.result);
        setError(null);
    };

    const copyToClipboard = async (text: string, fieldName: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        } catch {
            // Silently fail if clipboard API is not available
        }
    };

    const getAvatarUrl = (username: string) => {
        return `https://mc-heads.net/avatar/${username}/128`;
    };

    const sidebar = (
        <>
            {!isConverting && result && (
                <OutputPanel
                    title="Player Information"
                    actions={
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.uuid, 'uuid')}
                        >
                            <Copy className="mr-1 size-3" />
                            Copy
                        </Button>
                    }
                >
                    {/* Player Avatar and Name */}
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
                        <img
                            src={getAvatarUrl(result.username)}
                            alt={result.username}
                            className="size-16 rounded-lg border bg-muted"
                        />
                        <div className="flex-1 space-y-1">
                            <h3 className="text-lg font-bold">
                                {result.username}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Minecraft Player
                            </p>
                        </div>
                    </div>

                    {/* UUID Information */}
                    <div className="space-y-3">
                        {/* UUID with dashes */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                UUID (with dashes)
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    value={result.uuid_formatted}
                                    readOnly
                                    className="h-9 font-mono text-xs"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        copyToClipboard(
                                            result.uuid_formatted,
                                            'uuid_formatted',
                                        )
                                    }
                                    className="size-9 shrink-0"
                                >
                                    {copiedField === 'uuid_formatted' ? (
                                        <Check className="size-3 text-green-600" />
                                    ) : (
                                        <Copy className="size-3" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* UUID without dashes */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                UUID (without dashes)
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    value={result.uuid}
                                    readOnly
                                    className="h-9 font-mono text-xs"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        copyToClipboard(result.uuid, 'uuid')
                                    }
                                    className="size-9 shrink-0"
                                >
                                    {copiedField === 'uuid' ? (
                                        <Check className="size-3 text-green-600" />
                                    ) : (
                                        <Copy className="size-3" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                Username
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    value={result.username}
                                    readOnly
                                    className="h-9 font-mono text-xs"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        copyToClipboard(
                                            result.username,
                                            'username',
                                        )
                                    }
                                    className="size-9 shrink-0"
                                >
                                    {copiedField === 'username' ? (
                                        <Check className="size-3 text-green-600" />
                                    ) : (
                                        <Copy className="size-3" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </OutputPanel>
            )}

            {/* Info Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">About UUIDs</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                    <div className="flex gap-2">
                        <AlertCircle className="size-4 shrink-0 text-primary" />
                        <p className="text-muted-foreground">
                            <strong className="text-foreground">Unique:</strong> Each player has a permanent UUID
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <AlertCircle className="size-4 shrink-0 text-primary" />
                        <p className="text-muted-foreground">
                            <strong className="text-foreground">Unchanging:</strong> UUIDs persist through name changes
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <AlertCircle className="size-4 shrink-0 text-primary" />
                        <p className="text-muted-foreground">
                            <strong className="text-foreground">Format:</strong> 32 hex characters with optional dashes
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="UUID Converter" />
            <ToolLayout
                title="Minecraft UUID Converter"
                description="Convert Minecraft usernames to UUIDs and vice versa"
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
                                placeholder="Enter username or UUID..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="h-12 pr-4 pl-10 text-base"
                                disabled={isConverting}
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            disabled={!input.trim() || isConverting}
                            className="h-12 px-8"
                        >
                            {isConverting ? (
                                <>
                                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Converting...
                                </>
                            ) : (
                                <>
                                    <Hash className="size-5" />
                                    Convert
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Loading State */}
                {isConverting && (
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                )}

                {/* Recent Conversions */}
                {history.length > 0 && (
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Clock className="size-5" />
                            <h2 className="text-xl font-semibold">
                                Recent Conversions
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
                                        src={getAvatarUrl(
                                            entry.result.username,
                                        )}
                                        alt={entry.result.username}
                                        className="size-10 shrink-0 rounded-lg border bg-muted"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium group-hover:text-accent-foreground">
                                            {entry.result.username}
                                        </p>
                                        <p className="truncate text-xs font-mono text-muted-foreground">
                                            {entry.result.uuid.substring(0, 8)}
                                            ...
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isConverting &&
                    !result &&
                    !error &&
                    history.length === 0 && (
                        <div className="mt-8 flex flex-col items-center justify-center space-y-4 py-12">
                            <div className="flex size-20 items-center justify-center rounded-full bg-muted/50">
                                <Hash className="size-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-2 text-center">
                                <h3 className="text-xl font-semibold">
                                    No conversions yet
                                </h3>
                                <p className="max-w-md text-sm text-muted-foreground">
                                    Enter a Minecraft username or UUID above to
                                    get started.
                                </p>
                            </div>
                        </div>
                    )}
            </ToolLayout>
        </AppLayout>
    );
}
