import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { OutputPanel, ToolLayout } from '@/components/tool-layout';
import {
    BOOK_CHAR_PER_PAGE,
    BOOK_PAGE_LIMIT,
    dyeColors,
    hangingSignTypes,
    minecraftTextColors,
    SIGN_CHAR_LIMIT,
    SIGN_LINE_LIMIT,
    signTypes,
} from '@/data/sign-book-data';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bold, Check, Copy, Italic, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Sign & Book Generator',
        href: '/tools/sign-book-generator',
    },
];

interface SignLine {
    text: string;
    color: string;
    bold: boolean;
    italic: boolean;
}

interface BookPage {
    text: string;
    color: string;
    bold: boolean;
    italic: boolean;
}

export default function SignBookGenerator() {
    const [mode, setMode] = useState<'sign' | 'hanging' | 'book'>('sign');
    const [copied, setCopied] = useState(false);

    // Sign state
    const [signType, setSignType] = useState('oak');
    const [signLines, setSignLines] = useState<SignLine[]>([
        { text: '', color: 'black', bold: false, italic: false },
        { text: '', color: 'black', bold: false, italic: false },
        { text: '', color: 'black', bold: false, italic: false },
        { text: '', color: 'black', bold: false, italic: false },
    ]);
    const [glowingText, setGlowingText] = useState(false);
    const [dyeColor, setDyeColor] = useState('black');

    // Book state
    const [bookTitle, setBookTitle] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');
    const [bookPages, setBookPages] = useState<BookPage[]>([
        { text: '', color: 'black', bold: false, italic: false },
    ]);
    const [currentPage, setCurrentPage] = useState(0);

    const updateSignLine = (index: number, updates: Partial<SignLine>) => {
        const newLines = [...signLines];
        newLines[index] = { ...newLines[index], ...updates };
        setSignLines(newLines);
    };

    const updateBookPage = (index: number, updates: Partial<BookPage>) => {
        const newPages = [...bookPages];
        newPages[index] = { ...newPages[index], ...updates };
        setBookPages(newPages);
    };

    const addBookPage = () => {
        if (bookPages.length < BOOK_PAGE_LIMIT) {
            setBookPages([
                ...bookPages,
                { text: '', color: 'black', bold: false, italic: false },
            ]);
            setCurrentPage(bookPages.length);
        }
    };

    const removeBookPage = (index: number) => {
        if (bookPages.length > 1) {
            const newPages = bookPages.filter((_, i) => i !== index);
            setBookPages(newPages);
            if (currentPage >= newPages.length) {
                setCurrentPage(newPages.length - 1);
            }
        }
    };

    const generateSignJson = (line: SignLine): string => {
        if (!line.text) {
            return '""';
        }

        const jsonObj: Record<string, unknown> = {
            text: line.text,
        };

        if (line.color !== 'black') {
            jsonObj.color = line.color;
        }

        if (line.bold) {
            jsonObj.bold = true;
        }

        if (line.italic) {
            jsonObj.italic = true;
        }

        return JSON.stringify(jsonObj);
    };

    const generateBookJson = (page: BookPage): string => {
        if (!page.text) {
            return '""';
        }

        const jsonObj: Record<string, unknown> = {
            text: page.text,
        };

        if (page.color !== 'black') {
            jsonObj.color = page.color;
        }

        if (page.bold) {
            jsonObj.bold = true;
        }

        if (page.italic) {
            jsonObj.italic = true;
        }

        return JSON.stringify(jsonObj);
    };

    const generateSignCommand = (): string => {
        const signTypeName = mode === 'hanging' ? `${signType}_hanging_sign` : `${signType}_sign`;
        const lines = signLines.map((line) => generateSignJson(line));

        let nbt = '{';
        nbt += `front_text:{messages:['${lines[0]}','${lines[1]}','${lines[2]}','${lines[3]}']`;

        if (glowingText) {
            nbt += ',has_glowing_text:1b';
        }

        if (dyeColor !== 'black') {
            nbt += `,color:"${dyeColor}"`;
        }

        nbt += '}}';

        return `/give @p minecraft:${signTypeName}${nbt}`;
    };

    const generateBookCommand = (): string => {
        const pages = bookPages.map((page) => generateBookJson(page));
        const pagesStr = pages.map((p) => `'${p}'`).join(',');

        let nbt = '{';

        if (bookTitle) {
            nbt += `title:"${bookTitle}",`;
        }

        if (bookAuthor) {
            nbt += `author:"${bookAuthor}",`;
        }

        nbt += `pages:[${pagesStr}]}`;

        return `/give @p minecraft:written_book${nbt}`;
    };

    const copyCommand = async () => {
        const command = mode === 'book' ? generateBookCommand() : generateSignCommand();
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const reset = () => {
        if (mode === 'book') {
            setBookTitle('');
            setBookAuthor('');
            setBookPages([{ text: '', color: 'black', bold: false, italic: false }]);
            setCurrentPage(0);
        } else {
            setSignType('oak');
            setSignLines([
                { text: '', color: 'black', bold: false, italic: false },
                { text: '', color: 'black', bold: false, italic: false },
                { text: '', color: 'black', bold: false, italic: false },
                { text: '', color: 'black', bold: false, italic: false },
            ]);
            setGlowingText(false);
            setDyeColor('black');
        }
    };

    const getColorByName = (colorId: string) => {
        return minecraftTextColors.find((c) => c.id === colorId);
    };

    const getDyeColorByName = (colorId: string) => {
        return dyeColors.find((c) => c.id === colorId);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sign & Book Generator" />
            <ToolLayout
                title="Minecraft Sign & Book Generator"
                description="Create formatted signs and written books with custom colors and styles"
            >
                <Tabs
                    value={mode}
                    onValueChange={(value) => setMode(value as typeof mode)}
                    className="flex flex-col gap-6"
                >
                    <TabsList className="grid w-full max-w-md grid-cols-3">
                        <TabsTrigger value="sign">Sign</TabsTrigger>
                        <TabsTrigger value="hanging">Hanging Sign</TabsTrigger>
                        <TabsTrigger value="book">Book</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sign" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sign Type</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Select value={signType} onValueChange={setSignType}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {signTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.id}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sign Text</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {signLines.map((line, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium">
                                                        Line {index + 1}
                                                    </label>
                                                    <span className="text-xs text-muted-foreground">
                                                        {line.text.length}/{SIGN_CHAR_LIMIT} chars
                                                    </span>
                                                </div>
                                                <Input
                                                    value={line.text}
                                                    onChange={(e) =>
                                                        updateSignLine(index, {
                                                            text: e.target.value.slice(
                                                                0,
                                                                SIGN_CHAR_LIMIT,
                                                            ),
                                                        })
                                                    }
                                                    placeholder={`Line ${index + 1}`}
                                                    maxLength={SIGN_CHAR_LIMIT}
                                                />
                                                <div className="flex gap-2">
                                                    <Select
                                                        value={line.color}
                                                        onValueChange={(value) =>
                                                            updateSignLine(index, { color: value })
                                                        }
                                                    >
                                                        <SelectTrigger className="w-40">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="size-3 rounded border"
                                                                    style={{
                                                                        backgroundColor:
                                                                            getColorByName(line.color)
                                                                                ?.hex,
                                                                    }}
                                                                />
                                                                <SelectValue />
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {minecraftTextColors.map((color) => (
                                                                <SelectItem
                                                                    key={color.id}
                                                                    value={color.id}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="size-3 rounded border"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    color.hex,
                                                                            }}
                                                                        />
                                                                        {color.name}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Toggle
                                                        pressed={line.bold}
                                                        onPressedChange={(pressed) =>
                                                            updateSignLine(index, { bold: pressed })
                                                        }
                                                        variant="outline"
                                                        aria-label="Toggle bold"
                                                    >
                                                        <Bold className="size-4" />
                                                    </Toggle>
                                                    <Toggle
                                                        pressed={line.italic}
                                                        onPressedChange={(pressed) =>
                                                            updateSignLine(index, {
                                                                italic: pressed,
                                                            })
                                                        }
                                                        variant="outline"
                                                        aria-label="Toggle italic"
                                                    >
                                                        <Italic className="size-4" />
                                                    </Toggle>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sign Options</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Dye Color</label>
                                            <div className="grid grid-cols-8 gap-2">
                                                {dyeColors.map((color) => (
                                                    <button
                                                        key={color.id}
                                                        type="button"
                                                        onClick={() => setDyeColor(color.id)}
                                                        className="aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105"
                                                        style={{
                                                            backgroundColor: color.hex,
                                                            borderColor:
                                                                dyeColor === color.id
                                                                    ? 'hsl(var(--primary))'
                                                                    : 'transparent',
                                                        }}
                                                        title={color.name}
                                                    >
                                                        {dyeColor === color.id && (
                                                            <div className="flex size-full items-center justify-center bg-black/20">
                                                                <Check className="size-4 text-white drop-shadow" />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Toggle
                                                pressed={glowingText}
                                                onPressedChange={setGlowingText}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                Glowing Text
                                            </Toggle>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Preview</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className="rounded-lg border p-6"
                                            style={{
                                                backgroundColor: 'oklch(0.87 0.04 85)',
                                            }}
                                        >
                                            <div className="space-y-1 rounded border-2 border-black/20 bg-gradient-to-b from-amber-800/40 to-amber-900/40 p-4 font-mono text-sm backdrop-blur-sm">
                                                {signLines.map((line, index) => (
                                                    <div
                                                        key={index}
                                                        className="text-center"
                                                        style={{
                                                            color:
                                                                getColorByName(line.color)?.hex ||
                                                                '#000000',
                                                            fontWeight: line.bold ? 'bold' : 'normal',
                                                            fontStyle: line.italic
                                                                ? 'italic'
                                                                : 'normal',
                                                            textShadow: glowingText
                                                                ? `0 0 4px ${getColorByName(line.color)?.hex || '#000000'}`
                                                                : 'none',
                                                        }}
                                                    >
                                                        {line.text || '\u00A0'}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Command</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                                            <code className="block break-all font-mono text-xs">
                                                {generateSignCommand()}
                                            </code>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={copyCommand}
                                                className="flex-1"
                                                disabled={copied}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="mr-2 size-4" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="mr-2 size-4" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                            <Button onClick={reset} variant="outline" className="flex-1">
                                                <RotateCcw className="mr-2 size-4" />
                                                Reset
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>How to Use</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                                        <div>
                                            <strong className="text-foreground">
                                                1. Choose sign type
                                            </strong>
                                            <p>Select the wood type for your sign.</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <strong className="text-foreground">
                                                2. Enter text
                                            </strong>
                                            <p>
                                                Type up to 4 lines of text with colors and
                                                formatting.
                                            </p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <strong className="text-foreground">
                                                3. Customize appearance
                                            </strong>
                                            <p>Choose dye color and enable glowing text if desired.</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <strong className="text-foreground">
                                                4. Copy command
                                            </strong>
                                            <p>
                                                Copy and paste the command in Minecraft to get your
                                                sign.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="hanging" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Hanging Sign Type</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Select value={signType} onValueChange={setSignType}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {hangingSignTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.id}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sign Text</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {signLines.map((line, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium">
                                                        Line {index + 1}
                                                    </label>
                                                    <span className="text-xs text-muted-foreground">
                                                        {line.text.length}/{SIGN_CHAR_LIMIT} chars
                                                    </span>
                                                </div>
                                                <Input
                                                    value={line.text}
                                                    onChange={(e) =>
                                                        updateSignLine(index, {
                                                            text: e.target.value.slice(
                                                                0,
                                                                SIGN_CHAR_LIMIT,
                                                            ),
                                                        })
                                                    }
                                                    placeholder={`Line ${index + 1}`}
                                                    maxLength={SIGN_CHAR_LIMIT}
                                                />
                                                <div className="flex gap-2">
                                                    <Select
                                                        value={line.color}
                                                        onValueChange={(value) =>
                                                            updateSignLine(index, { color: value })
                                                        }
                                                    >
                                                        <SelectTrigger className="w-40">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="size-3 rounded border"
                                                                    style={{
                                                                        backgroundColor:
                                                                            getColorByName(line.color)
                                                                                ?.hex,
                                                                    }}
                                                                />
                                                                <SelectValue />
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {minecraftTextColors.map((color) => (
                                                                <SelectItem
                                                                    key={color.id}
                                                                    value={color.id}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="size-3 rounded border"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    color.hex,
                                                                            }}
                                                                        />
                                                                        {color.name}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Toggle
                                                        pressed={line.bold}
                                                        onPressedChange={(pressed) =>
                                                            updateSignLine(index, { bold: pressed })
                                                        }
                                                        variant="outline"
                                                        aria-label="Toggle bold"
                                                    >
                                                        <Bold className="size-4" />
                                                    </Toggle>
                                                    <Toggle
                                                        pressed={line.italic}
                                                        onPressedChange={(pressed) =>
                                                            updateSignLine(index, {
                                                                italic: pressed,
                                                            })
                                                        }
                                                        variant="outline"
                                                        aria-label="Toggle italic"
                                                    >
                                                        <Italic className="size-4" />
                                                    </Toggle>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sign Options</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Dye Color</label>
                                            <div className="grid grid-cols-8 gap-2">
                                                {dyeColors.map((color) => (
                                                    <button
                                                        key={color.id}
                                                        type="button"
                                                        onClick={() => setDyeColor(color.id)}
                                                        className="aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105"
                                                        style={{
                                                            backgroundColor: color.hex,
                                                            borderColor:
                                                                dyeColor === color.id
                                                                    ? 'hsl(var(--primary))'
                                                                    : 'transparent',
                                                        }}
                                                        title={color.name}
                                                    >
                                                        {dyeColor === color.id && (
                                                            <div className="flex size-full items-center justify-center bg-black/20">
                                                                <Check className="size-4 text-white drop-shadow" />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Toggle
                                                pressed={glowingText}
                                                onPressedChange={setGlowingText}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                Glowing Text
                                            </Toggle>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Preview</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className="rounded-lg border p-6"
                                            style={{
                                                backgroundColor: 'oklch(0.87 0.04 85)',
                                            }}
                                        >
                                            <div className="space-y-1 rounded border-2 border-black/20 bg-gradient-to-b from-amber-800/30 to-amber-900/30 p-3 font-mono text-xs backdrop-blur-sm">
                                                {signLines.map((line, index) => (
                                                    <div
                                                        key={index}
                                                        className="text-center"
                                                        style={{
                                                            color:
                                                                getColorByName(line.color)?.hex ||
                                                                '#000000',
                                                            fontWeight: line.bold ? 'bold' : 'normal',
                                                            fontStyle: line.italic
                                                                ? 'italic'
                                                                : 'normal',
                                                            textShadow: glowingText
                                                                ? `0 0 4px ${getColorByName(line.color)?.hex || '#000000'}`
                                                                : 'none',
                                                        }}
                                                    >
                                                        {line.text || '\u00A0'}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Command</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                                            <code className="block break-all font-mono text-xs">
                                                {generateSignCommand()}
                                            </code>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={copyCommand}
                                                className="flex-1"
                                                disabled={copied}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="mr-2 size-4" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="mr-2 size-4" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                            <Button onClick={reset} variant="outline" className="flex-1">
                                                <RotateCcw className="mr-2 size-4" />
                                                Reset
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>How to Use</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                                        <div>
                                            <strong className="text-foreground">
                                                1. Choose hanging sign type
                                            </strong>
                                            <p>Select the wood type for your hanging sign.</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <strong className="text-foreground">
                                                2. Enter text
                                            </strong>
                                            <p>
                                                Type up to 4 lines of text with colors and
                                                formatting.
                                            </p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <strong className="text-foreground">
                                                3. Customize appearance
                                            </strong>
                                            <p>Choose dye color and enable glowing text if desired.</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <strong className="text-foreground">
                                                4. Copy command
                                            </strong>
                                            <p>
                                                Copy and paste the command in Minecraft to get your
                                                hanging sign.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="book" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Book Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Title</label>
                                            <Input
                                                value={bookTitle}
                                                onChange={(e) => setBookTitle(e.target.value)}
                                                placeholder="Book title"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Author</label>
                                            <Input
                                                value={bookAuthor}
                                                onChange={(e) => setBookAuthor(e.target.value)}
                                                placeholder="Author name"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>
                                                Page {currentPage + 1} of {bookPages.length}
                                            </CardTitle>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={addBookPage}
                                                    disabled={bookPages.length >= BOOK_PAGE_LIMIT}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Plus className="mr-2 size-4" />
                                                    Add Page
                                                </Button>
                                                <Button
                                                    onClick={() => removeBookPage(currentPage)}
                                                    disabled={bookPages.length === 1}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium">
                                                    Page Content
                                                </label>
                                                <span className="text-xs text-muted-foreground">
                                                    {bookPages[currentPage]?.text.length || 0}/
                                                    {BOOK_CHAR_PER_PAGE} chars
                                                </span>
                                            </div>
                                            <Textarea
                                                value={bookPages[currentPage]?.text || ''}
                                                onChange={(e) =>
                                                    updateBookPage(currentPage, {
                                                        text: e.target.value.slice(
                                                            0,
                                                            BOOK_CHAR_PER_PAGE,
                                                        ),
                                                    })
                                                }
                                                placeholder="Enter page content..."
                                                maxLength={BOOK_CHAR_PER_PAGE}
                                                className="min-h-48 resize-none font-mono"
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Select
                                                value={bookPages[currentPage]?.color || 'black'}
                                                onValueChange={(value) =>
                                                    updateBookPage(currentPage, { color: value })
                                                }
                                            >
                                                <SelectTrigger className="w-40">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="size-3 rounded border"
                                                            style={{
                                                                backgroundColor: getColorByName(
                                                                    bookPages[currentPage]?.color ||
                                                                        'black',
                                                                )?.hex,
                                                            }}
                                                        />
                                                        <SelectValue />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {minecraftTextColors.map((color) => (
                                                        <SelectItem key={color.id} value={color.id}>
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="size-3 rounded border"
                                                                    style={{
                                                                        backgroundColor: color.hex,
                                                                    }}
                                                                />
                                                                {color.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Toggle
                                                pressed={bookPages[currentPage]?.bold || false}
                                                onPressedChange={(pressed) =>
                                                    updateBookPage(currentPage, { bold: pressed })
                                                }
                                                variant="outline"
                                                aria-label="Toggle bold"
                                            >
                                                <Bold className="size-4" />
                                            </Toggle>
                                            <Toggle
                                                pressed={bookPages[currentPage]?.italic || false}
                                                onPressedChange={(pressed) =>
                                                    updateBookPage(currentPage, { italic: pressed })
                                                }
                                                variant="outline"
                                                aria-label="Toggle italic"
                                            >
                                                <Italic className="size-4" />
                                            </Toggle>
                                        </div>

                                        <div className="flex gap-2">
                                            {bookPages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => setCurrentPage(index)}
                                                    className="min-w-10 rounded-md border-2 px-3 py-1.5 text-sm transition-all hover:bg-muted"
                                                    style={{
                                                        borderColor:
                                                            currentPage === index
                                                                ? 'hsl(var(--primary))'
                                                                : 'transparent',
                                                        backgroundColor:
                                                            currentPage === index
                                                                ? 'hsl(var(--accent))'
                                                                : 'transparent',
                                                    }}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Preview</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className="rounded-lg border p-6"
                                            style={{
                                                backgroundColor: 'oklch(0.87 0.04 85)',
                                            }}
                                        >
                                            <div className="min-h-64 rounded border-2 border-black/30 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-lg dark:from-amber-950 dark:to-yellow-950">
                                                <div className="mb-4 border-b border-black/20 pb-2">
                                                    <div className="font-bold">
                                                        {bookTitle || 'Untitled Book'}
                                                    </div>
                                                    {bookAuthor && (
                                                        <div className="text-xs text-muted-foreground">
                                                            by {bookAuthor}
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    className="whitespace-pre-wrap font-mono text-xs"
                                                    style={{
                                                        color:
                                                            getColorByName(
                                                                bookPages[currentPage]?.color ||
                                                                    'black',
                                                            )?.hex || '#000000',
                                                        fontWeight: bookPages[currentPage]?.bold
                                                            ? 'bold'
                                                            : 'normal',
                                                        fontStyle: bookPages[currentPage]?.italic
                                                            ? 'italic'
                                                            : 'normal',
                                                    }}
                                                >
                                                    {bookPages[currentPage]?.text ||
                                                        'Start typing...'}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Command</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                                            <code className="block break-all font-mono text-xs">
                                                {generateBookCommand()}
                                            </code>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={copyCommand}
                                                className="flex-1"
                                                disabled={copied}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="mr-2 size-4" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="mr-2 size-4" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                            <Button onClick={reset} variant="outline" className="flex-1">
                                                <RotateCcw className="mr-2 size-4" />
                                                Reset
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>How to Use</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                                        <div>
                                            <strong className="text-foreground">
                                                1. Add book details
                                            </strong>
                                            <p>Enter a title and author for your book.</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <strong className="text-foreground">2. Write pages</strong>
                                            <p>
                                                Add up to {BOOK_PAGE_LIMIT} pages with up to{' '}
                                                {BOOK_CHAR_PER_PAGE} characters each.
                                            </p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <strong className="text-foreground">3. Format text</strong>
                                            <p>
                                                Choose colors and formatting (bold, italic) for each
                                                page.
                                            </p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <strong className="text-foreground">
                                                4. Copy command
                                            </strong>
                                            <p>
                                                Copy and paste the command in Minecraft to get your
                                                written book.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </ToolLayout>
        </AppLayout>
    );
}
