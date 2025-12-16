import { type LucideIcon } from 'lucide-react';

export interface Command {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    shortcut?: string;
    keywords: string[];
    action: (args: string) => void;
    category: CommandCategory;
    example?: string;
}

export type CommandCategory =
    | 'navigation'
    | 'tools'
    | 'search'
    | 'players';

export interface CommandGroup {
    category: CommandCategory;
    label: string;
    commands: Command[];
}

export interface ParsedCommand {
    command: string | null;
    args: string;
    isCommand: boolean;
}

export interface RecentCommand {
    query: string;
    timestamp: number;
}
