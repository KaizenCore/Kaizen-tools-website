import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Slider } from '@/components/ui/slider';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { OutputPanel, ToolLayout } from '@/components/tool-layout';
import {
    bossbarColors,
    bossbarPresets,
    bossbarStyles,
    commandTypes,
    getSubcommands,
    minecraftFormatCodes,
    setSubcommands,
} from '@/data/bossbar-data';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Bossbar Generator',
        href: '/tools/bossbar-generator',
    },
];

export default function BossbarGenerator() {
    const [bossbarId, setBossbarId] = useState('minecraft:custom');
    const [displayName, setDisplayName] = useState('§eBossbar');
    const [color, setColor] = useState('purple');
    const [style, setStyle] = useState('progress');
    const [value, setValue] = useState(100);
    const [max, setMax] = useState(100);
    const [visible, setVisible] = useState(true);
    const [players, setPlayers] = useState('@a');
    const [copied, setCopied] = useState(false);

    const [modifyId, setModifyId] = useState('minecraft:custom');
    const [modifyProperty, setModifyProperty] = useState('color');
    const [modifyValue, setModifyValue] = useState('blue');

    const [queryId, setQueryId] = useState('minecraft:custom');
    const [queryProperty, setQueryProperty] = useState('max');

    const [removeId, setRemoveId] = useState('minecraft:custom');

    const generateCreateCommand = () => {
        let command = `/bossbar add ${bossbarId} ${JSON.stringify(displayName)}`;
        return command;
    };

    const generateSetupCommands = () => {
        const commands: string[] = [generateCreateCommand()];

        commands.push(`/bossbar set ${bossbarId} color ${color}`);
        commands.push(`/bossbar set ${bossbarId} style ${style}`);
        commands.push(`/bossbar set ${bossbarId} max ${max}`);
        commands.push(`/bossbar set ${bossbarId} value ${value}`);
        commands.push(`/bossbar set ${bossbarId} visible ${visible}`);
        commands.push(`/bossbar set ${bossbarId} players ${players}`);

        return commands.join('\n');
    };

    const generateModifyCommand = () => {
        const setCommand = setSubcommands.find((s) => s.id === modifyProperty);
        if (!setCommand) {
            return `/bossbar set ${modifyId} ${modifyProperty} ${modifyValue}`;
        }

        let valueStr = modifyValue;

        if (setCommand.type === 'boolean') {
            valueStr = modifyValue === 'true' ? 'true' : 'false';
        } else if (setCommand.type === 'text') {
            valueStr = JSON.stringify(modifyValue);
        }

        return `/bossbar set ${modifyId} ${modifyProperty} ${valueStr}`;
    };

    const generateQueryCommand = () => {
        return `/bossbar get ${queryId} ${queryProperty}`;
    };

    const generateRemoveCommand = () => {
        return `/bossbar remove ${removeId}`;
    };

    const generateListCommand = () => {
        return '/bossbar list';
    };

    const copyCommand = async (command: string) => {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const reset = () => {
        setBossbarId('minecraft:custom');
        setDisplayName('§eBossbar');
        setColor('purple');
        setStyle('progress');
        setValue(100);
        setMax(100);
        setVisible(true);
        setPlayers('@a');
    };

    const loadPreset = (presetId: string) => {
        const preset = bossbarPresets.find((p) => p.id === presetId);
        if (!preset) {
            return;
        }

        setBossbarId(preset.config.id);
        setDisplayName(preset.config.displayName);
        setColor(preset.config.color);
        setStyle(preset.config.style);
        setValue(preset.config.value);
        setMax(preset.config.max);
        setVisible(preset.config.visible);
        setPlayers(preset.config.players);
    };

    const getColorHex = (colorId: string) => {
        return bossbarColors.find((c) => c.id === colorId)?.hex || '#FFFFFF';
    };

    const getStyleInfo = (styleId: string) => {
        return bossbarStyles.find((s) => s.id === styleId);
    };

    const fillPercentage = max > 0 ? (value / max) * 100 : 0;

    const renderBossbarPreview = () => {
        const styleInfo = getStyleInfo(style);
        const colorHex = getColorHex(color);

        return (
            <div className="space-y-3">
                <div className="text-center font-bold text-white drop-shadow-md">
                    <div
                        className="inline-block rounded bg-black/40 px-3 py-1.5"
                        dangerouslySetInnerHTML={{
                            __html: displayName.replace(/§([0-9a-fklmnor])/g, (match, code) => {
                                const formatCode = minecraftFormatCodes.find(
                                    (f) => f.code === `§${code}`,
                                );
                                if (!formatCode) {
                                    return '';
                                }
                                if (formatCode.type === 'color') {
                                    return `<span style="color: ${formatCode.hex}">`;
                                }
                                if (formatCode.code === '§l') {
                                    return '<strong>';
                                }
                                if (formatCode.code === '§o') {
                                    return '<em>';
                                }
                                if (formatCode.code === '§n') {
                                    return '<u>';
                                }
                                if (formatCode.code === '§m') {
                                    return '<s>';
                                }
                                if (formatCode.code === '§r') {
                                    return '</span>';
                                }
                                return '';
                            }).replace(/§[0-9a-fklmnor]/g, ''),
                        }}
                    />
                </div>

                <div className="relative h-4 overflow-hidden rounded-sm border-2 border-black/60 bg-black/30">
                    <div
                        className="h-full transition-all duration-300"
                        style={{
                            width: `${fillPercentage}%`,
                            backgroundColor: colorHex,
                        }}
                    />

                    {styleInfo && styleInfo.notches > 0 && (
                        <div className="pointer-events-none absolute inset-0 flex">
                            {Array.from({ length: styleInfo.notches - 1 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 border-r-2 border-black/60"
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                        Value: {value} / {max}
                    </span>
                    <span>{fillPercentage.toFixed(0)}%</span>
                </div>
            </div>
        );
    };

    const sidebar = (
        <>
            <OutputPanel
                title="Generated Command"
                actions={
                    <div className="flex gap-2">
                        <Button onClick={copyCommand} variant="ghost" size="sm" disabled={copied}>
                            {copied ? (
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
                        <Button onClick={reset} variant="ghost" size="sm">
                            <RotateCcw className="mr-1 size-3" />
                            Reset
                        </Button>
                    </div>
                }
            >
                <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                    <code className="block break-all font-mono text-xs">
                        {generateCommand()}
                    </code>
                </div>
            </OutputPanel>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Presets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {bossbarPresets.map((preset, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => loadPreset(preset)}
                            className="flex w-full flex-col gap-1 rounded-lg border p-3 text-left transition-colors hover:bg-muted"
                        >
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-sm text-muted-foreground">
                                {preset.description}
                            </div>
                        </button>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div>
                        <strong className="text-foreground">1. Create bossbar</strong>
                        <p>Start by creating a bossbar with a unique ID</p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">2. Configure</strong>
                        <p>Use the Set tab to customize name, color, style, and properties</p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">3. Control</strong>
                        <p>Use Get/Remove tabs to query or delete bossbars</p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">4. Copy & use</strong>
                        <p>Copy the generated command and run it in your server</p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bossbar Generator" />
            <ToolLayout
                title="Minecraft Bossbar Generator"
                description="Create and customize bossbars for your Minecraft server"
                sidebar={sidebar}
            >
                        <Tabs defaultValue="create" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="create">Create</TabsTrigger>
                                <TabsTrigger value="modify">Modify</TabsTrigger>
                                <TabsTrigger value="query">Query</TabsTrigger>
                                <TabsTrigger value="remove">Remove</TabsTrigger>
                            </TabsList>

                            <TabsContent value="create" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Bossbar Configuration</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="bossbar-id">Bossbar ID</Label>
                                            <Input
                                                id="bossbar-id"
                                                value={bossbarId}
                                                onChange={(e) => setBossbarId(e.target.value)}
                                                placeholder="minecraft:custom"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Format: namespace:id (e.g., minecraft:boss)
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="display-name">Display Name</Label>
                                            <Input
                                                id="display-name"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                placeholder="§eMy Bossbar"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Use § for color codes (e.g., §e for yellow)
                                            </p>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="color">Color</Label>
                                                <Select value={color} onValueChange={setColor}>
                                                    <SelectTrigger id="color">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {bossbarColors.map((c) => (
                                                            <SelectItem key={c.id} value={c.id}>
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className="size-4 rounded border"
                                                                        style={{
                                                                            backgroundColor: c.hex,
                                                                        }}
                                                                    />
                                                                    {c.name}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="style">Style</Label>
                                                <Select value={style} onValueChange={setStyle}>
                                                    <SelectTrigger id="style">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {bossbarStyles.map((s) => (
                                                            <SelectItem key={s.id} value={s.id}>
                                                                {s.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="value-slider">
                                                    Current Value: {value}
                                                </Label>
                                            </div>
                                            <Slider
                                                id="value-slider"
                                                value={[value]}
                                                onValueChange={(v) => setValue(v[0])}
                                                max={max}
                                                min={0}
                                                step={1}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="max-value">Maximum Value</Label>
                                            <Input
                                                id="max-value"
                                                type="number"
                                                value={max}
                                                onChange={(e) => {
                                                    const newMax = Number.parseInt(
                                                        e.target.value,
                                                        10,
                                                    );
                                                    setMax(newMax);
                                                    if (value > newMax) {
                                                        setValue(newMax);
                                                    }
                                                }}
                                                min={1}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="players">Players</Label>
                                            <Input
                                                id="players"
                                                value={players}
                                                onChange={(e) => setPlayers(e.target.value)}
                                                placeholder="@a"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Use @a (all), @p (nearest), or specific players
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="visible"
                                                checked={visible}
                                                onCheckedChange={(checked) =>
                                                    setVisible(checked === true)
                                                }
                                            />
                                            <Label htmlFor="visible" className="cursor-pointer">
                                                Visible
                                            </Label>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Presets</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {bossbarPresets.map((preset) => (
                                                <button
                                                    key={preset.id}
                                                    type="button"
                                                    onClick={() => loadPreset(preset.id)}
                                                    className="rounded-lg border bg-card p-3 text-left transition-colors hover:bg-muted"
                                                >
                                                    <div className="font-medium">
                                                        {preset.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {preset.description}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Commands</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                                            <code className="block whitespace-pre-wrap break-all font-mono text-xs">
                                                {generateSetupCommands()}
                                            </code>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() =>
                                                    copyCommand(generateSetupCommands())
                                                }
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
                                            <Button
                                                onClick={reset}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                <RotateCcw className="mr-2 size-4" />
                                                Reset
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="modify" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Modify Bossbar Property</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="modify-id">Bossbar ID</Label>
                                            <Input
                                                id="modify-id"
                                                value={modifyId}
                                                onChange={(e) => setModifyId(e.target.value)}
                                                placeholder="minecraft:custom"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="modify-property">Property</Label>
                                            <Select
                                                value={modifyProperty}
                                                onValueChange={(value) => {
                                                    setModifyProperty(value);
                                                    const subcommand = setSubcommands.find(
                                                        (s) => s.id === value,
                                                    );
                                                    if (subcommand?.type === 'color') {
                                                        setModifyValue('blue');
                                                    } else if (subcommand?.type === 'style') {
                                                        setModifyValue('progress');
                                                    } else if (subcommand?.type === 'number') {
                                                        setModifyValue('100');
                                                    } else if (subcommand?.type === 'boolean') {
                                                        setModifyValue('true');
                                                    } else if (subcommand?.type === 'players') {
                                                        setModifyValue('@a');
                                                    } else {
                                                        setModifyValue('');
                                                    }
                                                }}
                                            >
                                                <SelectTrigger id="modify-property">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {setSubcommands.map((s) => (
                                                        <SelectItem key={s.id} value={s.id}>
                                                            {s.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="modify-value">New Value</Label>
                                            {setSubcommands.find((s) => s.id === modifyProperty)
                                                ?.type === 'color' ? (
                                                <Select
                                                    value={modifyValue}
                                                    onValueChange={setModifyValue}
                                                >
                                                    <SelectTrigger id="modify-value">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {bossbarColors.map((c) => (
                                                            <SelectItem key={c.id} value={c.id}>
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className="size-4 rounded border"
                                                                        style={{
                                                                            backgroundColor:
                                                                                c.hex,
                                                                        }}
                                                                    />
                                                                    {c.name}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : setSubcommands.find(
                                                  (s) => s.id === modifyProperty,
                                              )?.type === 'style' ? (
                                                <Select
                                                    value={modifyValue}
                                                    onValueChange={setModifyValue}
                                                >
                                                    <SelectTrigger id="modify-value">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {bossbarStyles.map((s) => (
                                                            <SelectItem key={s.id} value={s.id}>
                                                                {s.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : setSubcommands.find(
                                                  (s) => s.id === modifyProperty,
                                              )?.type === 'boolean' ? (
                                                <Select
                                                    value={modifyValue}
                                                    onValueChange={setModifyValue}
                                                >
                                                    <SelectTrigger id="modify-value">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="true">True</SelectItem>
                                                        <SelectItem value="false">
                                                            False
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : setSubcommands.find(
                                                  (s) => s.id === modifyProperty,
                                              )?.type === 'number' ? (
                                                <Input
                                                    id="modify-value"
                                                    type="number"
                                                    value={modifyValue}
                                                    onChange={(e) =>
                                                        setModifyValue(e.target.value)
                                                    }
                                                />
                                            ) : (
                                                <Input
                                                    id="modify-value"
                                                    value={modifyValue}
                                                    onChange={(e) =>
                                                        setModifyValue(e.target.value)
                                                    }
                                                />
                                            )}
                                        </div>

                                        <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                                            <code className="block break-all font-mono text-xs">
                                                {generateModifyCommand()}
                                            </code>
                                        </div>

                                        <Button
                                            onClick={() => copyCommand(generateModifyCommand())}
                                            className="w-full"
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
                                                    Copy Command
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="query" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Query Bossbar Property</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="query-id">Bossbar ID</Label>
                                            <Input
                                                id="query-id"
                                                value={queryId}
                                                onChange={(e) => setQueryId(e.target.value)}
                                                placeholder="minecraft:custom"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="query-property">Property</Label>
                                            <Select
                                                value={queryProperty}
                                                onValueChange={setQueryProperty}
                                            >
                                                <SelectTrigger id="query-property">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getSubcommands.map((s) => (
                                                        <SelectItem key={s.id} value={s.id}>
                                                            {s.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                                            <code className="block break-all font-mono text-xs">
                                                {generateQueryCommand()}
                                            </code>
                                        </div>

                                        <Button
                                            onClick={() => copyCommand(generateQueryCommand())}
                                            className="w-full"
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
                                                    Copy Command
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="remove" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Remove or List Bossbars</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="remove-id">
                                                Bossbar ID (for removal)
                                            </Label>
                                            <Input
                                                id="remove-id"
                                                value={removeId}
                                                onChange={(e) => setRemoveId(e.target.value)}
                                                placeholder="minecraft:custom"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                                                <code className="block break-all font-mono text-xs">
                                                    {generateRemoveCommand()}
                                                </code>
                                            </div>

                                            <Button
                                                onClick={() =>
                                                    copyCommand(generateRemoveCommand())
                                                }
                                                className="w-full"
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
                                                        Copy Remove Command
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <Label>List All Bossbars</Label>
                                            <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                                                <code className="block break-all font-mono text-xs">
                                                    {generateListCommand()}
                                                </code>
                                            </div>

                                            <Button
                                                onClick={() => copyCommand(generateListCommand())}
                                                className="w-full"
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
                                                        Copy List Command
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
            </ToolLayout>
        </AppLayout>
    );
}
