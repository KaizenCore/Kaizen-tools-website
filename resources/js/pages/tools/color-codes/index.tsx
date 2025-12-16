import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { chatColors, formatCodes } from '@/data/chat-colors';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Bold,
    Check,
    Copy,
    Italic,
    Palette,
    RotateCcw,
    Shuffle,
    Strikethrough,
    Underline,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '/tools/color-codes',
    },
    {
        title: 'Color Codes',
        href: '/tools/color-codes',
    },
];

interface ParsedSegment {
    text: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;
}

export default function ColorCodesIndex() {
    const [message, setMessage] = useState('');
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [obfuscatedTexts, setObfuscatedTexts] = useState<
        Map<number, string>
    >(new Map());

    const insertCode = (code: string, isFormat = false) => {
        const textarea = textareaRef.current;
        if (!textarea) {
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText =
            message.substring(0, start) +
            `§${code}` +
            message.substring(end);

        setMessage(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
    };

    const parseMessage = (msg: string): ParsedSegment[] => {
        const segments: ParsedSegment[] = [];
        let currentSegment: ParsedSegment = { text: '' };
        let i = 0;

        while (i < msg.length) {
            if (msg[i] === '§' && i + 1 < msg.length) {
                const code = msg[i + 1].toLowerCase();

                if (currentSegment.text) {
                    segments.push({ ...currentSegment });
                    currentSegment = {
                        text: '',
                        color: currentSegment.color,
                        bold: currentSegment.bold,
                        italic: currentSegment.italic,
                        underline: currentSegment.underline,
                        strikethrough: currentSegment.strikethrough,
                        obfuscated: currentSegment.obfuscated,
                    };
                }

                const colorMatch = chatColors.find((c) => c.code === code);
                if (colorMatch) {
                    currentSegment.color = colorMatch.hex;
                    currentSegment.bold = false;
                    currentSegment.italic = false;
                    currentSegment.underline = false;
                    currentSegment.strikethrough = false;
                    currentSegment.obfuscated = false;
                } else if (code === 'l') {
                    currentSegment.bold = true;
                } else if (code === 'o') {
                    currentSegment.italic = true;
                } else if (code === 'n') {
                    currentSegment.underline = true;
                } else if (code === 'm') {
                    currentSegment.strikethrough = true;
                } else if (code === 'k') {
                    currentSegment.obfuscated = true;
                } else if (code === 'r') {
                    currentSegment = { text: '' };
                }

                i += 2;
            } else {
                currentSegment.text += msg[i];
                i++;
            }
        }

        if (currentSegment.text) {
            segments.push(currentSegment);
        }

        return segments;
    };

    const generateObfuscatedText = (length: number): string => {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        return Array.from(
            { length },
            () => chars[Math.floor(Math.random() * chars.length)],
        ).join('');
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setObfuscatedTexts((prev) => {
                const newMap = new Map(prev);
                newMap.forEach((_, key) => {
                    const segments = parseMessage(message);
                    if (segments[key]?.obfuscated) {
                        newMap.set(
                            key,
                            generateObfuscatedText(
                                segments[key].text.length,
                            ),
                        );
                    }
                });
                return newMap;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [message]);

    useEffect(() => {
        const segments = parseMessage(message);
        const newMap = new Map<number, string>();
        segments.forEach((segment, index) => {
            if (segment.obfuscated) {
                newMap.set(index, generateObfuscatedText(segment.text.length));
            }
        });
        setObfuscatedTexts(newMap);
    }, [message]);

    const convertToAmpersand = (msg: string): string => {
        return msg.replace(/§/g, '&');
    };

    const convertToJson = (msg: string): string => {
        const segments = parseMessage(msg);
        const jsonParts: any[] = [];

        segments.forEach((segment) => {
            if (!segment.text) {
                return;
            }

            const part: any = { text: segment.text };

            if (segment.color) {
                const colorMatch = chatColors.find(
                    (c) => c.hex === segment.color,
                );
                if (colorMatch) {
                    part.color = colorMatch.name.toLowerCase().replace(' ', '_');
                }
            }

            if (segment.bold) {
                part.bold = true;
            }
            if (segment.italic) {
                part.italic = true;
            }
            if (segment.underline) {
                part.underlined = true;
            }
            if (segment.strikethrough) {
                part.strikethrough = true;
            }
            if (segment.obfuscated) {
                part.obfuscated = true;
            }

            jsonParts.push(part);
        });

        return JSON.stringify(jsonParts, null, 2);
    };

    const convertToMiniMessage = (msg: string): string => {
        const segments = parseMessage(msg);
        let result = '';

        segments.forEach((segment) => {
            if (!segment.text) {
                return;
            }

            let tags: string[] = [];

            if (segment.color) {
                const colorMatch = chatColors.find(
                    (c) => c.hex === segment.color,
                );
                if (colorMatch) {
                    tags.push(colorMatch.name.toLowerCase().replace(' ', '_'));
                }
            }

            if (segment.bold) {
                tags.push('bold');
            }
            if (segment.italic) {
                tags.push('italic');
            }
            if (segment.underline) {
                tags.push('underlined');
            }
            if (segment.strikethrough) {
                tags.push('strikethrough');
            }
            if (segment.obfuscated) {
                tags.push('obfuscated');
            }

            if (tags.length > 0) {
                result += `<${tags.join(':')}>${segment.text}</${tags[0]}>`;
            } else {
                result += segment.text;
            }
        });

        return result;
    };

    const copyToClipboard = async (text: string, format: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedFormat(format);
            setTimeout(() => setCopiedFormat(null), 2000);
        } catch {
            // Silently fail if clipboard API is not available
        }
    };

    const resetMessage = () => {
        setMessage('');
    };

    const parsedSegments = parseMessage(message);
    const ampersandFormat = convertToAmpersand(message);
    const jsonFormat = convertToJson(message);
    const miniMessageFormat = convertToMiniMessage(message);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Color Codes" />

            <div className="mx-auto max-w-screen-2xl p-4 sm:p-6">
                <div className="mb-6 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Minecraft Color Code Generator
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Create formatted text with colors and styles for
                        Minecraft chat, signs, and more
                    </p>
                </div>

                {/* Input Section */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="size-5" />
                            Message Editor
                        </CardTitle>
                        <CardDescription>
                            Type your message and click colors or formats to
                            insert codes
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Text Input */}
                        <Textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="min-h-32 font-mono text-base"
                        />

                        {/* Color Palette */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Colors
                            </label>
                            <div className="grid grid-cols-8 gap-2 sm:grid-cols-16">
                                {chatColors.map((color) => (
                                    <button
                                        key={color.code}
                                        onClick={() => insertCode(color.code)}
                                        className="group relative flex aspect-square items-center justify-center rounded-lg border-2 transition-all hover:scale-110 hover:border-primary"
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    >
                                        <span className="absolute -bottom-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                            {color.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Format Buttons */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Formatting
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => insertCode('l', true)}
                                >
                                    <Bold className="size-4" />
                                    Bold
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => insertCode('o', true)}
                                >
                                    <Italic className="size-4" />
                                    Italic
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => insertCode('n', true)}
                                >
                                    <Underline className="size-4" />
                                    Underline
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => insertCode('m', true)}
                                >
                                    <Strikethrough className="size-4" />
                                    Strikethrough
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => insertCode('k', true)}
                                >
                                    <Shuffle className="size-4" />
                                    Obfuscated
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => insertCode('r', true)}
                                >
                                    <RotateCcw className="size-4" />
                                    Reset
                                </Button>
                            </div>
                        </div>

                        {/* Reset Button */}
                        {message && (
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={resetMessage}
                                >
                                    Clear All
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Preview Section */}
                {message && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Live Preview</CardTitle>
                            <CardDescription>
                                How your message will look in Minecraft
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg bg-black/90 p-6">
                                <div className="font-minecraft text-xl leading-relaxed">
                                    {parsedSegments.map((segment, index) => {
                                        const displayText = segment.obfuscated
                                            ? obfuscatedTexts.get(index) ||
                                              segment.text
                                            : segment.text;

                                        return (
                                            <span
                                                key={index}
                                                style={{
                                                    color:
                                                        segment.color ||
                                                        '#FFFFFF',
                                                    fontWeight: segment.bold
                                                        ? 'bold'
                                                        : 'normal',
                                                    fontStyle: segment.italic
                                                        ? 'italic'
                                                        : 'normal',
                                                    textDecoration: [
                                                        segment.underline &&
                                                            'underline',
                                                        segment.strikethrough &&
                                                            'line-through',
                                                    ]
                                                        .filter(Boolean)
                                                        .join(' '),
                                                }}
                                            >
                                                {displayText}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Output Formats */}
                {message && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Section Symbol Format */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Section Symbol (§) Format
                                </CardTitle>
                                <CardDescription>
                                    Standard Minecraft format
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="rounded-md bg-muted p-4">
                                    <code className="break-all font-mono text-sm">
                                        {message}
                                    </code>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        copyToClipboard(message, 'section')
                                    }
                                    className="w-full"
                                >
                                    {copiedFormat === 'section' ? (
                                        <>
                                            <Check className="size-4 text-green-600" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Ampersand Format */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Ampersand (&) Format
                                </CardTitle>
                                <CardDescription>
                                    For plugins like Essentials
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="rounded-md bg-muted p-4">
                                    <code className="break-all font-mono text-sm">
                                        {ampersandFormat}
                                    </code>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        copyToClipboard(
                                            ampersandFormat,
                                            'ampersand',
                                        )
                                    }
                                    className="w-full"
                                >
                                    {copiedFormat === 'ampersand' ? (
                                        <>
                                            <Check className="size-4 text-green-600" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* JSON Format */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    JSON Format
                                </CardTitle>
                                <CardDescription>
                                    For tellraw and other commands
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="max-h-64 overflow-auto rounded-md bg-muted p-4">
                                    <pre className="font-mono text-xs">
                                        {jsonFormat}
                                    </pre>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        copyToClipboard(jsonFormat, 'json')
                                    }
                                    className="w-full"
                                >
                                    {copiedFormat === 'json' ? (
                                        <>
                                            <Check className="size-4 text-green-600" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* MiniMessage Format */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    MiniMessage Format
                                </CardTitle>
                                <CardDescription>
                                    For Paper/Velocity servers
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="rounded-md bg-muted p-4">
                                    <code className="break-all font-mono text-sm">
                                        {miniMessageFormat}
                                    </code>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        copyToClipboard(
                                            miniMessageFormat,
                                            'minimessage',
                                        )
                                    }
                                    className="w-full"
                                >
                                    {copiedFormat === 'minimessage' ? (
                                        <>
                                            <Check className="size-4 text-green-600" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Empty State */}
                {!message && (
                    <div className="mt-16 flex flex-col items-center justify-center space-y-4 py-12">
                        <div className="flex size-20 items-center justify-center rounded-full bg-muted/50">
                            <Palette className="size-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-2 text-center">
                            <h3 className="text-xl font-semibold">
                                Start creating your message
                            </h3>
                            <p className="max-w-md text-sm text-muted-foreground">
                                Type a message above and use the color palette
                                and formatting buttons to add style codes.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
