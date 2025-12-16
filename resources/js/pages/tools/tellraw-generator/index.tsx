import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { OutputPanel, ToolLayout } from '@/components/tool-layout';
import {
    clickEvents,
    commandTypes,
    hoverEvents,
    keybinds,
    minecraftColors,
    selectors,
    textFormatting,
} from '@/data/tellraw-data';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Bold,
    Check,
    Copy,
    Eye,
    Italic,
    Plus,
    RotateCcw,
    Strikethrough,
    Trash2,
    Underline,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Tellraw Generator',
        href: '/tellraw-generator',
    },
];

interface TextComponent {
    id: string;
    type: 'text' | 'selector' | 'score' | 'keybind';
    text?: string;
    selector?: string;
    keybind?: string;
    score?: {
        name: string;
        objective: string;
    };
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;
    clickEvent?: {
        action: string;
        value: string;
    };
    hoverEvent?: {
        action: string;
        value: string;
    };
}

const formatIconMap = {
    bold: Bold,
    italic: Italic,
    underlined: Underline,
    strikethrough: Strikethrough,
    obfuscated: Eye,
};

export default function TellrawGenerator() {
    const [commandType, setCommandType] = useState('tellraw');
    const [targetSelector, setTargetSelector] = useState('@a');
    const [components, setComponents] = useState<TextComponent[]>([
        {
            id: crypto.randomUUID(),
            type: 'text',
            text: 'Hello, World!',
            color: 'white',
        },
    ]);
    const [copiedJson, setCopiedJson] = useState(false);
    const [copiedCommand, setCopiedCommand] = useState(false);

    const addComponent = (type: 'text' | 'selector' | 'score' | 'keybind') => {
        const newComponent: TextComponent = {
            id: crypto.randomUUID(),
            type,
            color: 'white',
        };

        if (type === 'text') {
            newComponent.text = '';
        } else if (type === 'selector') {
            newComponent.selector = '@p';
        } else if (type === 'keybind') {
            newComponent.keybind = 'key.jump';
        } else if (type === 'score') {
            newComponent.score = { name: '@p', objective: 'objective' };
        }

        setComponents([...components, newComponent]);
    };

    const removeComponent = (id: string) => {
        setComponents(components.filter((c) => c.id !== id));
    };

    const updateComponent = (id: string, updates: Partial<TextComponent>) => {
        setComponents(
            components.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        );
    };

    const toggleFormatting = (id: string, format: string) => {
        const component = components.find((c) => c.id === id);
        if (!component) {
            return;
        }

        updateComponent(id, {
            [format]: !component[format as keyof TextComponent],
        });
    };

    const generateJSON = () => {
        return components.map((component) => {
            const json: Record<string, unknown> = {};

            if (component.type === 'text' && component.text !== undefined) {
                json.text = component.text;
            } else if (
                component.type === 'selector' &&
                component.selector !== undefined
            ) {
                json.selector = component.selector;
            } else if (
                component.type === 'keybind' &&
                component.keybind !== undefined
            ) {
                json.keybind = component.keybind;
            } else if (component.type === 'score' && component.score) {
                json.score = component.score;
            }

            if (component.color) {
                json.color = component.color;
            }

            if (component.bold) {
                json.bold = true;
            }
            if (component.italic) {
                json.italic = true;
            }
            if (component.underlined) {
                json.underlined = true;
            }
            if (component.strikethrough) {
                json.strikethrough = true;
            }
            if (component.obfuscated) {
                json.obfuscated = true;
            }

            if (component.clickEvent) {
                json.clickEvent = component.clickEvent;
            }

            if (component.hoverEvent) {
                if (component.hoverEvent.action === 'show_text') {
                    json.hoverEvent = {
                        action: 'show_text',
                        contents: component.hoverEvent.value,
                    };
                } else {
                    json.hoverEvent = {
                        action: component.hoverEvent.action,
                        contents: component.hoverEvent.value,
                    };
                }
            }

            return json;
        });
    };

    const generateCommand = () => {
        const jsonArray = generateJSON();
        const jsonString = JSON.stringify(jsonArray);

        if (commandType === 'tellraw') {
            return `/tellraw ${targetSelector} ${jsonString}`;
        } else if (commandType === 'title') {
            return `/title ${targetSelector} title ${jsonString}`;
        } else if (commandType === 'subtitle') {
            return `/title ${targetSelector} subtitle ${jsonString}`;
        } else if (commandType === 'actionbar') {
            return `/title ${targetSelector} actionbar ${jsonString}`;
        }

        return '';
    };

    const copyJSON = async () => {
        const json = JSON.stringify(generateJSON(), null, 2);
        await navigator.clipboard.writeText(json);
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
    };

    const copyCommand = async () => {
        const command = generateCommand();
        await navigator.clipboard.writeText(command);
        setCopiedCommand(true);
        setTimeout(() => setCopiedCommand(false), 2000);
    };

    const reset = () => {
        setCommandType('tellraw');
        setTargetSelector('@a');
        setComponents([
            {
                id: crypto.randomUUID(),
                type: 'text',
                text: 'Hello, World!',
                color: 'white',
            },
        ]);
    };

    const getPreviewStyle = (component: TextComponent) => {
        const color = minecraftColors.find((c) => c.code === component.color);
        const style: React.CSSProperties = {
            color: color?.hex || '#FFFFFF',
            fontWeight: component.bold ? 'bold' : 'normal',
            fontStyle: component.italic ? 'italic' : 'normal',
            textDecoration: component.underlined
                ? 'underline'
                : component.strikethrough
                  ? 'line-through'
                  : 'none',
        };

        return style;
    };

    const getPreviewText = (component: TextComponent) => {
        if (component.type === 'text') {
            return component.text || '';
        } else if (component.type === 'selector') {
            return component.selector || '@p';
        } else if (component.type === 'keybind') {
            const keybind = keybinds.find((k) => k.id === component.keybind);
            return `[${keybind?.name || 'Key'}]`;
        } else if (component.type === 'score') {
            return `[${component.score?.name || '@p'}:${component.score?.objective || 'objective'}]`;
        }

        return '';
    };

    const sidebar = (
        <>
            {/* Preview Panel */}
            <OutputPanel title="Preview">
                <div className="min-h-[80px] rounded-lg border bg-[#313131] p-4 font-mono text-base">
                    {components.map((component) => (
                        <span
                            key={component.id}
                            style={getPreviewStyle(component)}
                        >
                            {getPreviewText(component)}
                        </span>
                    ))}
                </div>
            </OutputPanel>

            {/* JSON Output Panel */}
            <OutputPanel
                title="JSON Output"
                actions={
                    <Button
                        onClick={copyJSON}
                        variant="ghost"
                        size="sm"
                        disabled={copiedJson}
                    >
                        {copiedJson ? (
                            <>
                                <Check className="mr-1 size-3" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="mr-1 size-3" />
                                Copy
                            </>
                        )}
                    </Button>
                }
            >
                <div className="max-h-64 overflow-auto rounded-lg border bg-muted/50 p-3">
                    <pre className="text-xs">
                        {JSON.stringify(
                            generateJSON(),
                            null,
                            2,
                        )}
                    </pre>
                </div>
            </OutputPanel>

            {/* Full Command Panel */}
            <OutputPanel
                title="Full Command"
                actions={
                    <Button
                        onClick={copyCommand}
                        variant="ghost"
                        size="sm"
                        disabled={copiedCommand}
                    >
                        {copiedCommand ? (
                            <>
                                <Check className="mr-1 size-3" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="mr-1 size-3" />
                                Copy
                            </>
                        )}
                    </Button>
                }
            >
                <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                    <code className="block font-mono text-xs break-all">
                        {generateCommand()}
                    </code>
                </div>
                <Button
                    onClick={reset}
                    variant="outline"
                    className="w-full"
                >
                    <RotateCcw className="mr-2 size-4" />
                    Reset
                </Button>
            </OutputPanel>

            {/* Quick Reference Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Reference</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div>
                        <strong className="text-foreground">
                            Text Components
                        </strong>
                        <p>
                            Add multiple text segments with
                            different colors and formatting.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            Special Components
                        </strong>
                        <p>
                            Selector: Shows player names. Score:
                            Shows scoreboard values. Keybind: Shows
                            key bindings.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            Click Events
                        </strong>
                        <p>
                            Make text interactive by adding click
                            actions like opening URLs or running
                            commands.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            Hover Events
                        </strong>
                        <p>
                            Show additional information when players
                            hover over text.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tellraw Generator" />
            <ToolLayout
                title="Minecraft Tellraw Generator"
                description="Create custom JSON text for tellraw, title, subtitle, and actionbar commands"
                sidebar={sidebar}
            >
                        <Card>
                            <CardHeader>
                                <CardTitle>Command Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="command-type">
                                            Command Type
                                        </Label>
                                        <Select
                                            value={commandType}
                                            onValueChange={setCommandType}
                                        >
                                            <SelectTrigger id="command-type">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {commandTypes.map((cmd) => (
                                                    <SelectItem
                                                        key={cmd.id}
                                                        value={cmd.id}
                                                    >
                                                        {cmd.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target-selector">
                                            Target Selector
                                        </Label>
                                        <Input
                                            id="target-selector"
                                            value={targetSelector}
                                            onChange={(e) =>
                                                setTargetSelector(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="@a"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Text Components</CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => addComponent('text')}
                                        >
                                            <Plus className="size-4" />
                                            Text
                                        </Button>
                                        <Select
                                            onValueChange={(value) =>
                                                addComponent(
                                                    value as
                                                        | 'selector'
                                                        | 'score'
                                                        | 'keybind',
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Special" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="selector">
                                                    Selector
                                                </SelectItem>
                                                <SelectItem value="score">
                                                    Score
                                                </SelectItem>
                                                <SelectItem value="keybind">
                                                    Keybind
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {components.map((component) => (
                                    <div
                                        key={component.id}
                                        className="rounded-lg border bg-card p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-sm font-medium capitalize">
                                                {component.type}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    removeComponent(
                                                        component.id,
                                                    )
                                                }
                                                disabled={
                                                    components.length === 1
                                                }
                                            >
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {component.type === 'text' && (
                                                <div className="space-y-2">
                                                    <Label>Text</Label>
                                                    <Input
                                                        value={
                                                            component.text || ''
                                                        }
                                                        onChange={(e) =>
                                                            updateComponent(
                                                                component.id,
                                                                {
                                                                    text: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            )
                                                        }
                                                        placeholder="Enter text..."
                                                    />
                                                </div>
                                            )}

                                            {component.type === 'selector' && (
                                                <div className="space-y-2">
                                                    <Label>Selector</Label>
                                                    <Select
                                                        value={
                                                            component.selector ||
                                                            '@p'
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            updateComponent(
                                                                component.id,
                                                                {
                                                                    selector:
                                                                        value,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {selectors.map(
                                                                (sel) => (
                                                                    <SelectItem
                                                                        key={
                                                                            sel.id
                                                                        }
                                                                        value={
                                                                            sel.id
                                                                        }
                                                                    >
                                                                        {sel.id}{' '}
                                                                        -{' '}
                                                                        {
                                                                            sel.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            {component.type === 'keybind' && (
                                                <div className="space-y-2">
                                                    <Label>Keybind</Label>
                                                    <Select
                                                        value={
                                                            component.keybind ||
                                                            'key.jump'
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            updateComponent(
                                                                component.id,
                                                                {
                                                                    keybind:
                                                                        value,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {keybinds.map(
                                                                (key) => (
                                                                    <SelectItem
                                                                        key={
                                                                            key.id
                                                                        }
                                                                        value={
                                                                            key.id
                                                                        }
                                                                    >
                                                                        {
                                                                            key.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            {component.type === 'score' && (
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label>Player</Label>
                                                        <Input
                                                            value={
                                                                component.score
                                                                    ?.name || ''
                                                            }
                                                            onChange={(e) =>
                                                                updateComponent(
                                                                    component.id,
                                                                    {
                                                                        score: {
                                                                            name: e
                                                                                .target
                                                                                .value,
                                                                            objective:
                                                                                component
                                                                                    .score
                                                                                    ?.objective ||
                                                                                '',
                                                                        },
                                                                    },
                                                                )
                                                            }
                                                            placeholder="@p"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Objective</Label>
                                                        <Input
                                                            value={
                                                                component.score
                                                                    ?.objective ||
                                                                ''
                                                            }
                                                            onChange={(e) =>
                                                                updateComponent(
                                                                    component.id,
                                                                    {
                                                                        score: {
                                                                            name:
                                                                                component
                                                                                    .score
                                                                                    ?.name ||
                                                                                '',
                                                                            objective:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    },
                                                                )
                                                            }
                                                            placeholder="objective"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Label>Color</Label>
                                                <div className="grid grid-cols-8 gap-2">
                                                    {minecraftColors.map(
                                                        (color) => (
                                                            <button
                                                                key={color.code}
                                                                type="button"
                                                                onClick={() =>
                                                                    updateComponent(
                                                                        component.id,
                                                                        {
                                                                            color: color.code,
                                                                        },
                                                                    )
                                                                }
                                                                className="aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105"
                                                                style={{
                                                                    backgroundColor:
                                                                        color.hex,
                                                                    borderColor:
                                                                        component.color ===
                                                                        color.code
                                                                            ? 'hsl(var(--primary))'
                                                                            : 'transparent',
                                                                }}
                                                                title={
                                                                    color.name
                                                                }
                                                            >
                                                                {component.color ===
                                                                    color.code && (
                                                                    <div className="flex size-full items-center justify-center bg-black/20">
                                                                        <Check className="size-3 text-white drop-shadow" />
                                                                    </div>
                                                                )}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Formatting</Label>
                                                <div className="flex gap-1">
                                                    {textFormatting.map(
                                                        (format) => {
                                                            const Icon =
                                                                formatIconMap[
                                                                    format.id as keyof typeof formatIconMap
                                                                ];
                                                            return (
                                                                <Toggle
                                                                    key={
                                                                        format.id
                                                                    }
                                                                    pressed={
                                                                        component[
                                                                            format.id as keyof TextComponent
                                                                        ] as boolean
                                                                    }
                                                                    onPressedChange={() =>
                                                                        toggleFormatting(
                                                                            component.id,
                                                                            format.id,
                                                                        )
                                                                    }
                                                                    variant="outline"
                                                                    size="sm"
                                                                    title={
                                                                        format.name
                                                                    }
                                                                >
                                                                    <Icon className="size-4" />
                                                                </Toggle>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Click Event</Label>
                                                <div className="grid gap-2">
                                                    <Select
                                                        value={
                                                            component.clickEvent
                                                                ?.action ||
                                                            'none'
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) => {
                                                            if (
                                                                value === 'none'
                                                            ) {
                                                                const updated =
                                                                    {
                                                                        ...component,
                                                                    };
                                                                delete updated.clickEvent;
                                                                updateComponent(
                                                                    component.id,
                                                                    updated,
                                                                );
                                                            } else {
                                                                updateComponent(
                                                                    component.id,
                                                                    {
                                                                        clickEvent:
                                                                            {
                                                                                action: value,
                                                                                value: '',
                                                                            },
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="None" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">
                                                                None
                                                            </SelectItem>
                                                            {clickEvents.map(
                                                                (event) => (
                                                                    <SelectItem
                                                                        key={
                                                                            event.id
                                                                        }
                                                                        value={
                                                                            event.id
                                                                        }
                                                                    >
                                                                        {
                                                                            event.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    {component.clickEvent && (
                                                        <Input
                                                            value={
                                                                component
                                                                    .clickEvent
                                                                    .value || ''
                                                            }
                                                            onChange={(e) =>
                                                                updateComponent(
                                                                    component.id,
                                                                    {
                                                                        clickEvent:
                                                                            {
                                                                                action:
                                                                                    component
                                                                                        .clickEvent
                                                                                        ?.action ||
                                                                                    '',
                                                                                value: e
                                                                                    .target
                                                                                    .value,
                                                                            },
                                                                    },
                                                                )
                                                            }
                                                            placeholder={
                                                                clickEvents.find(
                                                                    (e) =>
                                                                        e.id ===
                                                                        component
                                                                            .clickEvent
                                                                            ?.action,
                                                                )
                                                                    ?.placeholder ||
                                                                ''
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Hover Event</Label>
                                                <div className="grid gap-2">
                                                    <Select
                                                        value={
                                                            component.hoverEvent
                                                                ?.action ||
                                                            'none'
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) => {
                                                            if (
                                                                value === 'none'
                                                            ) {
                                                                const updated =
                                                                    {
                                                                        ...component,
                                                                    };
                                                                delete updated.hoverEvent;
                                                                updateComponent(
                                                                    component.id,
                                                                    updated,
                                                                );
                                                            } else {
                                                                updateComponent(
                                                                    component.id,
                                                                    {
                                                                        hoverEvent:
                                                                            {
                                                                                action: value,
                                                                                value: '',
                                                                            },
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="None" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">
                                                                None
                                                            </SelectItem>
                                                            {hoverEvents.map(
                                                                (event) => (
                                                                    <SelectItem
                                                                        key={
                                                                            event.id
                                                                        }
                                                                        value={
                                                                            event.id
                                                                        }
                                                                    >
                                                                        {
                                                                            event.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    {component.hoverEvent && (
                                                        <Input
                                                            value={
                                                                component
                                                                    .hoverEvent
                                                                    .value || ''
                                                            }
                                                            onChange={(e) =>
                                                                updateComponent(
                                                                    component.id,
                                                                    {
                                                                        hoverEvent:
                                                                            {
                                                                                action:
                                                                                    component
                                                                                        .hoverEvent
                                                                                        ?.action ||
                                                                                    '',
                                                                                value: e
                                                                                    .target
                                                                                    .value,
                                                                            },
                                                                    },
                                                                )
                                                            }
                                                            placeholder={
                                                                component
                                                                    .hoverEvent
                                                                    .action ===
                                                                'show_text'
                                                                    ? 'Hover text...'
                                                                    : component
                                                                            .hoverEvent
                                                                            .action ===
                                                                        'show_item'
                                                                      ? '{"id":"minecraft:diamond"}'
                                                                      : '{"type":"minecraft:pig"}'
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
            </ToolLayout>
        </AppLayout>
    );
}
