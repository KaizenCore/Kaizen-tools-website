export interface BossbarColor {
    id: string;
    name: string;
    hex: string;
}

export interface BossbarStyle {
    id: string;
    name: string;
    notches: number;
}

export interface BossbarProperty {
    id: string;
    name: string;
    type: 'text' | 'color' | 'style' | 'number' | 'boolean' | 'players';
}

export interface CommandType {
    id: string;
    name: string;
    description: string;
}

export interface SetSubcommand {
    id: string;
    name: string;
    type: 'text' | 'color' | 'style' | 'number' | 'boolean' | 'players';
}

export interface GetSubcommand {
    id: string;
    name: string;
}

export interface MinecraftFormatCode {
    code: string;
    name: string;
    hex?: string;
    type: 'color' | 'format';
}

export interface BossbarPreset {
    id: string;
    name: string;
    description: string;
    config: {
        id: string;
        displayName: string;
        color: string;
        style: string;
        value: number;
        max: number;
        visible: boolean;
        players: string;
    };
}

export const bossbarColors: BossbarColor[] = [
    { id: 'blue', name: 'Blue', hex: '#5555FF' },
    { id: 'green', name: 'Green', hex: '#55FF55' },
    { id: 'pink', name: 'Pink', hex: '#FF55FF' },
    { id: 'purple', name: 'Purple', hex: '#AA00AA' },
    { id: 'red', name: 'Red', hex: '#FF5555' },
    { id: 'white', name: 'White', hex: '#FFFFFF' },
    { id: 'yellow', name: 'Yellow', hex: '#FFFF55' },
];

export const bossbarStyles: BossbarStyle[] = [
    { id: 'progress', name: 'Solid', notches: 0 },
    { id: 'notched_6', name: '6 Notches', notches: 6 },
    { id: 'notched_10', name: '10 Notches', notches: 10 },
    { id: 'notched_12', name: '12 Notches', notches: 12 },
    { id: 'notched_20', name: '20 Notches', notches: 20 },
];

export const bossbarProperties: BossbarProperty[] = [
    { id: 'name', name: 'Display Name', type: 'text' },
    { id: 'color', name: 'Color', type: 'color' },
    { id: 'style', name: 'Style', type: 'style' },
    { id: 'value', name: 'Current Value', type: 'number' },
    { id: 'max', name: 'Maximum Value', type: 'number' },
    { id: 'visible', name: 'Visible', type: 'boolean' },
    { id: 'players', name: 'Players', type: 'players' },
];

export const commandTypes: CommandType[] = [
    {
        id: 'add',
        name: 'Create Bossbar',
        description: 'Create a new bossbar with a unique ID',
    },
    {
        id: 'remove',
        name: 'Remove Bossbar',
        description: 'Remove an existing bossbar',
    },
    {
        id: 'list',
        name: 'List Bossbars',
        description: 'Show all existing bossbars',
    },
    {
        id: 'set',
        name: 'Modify Property',
        description: 'Change a property of an existing bossbar',
    },
    {
        id: 'get',
        name: 'Query Property',
        description: 'Get the value of a bossbar property',
    },
];

export const setSubcommands: SetSubcommand[] = [
    { id: 'color', name: 'Color', type: 'color' },
    { id: 'style', name: 'Style', type: 'style' },
    { id: 'name', name: 'Display Name', type: 'text' },
    { id: 'players', name: 'Players', type: 'players' },
    { id: 'max', name: 'Maximum Value', type: 'number' },
    { id: 'value', name: 'Current Value', type: 'number' },
    { id: 'visible', name: 'Visible', type: 'boolean' },
];

export const getSubcommands: GetSubcommand[] = [
    { id: 'max', name: 'Maximum Value' },
    { id: 'value', name: 'Current Value' },
    { id: 'visible', name: 'Visible' },
    { id: 'players', name: 'Players' },
];

export const minecraftFormatCodes: MinecraftFormatCode[] = [
    { code: '§0', name: 'Black', hex: '#000000', type: 'color' },
    { code: '§1', name: 'Dark Blue', hex: '#0000AA', type: 'color' },
    { code: '§2', name: 'Dark Green', hex: '#00AA00', type: 'color' },
    { code: '§3', name: 'Dark Aqua', hex: '#00AAAA', type: 'color' },
    { code: '§4', name: 'Dark Red', hex: '#AA0000', type: 'color' },
    { code: '§5', name: 'Dark Purple', hex: '#AA00AA', type: 'color' },
    { code: '§6', name: 'Gold', hex: '#FFAA00', type: 'color' },
    { code: '§7', name: 'Gray', hex: '#AAAAAA', type: 'color' },
    { code: '§8', name: 'Dark Gray', hex: '#555555', type: 'color' },
    { code: '§9', name: 'Blue', hex: '#5555FF', type: 'color' },
    { code: '§a', name: 'Green', hex: '#55FF55', type: 'color' },
    { code: '§b', name: 'Aqua', hex: '#55FFFF', type: 'color' },
    { code: '§c', name: 'Red', hex: '#FF5555', type: 'color' },
    { code: '§d', name: 'Light Purple', hex: '#FF55FF', type: 'color' },
    { code: '§e', name: 'Yellow', hex: '#FFFF55', type: 'color' },
    { code: '§f', name: 'White', hex: '#FFFFFF', type: 'color' },
    { code: '§l', name: 'Bold', type: 'format' },
    { code: '§o', name: 'Italic', type: 'format' },
    { code: '§n', name: 'Underline', type: 'format' },
    { code: '§m', name: 'Strikethrough', type: 'format' },
    { code: '§k', name: 'Obfuscated', type: 'format' },
    { code: '§r', name: 'Reset', type: 'format' },
];

export const bossbarPresets: BossbarPreset[] = [
    {
        id: 'health',
        name: 'Health Bar',
        description: 'A red health bar showing player health',
        config: {
            id: 'minecraft:health',
            displayName: '§cHealth',
            color: 'red',
            style: 'progress',
            value: 20,
            max: 20,
            visible: true,
            players: '@a',
        },
    },
    {
        id: 'progress',
        name: 'Progress Bar',
        description: 'A blue progress bar for tracking completion',
        config: {
            id: 'minecraft:progress',
            displayName: '§9Progress',
            color: 'blue',
            style: 'notched_10',
            value: 0,
            max: 100,
            visible: true,
            players: '@a',
        },
    },
    {
        id: 'timer',
        name: 'Timer Bar',
        description: 'A yellow countdown timer',
        config: {
            id: 'minecraft:timer',
            displayName: '§eTime Remaining',
            color: 'yellow',
            style: 'progress',
            value: 60,
            max: 60,
            visible: true,
            players: '@a',
        },
    },
    {
        id: 'quest',
        name: 'Quest Tracker',
        description: 'A purple quest tracking bar',
        config: {
            id: 'minecraft:quest',
            displayName: '§dQuest Progress',
            color: 'purple',
            style: 'notched_12',
            value: 0,
            max: 12,
            visible: true,
            players: '@a',
        },
    },
];
