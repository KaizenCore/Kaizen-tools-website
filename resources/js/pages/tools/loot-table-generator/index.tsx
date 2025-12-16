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
import { Checkbox } from '@/components/ui/checkbox';
import { OutputPanel, ToolLayout } from '@/components/tool-layout';
import {
    lootTableTypes,
    minecraftItems,
    lootFunctions,
    lootConditions,
    lootTablePresets,
    itemCategories,
} from '@/data/loot-table-data';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Check,
    Copy,
    Download,
    Plus,
    RotateCcw,
    Trash2,
    AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Loot Table Generator',
        href: '/tools/loot-table-generator',
    },
];

interface LootEntry {
    id: string;
    type: 'item';
    name: string;
    weight: number;
    functions: LootEntryFunction[];
    conditions: LootEntryCondition[];
}

interface LootEntryFunction {
    id: string;
    function: string;
    parameters: Record<string, any>;
}

interface LootEntryCondition {
    id: string;
    condition: string;
    parameters: Record<string, any>;
}

interface LootPool {
    id: string;
    rolls: number | { min: number; max: number };
    entries: LootEntry[];
    conditions: LootEntryCondition[];
}

export default function LootTableGenerator() {
    const [tableType, setTableType] = useState('block');
    const [pools, setPools] = useState<LootPool[]>([]);
    const [copied, setCopied] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const addPool = () => {
        const newPool: LootPool = {
            id: Math.random().toString(36).substring(7),
            rolls: 1,
            entries: [],
            conditions: [],
        };
        setPools([...pools, newPool]);
    };

    const removePool = (poolId: string) => {
        setPools(pools.filter((p) => p.id !== poolId));
    };

    const updatePool = (poolId: string, updates: Partial<LootPool>) => {
        setPools(
            pools.map((p) => (p.id === poolId ? { ...p, ...updates } : p)),
        );
    };

    const addEntry = (poolId: string) => {
        const newEntry: LootEntry = {
            id: Math.random().toString(36).substring(7),
            type: 'item',
            name: 'minecraft:dirt',
            weight: 1,
            functions: [],
            conditions: [],
        };
        const pool = pools.find((p) => p.id === poolId);
        if (pool) {
            updatePool(poolId, {
                entries: [...pool.entries, newEntry],
            });
        }
    };

    const removeEntry = (poolId: string, entryId: string) => {
        const pool = pools.find((p) => p.id === poolId);
        if (pool) {
            updatePool(poolId, {
                entries: pool.entries.filter((e) => e.id !== entryId),
            });
        }
    };

    const updateEntry = (
        poolId: string,
        entryId: string,
        updates: Partial<LootEntry>,
    ) => {
        const pool = pools.find((p) => p.id === poolId);
        if (pool) {
            updatePool(poolId, {
                entries: pool.entries.map((e) =>
                    e.id === entryId ? { ...e, ...updates } : e,
                ),
            });
        }
    };

    const addFunction = (poolId: string, entryId: string) => {
        const pool = pools.find((p) => p.id === poolId);
        const entry = pool?.entries.find((e) => e.id === entryId);
        if (entry) {
            const newFunction: LootEntryFunction = {
                id: Math.random().toString(36).substring(7),
                function: 'set_count',
                parameters: { count: { min: 1, max: 1 } },
            };
            updateEntry(poolId, entryId, {
                functions: [...entry.functions, newFunction],
            });
        }
    };

    const removeFunction = (
        poolId: string,
        entryId: string,
        functionId: string,
    ) => {
        const pool = pools.find((p) => p.id === poolId);
        const entry = pool?.entries.find((e) => e.id === entryId);
        if (entry) {
            updateEntry(poolId, entryId, {
                functions: entry.functions.filter((f) => f.id !== functionId),
            });
        }
    };

    const updateFunction = (
        poolId: string,
        entryId: string,
        functionId: string,
        updates: Partial<LootEntryFunction>,
    ) => {
        const pool = pools.find((p) => p.id === poolId);
        const entry = pool?.entries.find((e) => e.id === entryId);
        if (entry) {
            updateEntry(poolId, entryId, {
                functions: entry.functions.map((f) =>
                    f.id === functionId ? { ...f, ...updates } : f,
                ),
            });
        }
    };

    const addCondition = (poolId: string, entryId: string) => {
        const pool = pools.find((p) => p.id === poolId);
        const entry = pool?.entries.find((e) => e.id === entryId);
        if (entry) {
            const newCondition: LootEntryCondition = {
                id: Math.random().toString(36).substring(7),
                condition: 'random_chance',
                parameters: { chance: 0.5 },
            };
            updateEntry(poolId, entryId, {
                conditions: [...entry.conditions, newCondition],
            });
        }
    };

    const removeCondition = (
        poolId: string,
        entryId: string,
        conditionId: string,
    ) => {
        const pool = pools.find((p) => p.id === poolId);
        const entry = pool?.entries.find((e) => e.id === entryId);
        if (entry) {
            updateEntry(poolId, entryId, {
                conditions: entry.conditions.filter(
                    (c) => c.id !== conditionId,
                ),
            });
        }
    };

    const updateCondition = (
        poolId: string,
        entryId: string,
        conditionId: string,
        updates: Partial<LootEntryCondition>,
    ) => {
        const pool = pools.find((p) => p.id === poolId);
        const entry = pool?.entries.find((e) => e.id === entryId);
        if (entry) {
            updateEntry(poolId, entryId, {
                conditions: entry.conditions.map((c) =>
                    c.id === conditionId ? { ...c, ...updates } : c,
                ),
            });
        }
    };

    const loadPreset = (presetId: string) => {
        const preset = lootTablePresets.find((p) => p.id === presetId);
        if (preset) {
            setTableType(preset.tableType);
            const loadedPools: LootPool[] = preset.pools.map((pool) => ({
                id: Math.random().toString(36).substring(7),
                rolls: pool.rolls,
                entries: pool.entries.map((entry: any) => ({
                    id: Math.random().toString(36).substring(7),
                    type: entry.type,
                    name: entry.name,
                    weight: entry.weight,
                    functions: entry.functions.map((fn: any) => ({
                        id: Math.random().toString(36).substring(7),
                        function: fn.function,
                        parameters: fn.parameters,
                    })),
                    conditions: entry.conditions.map((cond: any) => ({
                        id: Math.random().toString(36).substring(7),
                        condition: cond.condition,
                        parameters: cond.parameters,
                    })),
                })),
                conditions: pool.conditions.map((cond: any) => ({
                    id: Math.random().toString(36).substring(7),
                    condition: cond.condition,
                    parameters: cond.parameters,
                })),
            }));
            setPools(loadedPools);
        }
    };

    const reset = () => {
        setTableType('block');
        setPools([]);
        setSearchTerm('');
        setSelectedCategory('all');
    };

    const generateJSON = () => {
        const lootTable: any = {
            type: `minecraft:${tableType}`,
            pools: pools.map((pool) => {
                const poolData: any = {
                    rolls:
                        typeof pool.rolls === 'number'
                            ? pool.rolls
                            : {
                                  min: pool.rolls.min,
                                  max: pool.rolls.max,
                              },
                    entries: pool.entries.map((entry) => {
                        const entryData: any = {
                            type: entry.type,
                            name: entry.name,
                            weight: entry.weight,
                        };

                        if (entry.functions.length > 0) {
                            entryData.functions = entry.functions.map((fn) => {
                                const fnData: any = {
                                    function: `minecraft:${fn.function}`,
                                };
                                Object.keys(fn.parameters).forEach((key) => {
                                    fnData[key] = fn.parameters[key];
                                });
                                return fnData;
                            });
                        }

                        if (entry.conditions.length > 0) {
                            entryData.conditions = entry.conditions.map(
                                (cond) => {
                                    const condData: any = {
                                        condition: `minecraft:${cond.condition}`,
                                    };
                                    Object.keys(cond.parameters).forEach(
                                        (key) => {
                                            condData[key] =
                                                cond.parameters[key];
                                        },
                                    );
                                    return condData;
                                },
                            );
                        }

                        return entryData;
                    }),
                };

                if (pool.conditions.length > 0) {
                    poolData.conditions = pool.conditions.map((cond) => {
                        const condData: any = {
                            condition: `minecraft:${cond.condition}`,
                        };
                        Object.keys(cond.parameters).forEach((key) => {
                            condData[key] = cond.parameters[key];
                        });
                        return condData;
                    });
                }

                return poolData;
            }),
        };

        return JSON.stringify(lootTable, null, 2);
    };

    const copyJSON = async () => {
        const json = generateJSON();
        await navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadJSON = () => {
        const json = generateJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `loot_table_${tableType}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const filteredItems = minecraftItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getValidationErrors = () => {
        const errors: string[] = [];
        if (pools.length === 0) {
            errors.push('Add at least one pool to the loot table');
        }
        pools.forEach((pool, poolIndex) => {
            if (pool.entries.length === 0) {
                errors.push(`Pool ${poolIndex + 1} has no entries`);
            }
        });
        return errors;
    };

    const validationErrors = getValidationErrors();

    const sidebar = (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Load Preset</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        {lootTablePresets.map((preset) => (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() =>
                                    loadPreset(preset.id)
                                }
                                className="w-full rounded-lg border p-3 text-left transition-all hover:border-primary hover:bg-accent"
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

            <OutputPanel
                title="JSON Preview"
                actions={
                    <>
                        <Button
                            onClick={copyJSON}
                            variant="ghost"
                            size="sm"
                            disabled={
                                validationErrors.length > 0 ||
                                copied
                            }
                        >
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
                        <Button
                            onClick={downloadJSON}
                            variant="ghost"
                            size="sm"
                            disabled={validationErrors.length > 0}
                        >
                            <Download className="mr-1 size-3" />
                            Download
                        </Button>
                    </>
                }
            >
                {validationErrors.length > 0 && (
                    <div className="flex flex-col gap-2 rounded-lg border border-destructive bg-destructive/10 p-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                            <AlertCircle className="size-4" />
                            Validation Issues
                        </div>
                        <ul className="ml-6 list-disc text-xs text-destructive">
                            {validationErrors.map(
                                (error, index) => (
                                    <li key={index}>{error}</li>
                                ),
                            )}
                        </ul>
                    </div>
                )}

                <div className="max-h-96 overflow-auto rounded-lg border bg-muted/50 p-3">
                    <pre className="font-mono text-xs">
                        {generateJSON()}
                    </pre>
                </div>

                <Button
                    onClick={reset}
                    variant="outline"
                    className="w-full"
                >
                    <RotateCcw className="mr-2 size-4" />
                    Reset All
                </Button>
            </OutputPanel>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">How to Use</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                    <div>
                        <strong className="text-foreground">
                            1. Choose table type
                        </strong>
                        <p className="text-muted-foreground">
                            Select whether this is for a block,
                            chest, entity, etc.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            2. Add pools
                        </strong>
                        <p className="text-muted-foreground">
                            Pools define separate drop chances.
                            Each pool rolls independently.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            3. Add entries
                        </strong>
                        <p className="text-muted-foreground">
                            Add items to each pool with weights.
                            Higher weight means more likely to
                            drop.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            4. Add functions and conditions
                        </strong>
                        <p className="text-muted-foreground">
                            Functions modify drops (count, damage,
                            etc.). Conditions control when drops
                            occur.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            5. Export JSON
                        </strong>
                        <p className="text-muted-foreground">
                            Copy or download the JSON and place it
                            in your datapack's loot_tables folder.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Loot Table Generator" />
            <ToolLayout
                title="Minecraft Loot Table Generator"
                description="Create custom loot tables for blocks, chests, mobs, and more"
                sidebar={sidebar}
            >
                        <Card>
                            <CardHeader>
                                <CardTitle>Loot Table Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select
                                    value={tableType}
                                    onValueChange={setTableType}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lootTableTypes.map((type) => (
                                            <SelectItem
                                                key={type.id}
                                                value={type.id}
                                            >
                                                <div>
                                                    <div className="font-medium">
                                                        {type.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {type.description}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>
                                        Pools ({pools.length})
                                    </CardTitle>
                                    <Button onClick={addPool} size="sm">
                                        <Plus className="mr-2 size-4" />
                                        Add Pool
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {pools.length === 0 ? (
                                    <div className="rounded-lg border border-dashed p-8 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            No pools yet. Click "Add Pool" to
                                            get started.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pools.map((pool, poolIndex) => (
                                            <Card
                                                key={pool.id}
                                                className="border-2"
                                            >
                                                <CardHeader>
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-base">
                                                            Pool{' '}
                                                            {poolIndex + 1}
                                                        </CardTitle>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                removePool(
                                                                    pool.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <div>
                                                            <Label>
                                                                Rolls (fixed)
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                value={
                                                                    typeof pool.rolls ===
                                                                    'number'
                                                                        ? pool.rolls
                                                                        : ''
                                                                }
                                                                onChange={(e) =>
                                                                    updatePool(
                                                                        pool.id,
                                                                        {
                                                                            rolls: parseInt(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ),
                                                                        },
                                                                    )
                                                                }
                                                                min={1}
                                                            />
                                                        </div>
                                                        <div className="flex items-center space-x-2 pt-6">
                                                            <Checkbox
                                                                id={`range-${pool.id}`}
                                                                checked={
                                                                    typeof pool.rolls !==
                                                                    'number'
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) => {
                                                                    if (
                                                                        checked
                                                                    ) {
                                                                        updatePool(
                                                                            pool.id,
                                                                            {
                                                                                rolls: {
                                                                                    min: 1,
                                                                                    max: 3,
                                                                                },
                                                                            },
                                                                        );
                                                                    } else {
                                                                        updatePool(
                                                                            pool.id,
                                                                            {
                                                                                rolls: 1,
                                                                            },
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                            <Label
                                                                htmlFor={`range-${pool.id}`}
                                                                className="cursor-pointer"
                                                            >
                                                                Use range
                                                            </Label>
                                                        </div>
                                                    </div>

                                                    {typeof pool.rolls !==
                                                        'number' && (
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <div>
                                                                <Label>
                                                                    Min Rolls
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        pool
                                                                            .rolls
                                                                            .min
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updatePool(
                                                                            pool.id,
                                                                            {
                                                                                rolls: {
                                                                                    ...(pool.rolls as {
                                                                                        min: number;
                                                                                        max: number;
                                                                                    }),
                                                                                    min: parseInt(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    ),
                                                                                },
                                                                            },
                                                                        )
                                                                    }
                                                                    min={1}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>
                                                                    Max Rolls
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        pool
                                                                            .rolls
                                                                            .max
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updatePool(
                                                                            pool.id,
                                                                            {
                                                                                rolls: {
                                                                                    ...(pool.rolls as {
                                                                                        min: number;
                                                                                        max: number;
                                                                                    }),
                                                                                    max: parseInt(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    ),
                                                                                },
                                                                            },
                                                                        )
                                                                    }
                                                                    min={1}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    <Separator />

                                                    <div>
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <Label>
                                                                Entries (
                                                                {
                                                                    pool.entries
                                                                        .length
                                                                }
                                                                )
                                                            </Label>
                                                            <Button
                                                                onClick={() =>
                                                                    addEntry(
                                                                        pool.id,
                                                                    )
                                                                }
                                                                size="sm"
                                                                variant="outline"
                                                            >
                                                                <Plus className="mr-2 size-4" />
                                                                Add Entry
                                                            </Button>
                                                        </div>

                                                        {pool.entries.length ===
                                                        0 ? (
                                                            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                                                                No entries. Add
                                                                an entry to
                                                                define what can
                                                                drop.
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                {pool.entries.map(
                                                                    (entry) => (
                                                                        <Card
                                                                            key={
                                                                                entry.id
                                                                            }
                                                                            className="border"
                                                                        >
                                                                            <CardContent className="space-y-3 pt-4">
                                                                                <div className="flex items-start justify-between gap-2">
                                                                                    <div className="flex-1 space-y-2">
                                                                                        <div>
                                                                                            <Label>
                                                                                                Item
                                                                                            </Label>
                                                                                            <Select
                                                                                                value={
                                                                                                    entry.name
                                                                                                }
                                                                                                onValueChange={(
                                                                                                    value,
                                                                                                ) =>
                                                                                                    updateEntry(
                                                                                                        pool.id,
                                                                                                        entry.id,
                                                                                                        {
                                                                                                            name: value,
                                                                                                        },
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <SelectTrigger>
                                                                                                    <SelectValue />
                                                                                                </SelectTrigger>
                                                                                                <SelectContent>
                                                                                                    <div className="sticky top-0 bg-popover p-2">
                                                                                                        <Input
                                                                                                            placeholder="Search items..."
                                                                                                            value={
                                                                                                                searchTerm
                                                                                                            }
                                                                                                            onChange={(
                                                                                                                e,
                                                                                                            ) =>
                                                                                                                setSearchTerm(
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value,
                                                                                                                )
                                                                                                            }
                                                                                                        />
                                                                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                                                                            <Button
                                                                                                                variant={
                                                                                                                    selectedCategory ===
                                                                                                                    'all'
                                                                                                                        ? 'default'
                                                                                                                        : 'outline'
                                                                                                                }
                                                                                                                size="sm"
                                                                                                                onClick={() =>
                                                                                                                    setSelectedCategory(
                                                                                                                        'all',
                                                                                                                    )
                                                                                                                }
                                                                                                            >
                                                                                                                All
                                                                                                            </Button>
                                                                                                            {itemCategories.map(
                                                                                                                (
                                                                                                                    cat,
                                                                                                                ) => (
                                                                                                                    <Button
                                                                                                                        key={
                                                                                                                            cat
                                                                                                                        }
                                                                                                                        variant={
                                                                                                                            selectedCategory ===
                                                                                                                            cat
                                                                                                                                ? 'default'
                                                                                                                                : 'outline'
                                                                                                                        }
                                                                                                                        size="sm"
                                                                                                                        onClick={() =>
                                                                                                                            setSelectedCategory(
                                                                                                                                cat,
                                                                                                                            )
                                                                                                                        }
                                                                                                                    >
                                                                                                                        {cat}
                                                                                                                    </Button>
                                                                                                                ),
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="max-h-64 overflow-y-auto">
                                                                                                        {filteredItems.map(
                                                                                                            (
                                                                                                                item,
                                                                                                            ) => (
                                                                                                                <SelectItem
                                                                                                                    key={
                                                                                                                        item.id
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        item.id
                                                                                                                    }
                                                                                                                >
                                                                                                                    {
                                                                                                                        item.name
                                                                                                                    }
                                                                                                                </SelectItem>
                                                                                                            ),
                                                                                                        )}
                                                                                                    </div>
                                                                                                </SelectContent>
                                                                                            </Select>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Label>
                                                                                                Weight
                                                                                            </Label>
                                                                                            <Input
                                                                                                type="number"
                                                                                                value={
                                                                                                    entry.weight
                                                                                                }
                                                                                                onChange={(
                                                                                                    e,
                                                                                                ) =>
                                                                                                    updateEntry(
                                                                                                        pool.id,
                                                                                                        entry.id,
                                                                                                        {
                                                                                                            weight: parseInt(
                                                                                                                e
                                                                                                                    .target
                                                                                                                    .value,
                                                                                                            ),
                                                                                                        },
                                                                                                    )
                                                                                                }
                                                                                                min={
                                                                                                    1
                                                                                                }
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() =>
                                                                                            removeEntry(
                                                                                                pool.id,
                                                                                                entry.id,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <Trash2 className="size-4 text-destructive" />
                                                                                    </Button>
                                                                                </div>

                                                                                <div className="space-y-2">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <Label className="text-xs">
                                                                                            Functions
                                                                                        </Label>
                                                                                        <Button
                                                                                            onClick={() =>
                                                                                                addFunction(
                                                                                                    pool.id,
                                                                                                    entry.id,
                                                                                                )
                                                                                            }
                                                                                            size="sm"
                                                                                            variant="outline"
                                                                                        >
                                                                                            <Plus className="size-3" />
                                                                                        </Button>
                                                                                    </div>
                                                                                    {entry.functions.map(
                                                                                        (
                                                                                            fn,
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    fn.id
                                                                                                }
                                                                                                className="flex items-center gap-2 rounded border p-2"
                                                                                            >
                                                                                                <Select
                                                                                                    value={
                                                                                                        fn.function
                                                                                                    }
                                                                                                    onValueChange={(
                                                                                                        value,
                                                                                                    ) =>
                                                                                                        updateFunction(
                                                                                                            pool.id,
                                                                                                            entry.id,
                                                                                                            fn.id,
                                                                                                            {
                                                                                                                function:
                                                                                                                    value,
                                                                                                            },
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <SelectTrigger className="text-xs">
                                                                                                        <SelectValue />
                                                                                                    </SelectTrigger>
                                                                                                    <SelectContent>
                                                                                                        {lootFunctions.map(
                                                                                                            (
                                                                                                                func,
                                                                                                            ) => (
                                                                                                                <SelectItem
                                                                                                                    key={
                                                                                                                        func.id
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        func.id
                                                                                                                    }
                                                                                                                >
                                                                                                                    {
                                                                                                                        func.name
                                                                                                                    }
                                                                                                                </SelectItem>
                                                                                                            ),
                                                                                                        )}
                                                                                                    </SelectContent>
                                                                                                </Select>
                                                                                                <Button
                                                                                                    variant="ghost"
                                                                                                    size="sm"
                                                                                                    onClick={() =>
                                                                                                        removeFunction(
                                                                                                            pool.id,
                                                                                                            entry.id,
                                                                                                            fn.id,
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <Trash2 className="size-3" />
                                                                                                </Button>
                                                                                            </div>
                                                                                        ),
                                                                                    )}
                                                                                </div>

                                                                                <div className="space-y-2">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <Label className="text-xs">
                                                                                            Conditions
                                                                                        </Label>
                                                                                        <Button
                                                                                            onClick={() =>
                                                                                                addCondition(
                                                                                                    pool.id,
                                                                                                    entry.id,
                                                                                                )
                                                                                            }
                                                                                            size="sm"
                                                                                            variant="outline"
                                                                                        >
                                                                                            <Plus className="size-3" />
                                                                                        </Button>
                                                                                    </div>
                                                                                    {entry.conditions.map(
                                                                                        (
                                                                                            cond,
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    cond.id
                                                                                                }
                                                                                                className="flex items-center gap-2 rounded border p-2"
                                                                                            >
                                                                                                <Select
                                                                                                    value={
                                                                                                        cond.condition
                                                                                                    }
                                                                                                    onValueChange={(
                                                                                                        value,
                                                                                                    ) =>
                                                                                                        updateCondition(
                                                                                                            pool.id,
                                                                                                            entry.id,
                                                                                                            cond.id,
                                                                                                            {
                                                                                                                condition:
                                                                                                                    value,
                                                                                                            },
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <SelectTrigger className="text-xs">
                                                                                                        <SelectValue />
                                                                                                    </SelectTrigger>
                                                                                                    <SelectContent>
                                                                                                        {lootConditions.map(
                                                                                                            (
                                                                                                                condition,
                                                                                                            ) => (
                                                                                                                <SelectItem
                                                                                                                    key={
                                                                                                                        condition.id
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        condition.id
                                                                                                                    }
                                                                                                                >
                                                                                                                    {
                                                                                                                        condition.name
                                                                                                                    }
                                                                                                                </SelectItem>
                                                                                                            ),
                                                                                                        )}
                                                                                                    </SelectContent>
                                                                                                </Select>
                                                                                                <Button
                                                                                                    variant="ghost"
                                                                                                    size="sm"
                                                                                                    onClick={() =>
                                                                                                        removeCondition(
                                                                                                            pool.id,
                                                                                                            entry.id,
                                                                                                            cond.id,
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <Trash2 className="size-3" />
                                                                                                </Button>
                                                                                            </div>
                                                                                        ),
                                                                                    )}
                                                                                </div>
                                                                            </CardContent>
                                                                        </Card>
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
            </ToolLayout>
        </AppLayout>
    );
}
