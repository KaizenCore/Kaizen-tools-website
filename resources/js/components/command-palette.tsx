import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { type Command, type CommandGroup, type ParsedCommand } from '@/types/commands';
import { router } from '@inertiajs/react';
import {
    ArrowRight,
    Calculator,
    Clock,
    Compass,
    Hash,
    LayoutGrid,
    Package,
    Palette,
    Search,
    Server,
    Shield,
    Sparkles,
    User,
    Wand2,
    X,
    Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Parse command from input
function parseCommand(input: string): ParsedCommand {
    const trimmed = input.trim();
    if (!trimmed.startsWith('/')) {
        return { command: null, args: trimmed, isCommand: false };
    }

    const parts = trimmed.slice(1).split(/\s+/);
    const command = parts[0]?.toLowerCase() || '';
    const args = parts.slice(1).join(' ');

    return { command, args, isCommand: true };
}

// Storage key for recent commands
const RECENT_COMMANDS_KEY = 'kaizen-recent-commands';
const MAX_RECENT = 5;

function getRecentCommands(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(RECENT_COMMANDS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveRecentCommand(query: string): void {
    if (typeof window === 'undefined' || !query.trim()) return;
    try {
        const recent = getRecentCommands().filter((q) => q !== query);
        recent.unshift(query);
        localStorage.setItem(
            RECENT_COMMANDS_KEY,
            JSON.stringify(recent.slice(0, MAX_RECENT)),
        );
    } catch {
        // Ignore storage errors
    }
}

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentCommands, setRecentCommands] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Load recent commands on mount
    useEffect(() => {
        if (open) {
            setRecentCommands(getRecentCommands());
            setQuery('');
            setSelectedIndex(0);
        }
    }, [open]);

    // Define all available commands
    const commands: Command[] = useMemo(
        () => [
            // Navigation
            {
                id: 'dashboard',
                name: 'Dashboard',
                description: 'Go to the dashboard',
                icon: LayoutGrid,
                keywords: ['home', 'main', 'start'],
                category: 'navigation',
                action: () => router.visit('/'),
            },
            {
                id: 'mods',
                name: 'Browse Mods',
                description: 'Browse all Minecraft mods',
                icon: Package,
                keywords: ['mods', 'browse', 'list'],
                category: 'navigation',
                action: () => router.visit('/mods'),
            },
            {
                id: 'resource-packs',
                name: 'Resource Packs',
                description: 'Browse resource packs',
                icon: Compass,
                keywords: ['packs', 'textures', 'resources'],
                category: 'navigation',
                action: () => router.visit('/resource-packs'),
            },
            // Player tools
            {
                id: 'server',
                name: '/server <address>',
                description: 'Check server status',
                icon: Server,
                shortcut: '/server',
                keywords: ['ping', 'status', 'online', 'ip'],
                category: 'tools',
                example: '/server mc.hypixel.net',
                action: (args) => {
                    const address = args.trim() || '';
                    router.visit(
                        `/tools/server-status${address ? `?address=${encodeURIComponent(address)}` : ''}`,
                    );
                },
            },
            {
                id: 'skin',
                name: '/skin <username>',
                description: 'View player skin in 3D',
                icon: User,
                shortcut: '/skin',
                keywords: ['skin', 'player', 'view', '3d'],
                category: 'players',
                example: '/skin Notch',
                action: (args) => {
                    const username = args.trim() || '';
                    router.visit(
                        `/tools/skin-viewer${username ? `?username=${encodeURIComponent(username)}` : ''}`,
                    );
                },
            },
            {
                id: 'player',
                name: '/player <username>',
                description: 'Lookup player trust score',
                icon: Shield,
                shortcut: '/player',
                keywords: ['player', 'trust', 'lookup', 'check'],
                category: 'players',
                example: '/player Dream',
                action: (args) => {
                    const username = args.trim() || '';
                    router.visit(
                        `/players${username ? `?search=${encodeURIComponent(username)}` : ''}`,
                    );
                },
            },
            {
                id: 'uuid',
                name: '/uuid <value>',
                description: 'Convert UUID formats',
                icon: Hash,
                shortcut: '/uuid',
                keywords: ['uuid', 'convert', 'format'],
                category: 'tools',
                example: '/uuid 069a79f4-44e9-4726-a5be-fca90e38aaf5',
                action: (args) => {
                    const uuid = args.trim() || '';
                    router.visit(
                        `/tools/uuid-converter${uuid ? `?uuid=${encodeURIComponent(uuid)}` : ''}`,
                    );
                },
            },
            // Calculators
            {
                id: 'nether',
                name: '/nether <x> <z>',
                description: 'Calculate Nether coordinates',
                icon: Calculator,
                shortcut: '/nether',
                keywords: ['nether', 'portal', 'coords', 'calculate'],
                category: 'tools',
                example: '/nether 1000 -500',
                action: (args) => {
                    const parts = args.trim().split(/\s+/);
                    const x = parts[0] || '';
                    const z = parts[1] || '';
                    const params = new URLSearchParams();
                    if (x) params.set('x', x);
                    if (z) params.set('z', z);
                    router.visit(
                        `/tools/nether-calculator${params.toString() ? `?${params.toString()}` : ''}`,
                    );
                },
            },
            {
                id: 'xp',
                name: '/xp <level>',
                description: 'Calculate XP needed',
                icon: Sparkles,
                shortcut: '/xp',
                keywords: ['xp', 'experience', 'level', 'calculate'],
                category: 'tools',
                example: '/xp 30',
                action: (args) => {
                    const level = args.trim() || '';
                    router.visit(
                        `/tools/xp-calculator${level ? `?level=${encodeURIComponent(level)}` : ''}`,
                    );
                },
            },
            {
                id: 'enchant',
                name: '/enchant',
                description: 'Enchantment calculator',
                icon: Wand2,
                shortcut: '/enchant',
                keywords: ['enchant', 'enchantment', 'anvil'],
                category: 'tools',
                action: () => router.visit('/tools/enchantment-calculator'),
            },
            {
                id: 'redstone',
                name: '/redstone',
                description: 'Redstone calculator',
                icon: Zap,
                shortcut: '/redstone',
                keywords: ['redstone', 'signal', 'timing'],
                category: 'tools',
                action: () => router.visit('/tools/redstone-calculator'),
            },
            {
                id: 'banner',
                name: '/banner',
                description: 'Banner creator',
                icon: Palette,
                shortcut: '/banner',
                keywords: ['banner', 'pattern', 'design'],
                category: 'tools',
                action: () => router.visit('/tools/banner-creator'),
            },
            // Search
            {
                id: 'mod-search',
                name: '/mod <name>',
                description: 'Search for mods',
                icon: Package,
                shortcut: '/mod',
                keywords: ['search', 'find', 'mod'],
                category: 'search',
                example: '/mod optifine',
                action: (args) => {
                    const search = args.trim() || '';
                    router.visit(
                        `/mods${search ? `?search=${encodeURIComponent(search)}` : ''}`,
                    );
                },
            },
            {
                id: 'pack-search',
                name: '/pack <name>',
                description: 'Search resource packs',
                icon: Compass,
                shortcut: '/pack',
                keywords: ['search', 'find', 'pack', 'texture'],
                category: 'search',
                example: '/pack faithful',
                action: (args) => {
                    const search = args.trim() || '';
                    router.visit(
                        `/resource-packs${search ? `?search=${encodeURIComponent(search)}` : ''}`,
                    );
                },
            },
        ],
        [],
    );

    // Group commands by category
    const commandGroups: CommandGroup[] = useMemo(() => {
        const groups: CommandGroup[] = [
            { category: 'search', label: 'Search', commands: [] },
            { category: 'players', label: 'Players', commands: [] },
            { category: 'tools', label: 'Tools', commands: [] },
            { category: 'navigation', label: 'Navigation', commands: [] },
        ];

        commands.forEach((cmd) => {
            const group = groups.find((g) => g.category === cmd.category);
            if (group) {
                group.commands.push(cmd);
            }
        });

        return groups.filter((g) => g.commands.length > 0);
    }, [commands]);

    // Filter commands based on query
    const filteredCommands = useMemo(() => {
        if (!query.trim()) {
            return commands;
        }

        const parsed = parseCommand(query);
        const searchTerm = parsed.isCommand
            ? parsed.command?.toLowerCase() || ''
            : query.toLowerCase();

        return commands.filter((cmd) => {
            const matchesName = cmd.name.toLowerCase().includes(searchTerm);
            const matchesShortcut = cmd.shortcut
                ?.toLowerCase()
                .includes(`/${searchTerm}`);
            const matchesKeywords = cmd.keywords.some((k) =>
                k.toLowerCase().includes(searchTerm),
            );
            const matchesDescription = cmd.description
                .toLowerCase()
                .includes(searchTerm);

            return (
                matchesName ||
                matchesShortcut ||
                matchesKeywords ||
                matchesDescription
            );
        });
    }, [query, commands]);

    // Get filtered groups for display
    const filteredGroups = useMemo(() => {
        if (!query.trim()) {
            return commandGroups;
        }

        return commandGroups
            .map((group) => ({
                ...group,
                commands: group.commands.filter((cmd) =>
                    filteredCommands.includes(cmd),
                ),
            }))
            .filter((g) => g.commands.length > 0);
    }, [query, commandGroups, filteredCommands]);

    // Flatten for keyboard navigation
    const flatCommands = useMemo(() => {
        return filteredGroups.flatMap((g) => g.commands);
    }, [filteredGroups]);

    // Handle command execution
    const executeCommand = useCallback(
        (cmd: Command | null, customArgs?: string) => {
            if (!cmd) {
                // If no command matched, do a default mod search
                if (query.trim()) {
                    saveRecentCommand(query);
                    router.visit(
                        `/mods?search=${encodeURIComponent(query.trim())}`,
                    );
                    onOpenChange(false);
                    setQuery('');
                }
                return;
            }

            const parsed = parseCommand(query);
            const args = customArgs ?? (parsed.isCommand ? parsed.args : '');

            saveRecentCommand(query);
            cmd.action(args);
            onOpenChange(false);
            setQuery('');
        },
        [query, onOpenChange],
    );

    // Handle form submission
    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            const parsed = parseCommand(query);

            if (parsed.isCommand && parsed.command) {
                // Find matching command
                const cmd = commands.find(
                    (c) =>
                        c.shortcut?.toLowerCase() === `/${parsed.command}` ||
                        c.id === parsed.command,
                );
                executeCommand(cmd, parsed.args);
            } else if (flatCommands.length > 0 && selectedIndex >= 0) {
                // Execute selected command
                executeCommand(flatCommands[selectedIndex]);
            } else {
                // Default to mod search
                executeCommand(null);
            }
        },
        [query, commands, flatCommands, selectedIndex, executeCommand],
    );

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        Math.min(prev + 1, flatCommands.length - 1),
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.max(prev - 1, 0));
                    break;
                case 'Tab':
                    e.preventDefault();
                    if (flatCommands[selectedIndex]?.shortcut) {
                        setQuery(flatCommands[selectedIndex].shortcut + ' ');
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onOpenChange(false);
                    break;
            }
        },
        [flatCommands, selectedIndex, onOpenChange],
    );

    // Scroll selected item into view
    useEffect(() => {
        if (listRef.current) {
            const selectedEl = listRef.current.querySelector(
                `[data-index="${selectedIndex}"]`,
            );
            selectedEl?.scrollIntoView({ block: 'nearest' });
        }
    }, [selectedIndex]);

    // Reset selected index when filtered commands change
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Use recent command
    const useRecent = useCallback((recent: string) => {
        setQuery(recent);
        inputRef.current?.focus();
    }, []);

    // Clear recent commands
    const clearRecent = useCallback(() => {
        localStorage.removeItem(RECENT_COMMANDS_KEY);
        setRecentCommands([]);
    }, []);

    let currentIndex = -1;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>Command Palette</DialogTitle>
                </DialogHeader>

                {/* Search Input */}
                <form onSubmit={handleSubmit} className="border-b">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <Search className="size-5 shrink-0 text-muted-foreground" />
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Type a command or search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-auto border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0"
                            autoFocus
                        />
                        {query && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 shrink-0 p-0"
                                onClick={() => setQuery('')}
                            >
                                <X className="size-4" />
                            </Button>
                        )}
                        <kbd className="hidden shrink-0 rounded border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:inline">
                            ESC
                        </kbd>
                    </div>
                </form>

                {/* Command List */}
                <div
                    ref={listRef}
                    className="max-h-[60vh] overflow-y-auto overscroll-contain"
                >
                    {/* Recent Commands */}
                    {!query && recentCommands.length > 0 && (
                        <div className="border-b px-2 py-2">
                            <div className="flex items-center justify-between px-2 py-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Recent
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground"
                                    onClick={clearRecent}
                                >
                                    Clear
                                </Button>
                            </div>
                            <div className="space-y-0.5">
                                {recentCommands.map((recent, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => useRecent(recent)}
                                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                                    >
                                        <Clock className="size-4 text-muted-foreground" />
                                        <span className="truncate">
                                            {recent}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Command Groups */}
                    {filteredGroups.map((group) => (
                        <div key={group.category} className="px-2 py-2">
                            <div className="px-2 py-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                    {group.label}
                                </span>
                            </div>
                            <div className="space-y-0.5">
                                {group.commands.map((cmd) => {
                                    currentIndex++;
                                    const index = currentIndex;
                                    const isSelected = index === selectedIndex;
                                    const Icon = cmd.icon;

                                    return (
                                        <button
                                            key={cmd.id}
                                            type="button"
                                            data-index={index}
                                            onClick={() => executeCommand(cmd)}
                                            className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors ${
                                                isSelected
                                                    ? 'bg-accent text-accent-foreground'
                                                    : 'hover:bg-accent/50'
                                            }`}
                                        >
                                            <div
                                                className={`flex size-8 shrink-0 items-center justify-center rounded-md ${
                                                    isSelected
                                                        ? 'bg-primary/20 text-primary'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                <Icon className="size-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                        {cmd.name}
                                                    </span>
                                                    {cmd.shortcut && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="h-5 px-1.5 font-mono text-[10px]"
                                                        >
                                                            {cmd.shortcut}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {cmd.description}
                                                    {cmd.example && (
                                                        <span className="ml-1 text-muted-foreground/60">
                                                            e.g. {cmd.example}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* No results */}
                    {filteredGroups.length === 0 && query && (
                        <div className="px-4 py-8 text-center">
                            <Search className="mx-auto mb-2 size-8 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">
                                No commands found for "{query}"
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground/60">
                                Press Enter to search mods instead
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <kbd className="rounded border bg-background px-1 py-0.5 font-mono">
                                ↑↓
                            </kbd>
                            Navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="rounded border bg-background px-1 py-0.5 font-mono">
                                Tab
                            </kbd>
                            Autocomplete
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="rounded border bg-background px-1 py-0.5 font-mono">
                                ↵
                            </kbd>
                            Execute
                        </span>
                    </div>
                    <span className="hidden sm:inline">
                        Type <code className="font-mono">/</code> for commands
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
