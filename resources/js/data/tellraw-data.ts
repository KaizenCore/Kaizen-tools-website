export interface MinecraftColor {
    name: string;
    code: string;
    hex: string;
}

export interface TextFormatting {
    id: string;
    name: string;
    jsonKey: string;
}

export interface ClickEvent {
    id: string;
    name: string;
    description: string;
    requiresValue: boolean;
    placeholder: string;
}

export interface HoverEvent {
    id: string;
    name: string;
    description: string;
}

export interface Selector {
    id: string;
    name: string;
    description: string;
    example: string;
}

export interface Keybind {
    id: string;
    name: string;
}

export const minecraftColors: MinecraftColor[] = [
    { name: 'Black', code: 'black', hex: '#000000' },
    { name: 'Dark Blue', code: 'dark_blue', hex: '#0000AA' },
    { name: 'Dark Green', code: 'dark_green', hex: '#00AA00' },
    { name: 'Dark Aqua', code: 'dark_aqua', hex: '#00AAAA' },
    { name: 'Dark Red', code: 'dark_red', hex: '#AA0000' },
    { name: 'Dark Purple', code: 'dark_purple', hex: '#AA00AA' },
    { name: 'Gold', code: 'gold', hex: '#FFAA00' },
    { name: 'Gray', code: 'gray', hex: '#AAAAAA' },
    { name: 'Dark Gray', code: 'dark_gray', hex: '#555555' },
    { name: 'Blue', code: 'blue', hex: '#5555FF' },
    { name: 'Green', code: 'green', hex: '#55FF55' },
    { name: 'Aqua', code: 'aqua', hex: '#55FFFF' },
    { name: 'Red', code: 'red', hex: '#FF5555' },
    { name: 'Light Purple', code: 'light_purple', hex: '#FF55FF' },
    { name: 'Yellow', code: 'yellow', hex: '#FFFF55' },
    { name: 'White', code: 'white', hex: '#FFFFFF' },
];

export const textFormatting: TextFormatting[] = [
    { id: 'bold', name: 'Bold', jsonKey: 'bold' },
    { id: 'italic', name: 'Italic', jsonKey: 'italic' },
    { id: 'underlined', name: 'Underlined', jsonKey: 'underlined' },
    { id: 'strikethrough', name: 'Strikethrough', jsonKey: 'strikethrough' },
    { id: 'obfuscated', name: 'Obfuscated', jsonKey: 'obfuscated' },
];

export const clickEvents: ClickEvent[] = [
    {
        id: 'open_url',
        name: 'Open URL',
        description: 'Opens a URL when clicked',
        requiresValue: true,
        placeholder: 'https://example.com',
    },
    {
        id: 'run_command',
        name: 'Run Command',
        description: 'Runs a command when clicked',
        requiresValue: true,
        placeholder: '/say Hello!',
    },
    {
        id: 'suggest_command',
        name: 'Suggest Command',
        description: 'Suggests a command in chat when clicked',
        requiresValue: true,
        placeholder: '/give @s diamond',
    },
    {
        id: 'copy_to_clipboard',
        name: 'Copy to Clipboard',
        description: 'Copies text to clipboard when clicked',
        requiresValue: true,
        placeholder: 'Text to copy',
    },
    {
        id: 'change_page',
        name: 'Change Page',
        description: 'Changes book page when clicked',
        requiresValue: true,
        placeholder: '2',
    },
];

export const hoverEvents: HoverEvent[] = [
    {
        id: 'show_text',
        name: 'Show Text',
        description: 'Shows text when hovering',
    },
    {
        id: 'show_item',
        name: 'Show Item',
        description: 'Shows item tooltip when hovering',
    },
    {
        id: 'show_entity',
        name: 'Show Entity',
        description: 'Shows entity information when hovering',
    },
];

export const selectors: Selector[] = [
    {
        id: '@p',
        name: 'Nearest Player',
        description: 'Targets the nearest player',
        example: '@p',
    },
    {
        id: '@a',
        name: 'All Players',
        description: 'Targets all players',
        example: '@a',
    },
    {
        id: '@r',
        name: 'Random Player',
        description: 'Targets a random player',
        example: '@r',
    },
    {
        id: '@e',
        name: 'All Entities',
        description: 'Targets all entities',
        example: '@e[type=cow]',
    },
    {
        id: '@s',
        name: 'Self',
        description: 'Targets the executing entity',
        example: '@s',
    },
];

export const keybinds: Keybind[] = [
    { id: 'key.jump', name: 'Jump' },
    { id: 'key.sneak', name: 'Sneak' },
    { id: 'key.sprint', name: 'Sprint' },
    { id: 'key.forward', name: 'Walk Forward' },
    { id: 'key.left', name: 'Strafe Left' },
    { id: 'key.back', name: 'Walk Backwards' },
    { id: 'key.right', name: 'Strafe Right' },
    { id: 'key.attack', name: 'Attack' },
    { id: 'key.use', name: 'Use Item' },
    { id: 'key.pickItem', name: 'Pick Block' },
    { id: 'key.drop', name: 'Drop' },
    { id: 'key.inventory', name: 'Inventory' },
    { id: 'key.chat', name: 'Chat' },
    { id: 'key.playerlist', name: 'Player List' },
    { id: 'key.command', name: 'Command' },
    { id: 'key.screenshot', name: 'Screenshot' },
    { id: 'key.togglePerspective', name: 'Toggle Perspective' },
    { id: 'key.smoothCamera', name: 'Smooth Camera' },
    { id: 'key.fullscreen', name: 'Fullscreen' },
    { id: 'key.spectatorOutlines', name: 'Spectator Outlines' },
    { id: 'key.swapOffhand', name: 'Swap Offhand' },
    { id: 'key.saveToolbarActivator', name: 'Save Toolbar' },
    { id: 'key.loadToolbarActivator', name: 'Load Toolbar' },
    { id: 'key.advancements', name: 'Advancements' },
    { id: 'key.hotbar.1', name: 'Hotbar Slot 1' },
    { id: 'key.hotbar.2', name: 'Hotbar Slot 2' },
    { id: 'key.hotbar.3', name: 'Hotbar Slot 3' },
    { id: 'key.hotbar.4', name: 'Hotbar Slot 4' },
    { id: 'key.hotbar.5', name: 'Hotbar Slot 5' },
    { id: 'key.hotbar.6', name: 'Hotbar Slot 6' },
    { id: 'key.hotbar.7', name: 'Hotbar Slot 7' },
    { id: 'key.hotbar.8', name: 'Hotbar Slot 8' },
    { id: 'key.hotbar.9', name: 'Hotbar Slot 9' },
];

export const commandTypes = [
    { id: 'tellraw', name: 'Tellraw (Chat)', description: 'Sends a message in chat' },
    { id: 'title', name: 'Title (Large Text)', description: 'Shows large title text' },
    { id: 'subtitle', name: 'Subtitle', description: 'Shows subtitle below title' },
    { id: 'actionbar', name: 'Action Bar', description: 'Shows text above hotbar' },
];
