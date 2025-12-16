export interface SignType {
    id: string;
    name: string;
}

export interface DyeColor {
    id: string;
    name: string;
    hex: string;
}

export interface TextFormat {
    id: string;
    name: string;
    jsonKey: string;
}

export const signTypes: SignType[] = [
    { id: 'oak', name: 'Oak Sign' },
    { id: 'spruce', name: 'Spruce Sign' },
    { id: 'birch', name: 'Birch Sign' },
    { id: 'jungle', name: 'Jungle Sign' },
    { id: 'acacia', name: 'Acacia Sign' },
    { id: 'dark_oak', name: 'Dark Oak Sign' },
    { id: 'mangrove', name: 'Mangrove Sign' },
    { id: 'cherry', name: 'Cherry Sign' },
    { id: 'bamboo', name: 'Bamboo Sign' },
    { id: 'crimson', name: 'Crimson Sign' },
    { id: 'warped', name: 'Warped Sign' },
];

export const hangingSignTypes: SignType[] = [
    { id: 'oak', name: 'Oak Hanging Sign' },
    { id: 'spruce', name: 'Spruce Hanging Sign' },
    { id: 'birch', name: 'Birch Hanging Sign' },
    { id: 'jungle', name: 'Jungle Hanging Sign' },
    { id: 'acacia', name: 'Acacia Hanging Sign' },
    { id: 'dark_oak', name: 'Dark Oak Hanging Sign' },
    { id: 'mangrove', name: 'Mangrove Hanging Sign' },
    { id: 'cherry', name: 'Cherry Hanging Sign' },
    { id: 'bamboo', name: 'Bamboo Hanging Sign' },
    { id: 'crimson', name: 'Crimson Hanging Sign' },
    { id: 'warped', name: 'Warped Hanging Sign' },
];

export const dyeColors: DyeColor[] = [
    { id: 'black', name: 'Black', hex: '#1D1D21' },
    { id: 'red', name: 'Red', hex: '#B02E26' },
    { id: 'green', name: 'Green', hex: '#5E7C16' },
    { id: 'brown', name: 'Brown', hex: '#835432' },
    { id: 'blue', name: 'Blue', hex: '#3C44AA' },
    { id: 'purple', name: 'Purple', hex: '#8932B8' },
    { id: 'cyan', name: 'Cyan', hex: '#169C9C' },
    { id: 'light_gray', name: 'Light Gray', hex: '#9D9D97' },
    { id: 'gray', name: 'Gray', hex: '#474F52' },
    { id: 'pink', name: 'Pink', hex: '#F38BAA' },
    { id: 'lime', name: 'Lime', hex: '#80C71F' },
    { id: 'yellow', name: 'Yellow', hex: '#FED83D' },
    { id: 'light_blue', name: 'Light Blue', hex: '#3AB3DA' },
    { id: 'magenta', name: 'Magenta', hex: '#C74EBD' },
    { id: 'orange', name: 'Orange', hex: '#F9801D' },
    { id: 'white', name: 'White', hex: '#F9FFFE' },
];

export const textFormats: TextFormat[] = [
    { id: 'bold', name: 'Bold', jsonKey: 'bold' },
    { id: 'italic', name: 'Italic', jsonKey: 'italic' },
];

export const minecraftTextColors: DyeColor[] = [
    { id: 'black', name: 'Black', hex: '#000000' },
    { id: 'dark_blue', name: 'Dark Blue', hex: '#0000AA' },
    { id: 'dark_green', name: 'Dark Green', hex: '#00AA00' },
    { id: 'dark_aqua', name: 'Dark Aqua', hex: '#00AAAA' },
    { id: 'dark_red', name: 'Dark Red', hex: '#AA0000' },
    { id: 'dark_purple', name: 'Dark Purple', hex: '#AA00AA' },
    { id: 'gold', name: 'Gold', hex: '#FFAA00' },
    { id: 'gray', name: 'Gray', hex: '#AAAAAA' },
    { id: 'dark_gray', name: 'Dark Gray', hex: '#555555' },
    { id: 'blue', name: 'Blue', hex: '#5555FF' },
    { id: 'green', name: 'Green', hex: '#55FF55' },
    { id: 'aqua', name: 'Aqua', hex: '#55FFFF' },
    { id: 'red', name: 'Red', hex: '#FF5555' },
    { id: 'light_purple', name: 'Light Purple', hex: '#FF55FF' },
    { id: 'yellow', name: 'Yellow', hex: '#FFFF55' },
    { id: 'white', name: 'White', hex: '#FFFFFF' },
];

export const SIGN_LINE_LIMIT = 4;
export const SIGN_CHAR_LIMIT = 15;
export const BOOK_PAGE_LIMIT = 100;
export const BOOK_CHAR_PER_PAGE = 256;
export const BOOK_TOTAL_CHAR_LIMIT = 32767;
