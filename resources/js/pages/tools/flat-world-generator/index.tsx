import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ArrowUp,
    ArrowDown,
    CheckCircle2,
    Copy,
    Layers,
    Plus,
    Trash2,
    Info,
} from 'lucide-react';
import { useState } from 'react';
import {
    biomes,
    blockCategories,
    minecraftBlocks,
    presets,
    structures,
    type MinecraftBlock,
    type WorldLayer,
} from '@/data/flat-world-blocks';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Flat World Generator',
        href: '/tools/flat-world-generator',
    },
];

export default function FlatWorldGenerator() {
    const [layers, setLayers] = useState<WorldLayer[]>([
        { block: 'minecraft:bedrock', height: 1 },
        { block: 'minecraft:dirt', height: 2 },
        { block: 'minecraft:grass_block', height: 1 },
    ]);
    const [biome, setBiome] = useState<string>('minecraft:plains');
    const [selectedStructures, setSelectedStructures] = useState<string[]>(['village']);
    const [copiedMessage, setCopiedMessage] = useState<string>('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const getBlockById = (id: string): MinecraftBlock | undefined => {
        return minecraftBlocks.find((block) => block.id === id);
    };

    const addLayer = () => {
        setLayers([...layers, { block: 'minecraft:stone', height: 1 }]);
    };

    const removeLayer = (index: number) => {
        if (layers.length > 1) {
            setLayers(layers.filter((_, i) => i !== index));
        }
    };

    const updateLayer = (index: number, field: keyof WorldLayer, value: string | number) => {
        const newLayers = [...layers];
        if (field === 'height') {
            const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
            if (!isNaN(numValue) && numValue >= 1 && numValue <= 255) {
                newLayers[index][field] = numValue;
            }
        } else {
            newLayers[index][field] = value as string;
        }
        setLayers(newLayers);
    };

    const moveLayer = (index: number, direction: 'up' | 'down') => {
        const newLayers = [...layers];
        const swapIndex = direction === 'up' ? index + 1 : index - 1;
        if (swapIndex >= 0 && swapIndex < layers.length) {
            [newLayers[index], newLayers[swapIndex]] = [newLayers[swapIndex], newLayers[index]];
            setLayers(newLayers);
        }
    };

    const loadPreset = (presetId: string) => {
        const preset = presets.find((p) => p.id === presetId);
        if (preset) {
            setLayers(preset.layers);
            setBiome(preset.biome);
            setSelectedStructures(preset.structures);
        }
    };

    const toggleStructure = (structureId: string) => {
        setSelectedStructures((prev) => {
            if (prev.includes(structureId)) {
                return prev.filter((s) => s !== structureId);
            }

            return [...prev, structureId];
        });
    };

    const generatePresetString = (): string => {
        const layerString = layers
            .map((layer) => {
                const count = layer.height > 1 ? `${layer.height}*` : '';
                return `${count}${layer.block}`;
            })
            .join(',');

        const structureString = selectedStructures.length > 0 ? selectedStructures.join(',') : '';

        return `${layerString};${biome}${structureString ? `;${structureString}` : ''}`;
    };

    const generateCommand = (): string => {
        const preset = generatePresetString();
        return `/give @s minecraft:grass_block{display:{Name:'{"text":"Flat World Preset"}',Lore:['{"text":"${preset}"}']}}`;
    };

    const copyToClipboard = (text: string, message: string) => {
        navigator.clipboard.writeText(text);
        setCopiedMessage(message);
        setTimeout(() => {
            setCopiedMessage('');
        }, 2000);
    };

    const getTotalHeight = (): number => {
        return layers.reduce((sum, layer) => sum + layer.height, 0);
    };

    const getFilteredBlocks = (): MinecraftBlock[] => {
        if (filterCategory === 'all') {
            return minecraftBlocks;
        }
        return minecraftBlocks.filter((block) => block.category === filterCategory);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Flat World Generator" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Flat World Generator</h1>
                    <p className="text-muted-foreground">
                        Create custom superflat world presets for Minecraft Java Edition
                    </p>
                </div>

                {copiedMessage && (
                    <div className="flex items-center gap-2 rounded-lg border border-[oklch(0.72_0.14_75)]/20 bg-[oklch(0.72_0.14_75)]/10 p-3 text-sm text-[oklch(0.50_0.14_75)] dark:border-[oklch(0.75_0.15_75)]/30 dark:text-[oklch(0.75_0.15_75)]">
                        <CheckCircle2 className="size-4" />
                        {copiedMessage}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preset Templates</CardTitle>
                                <CardDescription>
                                    Load a pre-configured flat world preset
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <Select onValueChange={loadPreset}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a preset..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {presets.map((preset) => (
                                            <SelectItem key={preset.id} value={preset.id}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{preset.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {preset.description}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Layers className="size-5" />
                                    World Layers ({getTotalHeight()} blocks)
                                </CardTitle>
                                <CardDescription>
                                    Layers are ordered from bottom (bedrock) to top (surface)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="filter-category">Filter:</Label>
                                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                                        <SelectTrigger id="filter-category" className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Blocks</SelectItem>
                                            {blockCategories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {layers.map((layer, index) => {
                                        const block = getBlockById(layer.block);
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 rounded-lg border p-3"
                                            >
                                                <div
                                                    className="size-6 shrink-0 rounded border"
                                                    style={{
                                                        backgroundColor: block?.color || 'oklch(0.5 0 0)',
                                                    }}
                                                />
                                                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                                                    <Select
                                                        value={layer.block}
                                                        onValueChange={(value) => {
                                                            updateLayer(index, 'block', value);
                                                        }}
                                                    >
                                                        <SelectTrigger className="flex-1">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {getFilteredBlocks().map((block) => (
                                                                <SelectItem
                                                                    key={block.id}
                                                                    value={block.id}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="size-4 rounded border"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    block.color,
                                                                            }}
                                                                        />
                                                                        {block.name}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            max="255"
                                                            value={layer.height}
                                                            onChange={(e) => {
                                                                updateLayer(
                                                                    index,
                                                                    'height',
                                                                    e.target.value,
                                                                );
                                                            }}
                                                            className="w-20"
                                                        />
                                                        <span className="text-sm text-muted-foreground">
                                                            blocks
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            moveLayer(index, 'up');
                                                        }}
                                                        disabled={index === layers.length - 1}
                                                        className="size-8"
                                                    >
                                                        <ArrowUp className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            moveLayer(index, 'down');
                                                        }}
                                                        disabled={index === 0}
                                                        className="size-8"
                                                    >
                                                        <ArrowDown className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            removeLayer(index);
                                                        }}
                                                        disabled={layers.length === 1}
                                                        className="size-8"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Button onClick={addLayer} variant="outline" className="w-full">
                                    <Plus className="size-4" />
                                    Add Layer
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Biome</CardTitle>
                                <CardDescription>
                                    Select the biome for your flat world
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Select value={biome} onValueChange={setBiome}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {biomes.map((b) => (
                                            <SelectItem key={b.id} value={b.id}>
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Structures</CardTitle>
                                <CardDescription>
                                    Enable or disable structure generation
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {structures.map((structure) => (
                                    <div
                                        key={structure.id}
                                        className="flex items-start gap-3 rounded-lg border p-3"
                                    >
                                        <Checkbox
                                            id={structure.id}
                                            checked={selectedStructures.includes(structure.id)}
                                            onCheckedChange={() => {
                                                toggleStructure(structure.id);
                                            }}
                                            className="mt-1"
                                        />
                                        <div className="flex flex-1 flex-col gap-1">
                                            <Label
                                                htmlFor={structure.id}
                                                className="cursor-pointer font-medium"
                                            >
                                                {structure.name}
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                {structure.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card className="bg-[oklch(0.92_0.03_85)] dark:bg-[oklch(0.28_0.02_85)]">
                            <CardHeader>
                                <CardTitle>Layer Preview</CardTitle>
                                <CardDescription>
                                    Visual representation of your world layers
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-0.5 overflow-hidden rounded-lg border">
                                    {[...layers].reverse().map((layer, index) => {
                                        const block = getBlockById(layer.block);
                                        const heightPercentage = (layer.height / getTotalHeight()) * 100;
                                        const minHeight = 24;
                                        const displayHeight = Math.max(
                                            minHeight,
                                            (heightPercentage / 100) * 300,
                                        );

                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 px-3"
                                                style={{
                                                    backgroundColor: block?.color || 'oklch(0.5 0 0)',
                                                    height: `${displayHeight}px`,
                                                    minHeight: `${minHeight}px`,
                                                }}
                                            >
                                                <span className="text-sm font-medium text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                                    {block?.name || 'Unknown'}
                                                </span>
                                                <span className="text-xs text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                                    ({layer.height} block{layer.height !== 1 ? 's' : ''})
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-[oklch(0.72_0.14_75)]/20 bg-gradient-to-br from-[oklch(0.72_0.14_75)]/5 to-transparent dark:border-[oklch(0.75_0.15_75)]/30">
                            <CardHeader>
                                <CardTitle className="text-[oklch(0.50_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                    Generated Preset
                                </CardTitle>
                                <CardDescription>
                                    Use this string when creating a superflat world
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Preset String (Java 1.13+)</Label>
                                    <div className="flex items-start gap-2">
                                        <code className="flex-1 overflow-x-auto whitespace-pre-wrap break-all rounded-lg border bg-muted p-3 text-xs font-mono">
                                            {generatePresetString()}
                                        </code>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                copyToClipboard(
                                                    generatePresetString(),
                                                    'Preset string copied!',
                                                );
                                            }}
                                            className="shrink-0"
                                        >
                                            <Copy className="size-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                                    <Info className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                    <div className="flex flex-col gap-2 text-sm">
                                        <p className="font-semibold text-blue-700 dark:text-blue-400">
                                            How to use:
                                        </p>
                                        <ol className="ml-4 flex list-decimal flex-col gap-1 text-muted-foreground">
                                            <li>Copy the preset string above</li>
                                            <li>Create a new world in Minecraft</li>
                                            <li>Select "More World Options"</li>
                                            <li>Select "World Type: Superflat"</li>
                                            <li>Click "Customize"</li>
                                            <li>Click "Presets"</li>
                                            <li>Paste the preset string and click "Use Preset"</li>
                                            <li>Click "Done" and create your world</li>
                                        </ol>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>World Information</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="flex flex-col gap-1 rounded-lg border p-3">
                                        <span className="text-sm text-muted-foreground">
                                            Total Height
                                        </span>
                                        <span className="text-xl font-bold">
                                            {getTotalHeight()} blocks
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 rounded-lg border p-3">
                                        <span className="text-sm text-muted-foreground">
                                            Number of Layers
                                        </span>
                                        <span className="text-xl font-bold">{layers.length}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 rounded-lg border p-3">
                                        <span className="text-sm text-muted-foreground">Biome</span>
                                        <span className="text-xl font-bold">
                                            {biomes.find((b) => b.id === biome)?.name || 'Unknown'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 rounded-lg border p-3">
                                        <span className="text-sm text-muted-foreground">
                                            Structures
                                        </span>
                                        <span className="text-xl font-bold">
                                            {selectedStructures.length}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
