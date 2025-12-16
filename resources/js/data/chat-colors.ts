export interface ChatColor {
    code: string;
    name: string;
    hex: string;
}

export interface FormatCode {
    code: string;
    name: string;
    css: string;
}

export const chatColors: ChatColor[] = [
    { code: '0', name: 'Black', hex: '#000000' },
    { code: '1', name: 'Dark Blue', hex: '#0000AA' },
    { code: '2', name: 'Dark Green', hex: '#00AA00' },
    { code: '3', name: 'Dark Aqua', hex: '#00AAAA' },
    { code: '4', name: 'Dark Red', hex: '#AA0000' },
    { code: '5', name: 'Dark Purple', hex: '#AA00AA' },
    { code: '6', name: 'Gold', hex: '#FFAA00' },
    { code: '7', name: 'Gray', hex: '#AAAAAA' },
    { code: '8', name: 'Dark Gray', hex: '#555555' },
    { code: '9', name: 'Blue', hex: '#5555FF' },
    { code: 'a', name: 'Green', hex: '#55FF55' },
    { code: 'b', name: 'Aqua', hex: '#55FFFF' },
    { code: 'c', name: 'Red', hex: '#FF5555' },
    { code: 'd', name: 'Light Purple', hex: '#FF55FF' },
    { code: 'e', name: 'Yellow', hex: '#FFFF55' },
    { code: 'f', name: 'White', hex: '#FFFFFF' },
];

export const formatCodes: FormatCode[] = [
    { code: 'k', name: 'Obfuscated', css: 'animation: obfuscate 0.1s infinite' },
    { code: 'l', name: 'Bold', css: 'font-weight: bold' },
    { code: 'm', name: 'Strikethrough', css: 'text-decoration: line-through' },
    { code: 'n', name: 'Underline', css: 'text-decoration: underline' },
    { code: 'o', name: 'Italic', css: 'font-style: italic' },
    { code: 'r', name: 'Reset', css: '' },
];
