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
import {
    axes,
    bossbarProperties,
    commandPresets,
    type CommandPreset,
    dimensions,
    entityAnchors,
    entityRelations,
    executeSubcommands,
    heightmaps,
    nbtDataTypes,
    scanModes,
    scoreComparisons,
} from '@/data/execute-data';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Check,
    ChevronDown,
    ChevronUp,
    Copy,
    GripVertical,
    Plus,
    RotateCcw,
    Sparkles,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Execute Command Builder',
        href: '/tools/execute-generator',
    },
];

interface SubcommandInstance {
    id: string;
    subcommandId: string;
    config: Record<string, string>;
}

export default function ExecuteGenerator() {
    const [chain, setChain] = useState<SubcommandInstance[]>([]);
    const [runCommand, setRunCommand] = useState('');
    const [copied, setCopied] = useState(false);
    const [selectedSubcommandIndex, setSelectedSubcommandIndex] = useState<number | null>(
        null,
    );
    const [showLineBreaks, setShowLineBreaks] = useState(true);
    const [addingAfterIndex, setAddingAfterIndex] = useState<number | null>(null);

    const addSubcommand = (subcommandId: string, afterIndex: number | null = null) => {
        const newInstance: SubcommandInstance = {
            id: Date.now().toString() + Math.random(),
            subcommandId,
            config: {},
        };

        if (afterIndex === null) {
            setChain([...chain, newInstance]);
            setSelectedSubcommandIndex(chain.length);
        } else {
            const newChain = [...chain];
            newChain.splice(afterIndex + 1, 0, newInstance);
            setChain(newChain);
            setSelectedSubcommandIndex(afterIndex + 1);
        }
        setAddingAfterIndex(null);
    };

    const removeSubcommand = (index: number) => {
        const newChain = chain.filter((_, i) => i !== index);
        setChain(newChain);
        if (selectedSubcommandIndex === index) {
            setSelectedSubcommandIndex(null);
        } else if (selectedSubcommandIndex !== null && selectedSubcommandIndex > index) {
            setSelectedSubcommandIndex(selectedSubcommandIndex - 1);
        }
    };

    const moveSubcommand = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) {
            return;
        }
        if (direction === 'down' && index === chain.length - 1) {
            return;
        }

        const newChain = [...chain];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newChain[index], newChain[targetIndex]] = [newChain[targetIndex], newChain[index]];
        setChain(newChain);

        if (selectedSubcommandIndex === index) {
            setSelectedSubcommandIndex(targetIndex);
        } else if (selectedSubcommandIndex === targetIndex) {
            setSelectedSubcommandIndex(index);
        }
    };

    const updateSubcommandConfig = (index: number, key: string, value: string) => {
        const newChain = [...chain];
        newChain[index].config[key] = value;
        setChain(newChain);
    };

    const generateCommand = (): string => {
        if (chain.length === 0 && !runCommand) {
            return 'execute run say Hello!';
        }

        const parts: string[] = ['execute'];

        for (const instance of chain) {
            const subcommand = executeSubcommands.find(
                (s) => s.id === instance.subcommandId,
            );
            if (!subcommand) {
                continue;
            }

            let part = '';

            switch (instance.subcommandId) {
                case 'as':
                case 'at':
                    part = `${instance.subcommandId} ${instance.config.targets || '@s'}`;
                    break;
                case 'positioned':
                    part = `positioned ${instance.config.x || '~'} ${instance.config.y || '~'} ${instance.config.z || '~'}`;
                    break;
                case 'positioned_as':
                    part = `positioned as ${instance.config.targets || '@s'}`;
                    break;
                case 'positioned_over':
                    part = `positioned over ${instance.config.heightmap || 'world_surface'}`;
                    break;
                case 'rotated':
                    part = `rotated ${instance.config.yaw || '~'} ${instance.config.pitch || '~'}`;
                    break;
                case 'rotated_as':
                    part = `rotated as ${instance.config.targets || '@s'}`;
                    break;
                case 'facing':
                    part = `facing ${instance.config.x || '~'} ${instance.config.y || '~'} ${instance.config.z || '~'}`;
                    break;
                case 'facing_entity':
                    part = `facing entity ${instance.config.targets || '@s'} ${instance.config.anchor || 'eyes'}`;
                    break;
                case 'align':
                    part = `align ${instance.config.axes || 'xyz'}`;
                    break;
                case 'anchored':
                    part = `anchored ${instance.config.anchor || 'feet'}`;
                    break;
                case 'in':
                    part = `in ${instance.config.dimension || 'minecraft:overworld'}`;
                    break;
                case 'summon':
                    part = `summon ${instance.config.entity || 'minecraft:pig'}`;
                    break;
                case 'on':
                    part = `on ${instance.config.relation || 'passengers'}`;
                    break;
                case 'if_block':
                case 'unless_block':
                    part = `${instance.subcommandId.replace('_', ' ')} ${instance.config.x || '~'} ${instance.config.y || '~'} ${instance.config.z || '~'} ${instance.config.block || 'minecraft:stone'}`;
                    break;
                case 'if_blocks':
                case 'unless_blocks':
                    part = `${instance.subcommandId.replace('_', ' ')} ${instance.config.x1 || '~'} ${instance.config.y1 || '~'} ${instance.config.z1 || '~'} ${instance.config.x2 || '~'} ${instance.config.y2 || '~'} ${instance.config.z2 || '~'} ${instance.config.dx || '~'} ${instance.config.dy || '~'} ${instance.config.dz || '~'} ${instance.config.scanMode || 'all'}`;
                    break;
                case 'if_entity':
                case 'unless_entity':
                    part = `${instance.subcommandId.replace('_', ' ')} ${instance.config.targets || '@s'}`;
                    break;
                case 'if_predicate':
                case 'unless_predicate':
                    part = `${instance.subcommandId.replace('_', ' ')} ${instance.config.predicate || 'minecraft:example'}`;
                    break;
                case 'if_score':
                case 'unless_score': {
                    const comparison = instance.config.comparison || '>=';
                    if (comparison === 'matches') {
                        part = `${instance.subcommandId.replace('_', ' ')} ${instance.config.target || '@s'} ${instance.config.objective || 'score'} matches ${instance.config.range || '1..'}`;
                    } else {
                        part = `${instance.subcommandId.replace('_', ' ')} ${instance.config.target || '@s'} ${instance.config.objective || 'score'} ${comparison} ${instance.config.sourceTarget || '@s'} ${instance.config.sourceObjective || 'score'}`;
                    }
                    break;
                }
                case 'if_biome':
                case 'unless_biome':
                    part = `${instance.subcommandId.replace('_', ' ')} ${instance.config.x || '~'} ${instance.config.y || '~'} ${instance.config.z || '~'} ${instance.config.biome || 'minecraft:plains'}`;
                    break;
                case 'if_dimension':
                case 'unless_dimension':
                    part = `${instance.subcommandId.replace('_', ' ')} ${instance.config.dimension || 'minecraft:overworld'}`;
                    break;
                case 'if_loaded':
                case 'unless_loaded':
                    part = `${instance.subcommandId.replace('_', ' ')} ${instance.config.x || '~'} ${instance.config.y || '~'} ${instance.config.z || '~'}`;
                    break;
                case 'store_result_score':
                case 'store_success_score':
                    part = `store ${instance.subcommandId.includes('result') ? 'result' : 'success'} score ${instance.config.targets || '@s'} ${instance.config.objective || 'score'}`;
                    break;
                case 'store_result_block':
                case 'store_success_block':
                    part = `store ${instance.subcommandId.includes('result') ? 'result' : 'success'} block ${instance.config.x || '~'} ${instance.config.y || '~'} ${instance.config.z || '~'} ${instance.config.path || 'Items[0].Count'} ${instance.config.dataType || 'int'} ${instance.config.scale || '1'}`;
                    break;
                case 'store_result_bossbar':
                case 'store_success_bossbar':
                    part = `store ${instance.subcommandId.includes('result') ? 'result' : 'success'} bossbar ${instance.config.id || 'minecraft:example'} ${instance.config.property || 'value'}`;
                    break;
                case 'store_result_entity':
                case 'store_success_entity':
                    part = `store ${instance.subcommandId.includes('result') ? 'result' : 'success'} entity ${instance.config.target || '@s'} ${instance.config.path || 'Health'} ${instance.config.dataType || 'float'} ${instance.config.scale || '1'}`;
                    break;
                case 'store_result_storage':
                case 'store_success_storage':
                    part = `store ${instance.subcommandId.includes('result') ? 'result' : 'success'} storage ${instance.config.target || 'minecraft:example'} ${instance.config.path || 'value'} ${instance.config.dataType || 'int'} ${instance.config.scale || '1'}`;
                    break;
            }

            if (part) {
                parts.push(part);
            }
        }

        parts.push('run');
        parts.push(runCommand || 'say Hello!');

        return parts.join(' ');
    };

    const copyCommand = async () => {
        const command = generateCommand();
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const loadPreset = (preset: CommandPreset) => {
        const newChain: SubcommandInstance[] = preset.chain.map((item) => ({
            id: Date.now().toString() + Math.random(),
            subcommandId: item.subcommandId,
            config: { ...item.config },
        }));
        setChain(newChain);
        setRunCommand(preset.runCommand);
        setSelectedSubcommandIndex(null);
    };

    const resetAll = () => {
        setChain([]);
        setRunCommand('');
        setSelectedSubcommandIndex(null);
        setAddingAfterIndex(null);
    };

    const renderConfigPanel = (instance: SubcommandInstance, index: number) => {
        const subcommand = executeSubcommands.find((s) => s.id === instance.subcommandId);
        if (!subcommand) {
            return null;
        }

        const config = instance.config;
        const updateConfig = (key: string, value: string) => {
            updateSubcommandConfig(index, key, value);
        };

        switch (instance.subcommandId) {
            case 'as':
            case 'at':
            case 'positioned_as':
            case 'rotated_as':
            case 'if_entity':
            case 'unless_entity':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={`targets-${instance.id}`}>Target Selector</Label>
                        <Input
                            id={`targets-${instance.id}`}
                            placeholder="@s"
                            value={config.targets || ''}
                            onChange={(e) => {
                                updateConfig('targets', e.target.value);
                            }}
                        />
                        <p className="text-xs text-muted-foreground">
                            Examples: @s, @p, @a, @e[type=zombie,distance=..5]
                        </p>
                    </div>
                );

            case 'positioned':
            case 'facing':
                return (
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor={`x-${instance.id}`}>X</Label>
                            <Input
                                id={`x-${instance.id}`}
                                placeholder="~"
                                value={config.x || ''}
                                onChange={(e) => {
                                    updateConfig('x', e.target.value);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`y-${instance.id}`}>Y</Label>
                            <Input
                                id={`y-${instance.id}`}
                                placeholder="~"
                                value={config.y || ''}
                                onChange={(e) => {
                                    updateConfig('y', e.target.value);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`z-${instance.id}`}>Z</Label>
                            <Input
                                id={`z-${instance.id}`}
                                placeholder="~"
                                value={config.z || ''}
                                onChange={(e) => {
                                    updateConfig('z', e.target.value);
                                }}
                            />
                        </div>
                    </div>
                );

            case 'positioned_over':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={`heightmap-${instance.id}`}>Heightmap</Label>
                        <Select
                            value={config.heightmap || 'world_surface'}
                            onValueChange={(value) => {
                                updateConfig('heightmap', value);
                            }}
                        >
                            <SelectTrigger id={`heightmap-${instance.id}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {heightmaps.map((hm) => (
                                    <SelectItem key={hm} value={hm}>
                                        {hm}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );

            case 'rotated':
                return (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor={`yaw-${instance.id}`}>Yaw</Label>
                            <Input
                                id={`yaw-${instance.id}`}
                                placeholder="~"
                                value={config.yaw || ''}
                                onChange={(e) => {
                                    updateConfig('yaw', e.target.value);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`pitch-${instance.id}`}>Pitch</Label>
                            <Input
                                id={`pitch-${instance.id}`}
                                placeholder="~"
                                value={config.pitch || ''}
                                onChange={(e) => {
                                    updateConfig('pitch', e.target.value);
                                }}
                            />
                        </div>
                    </div>
                );

            case 'facing_entity':
                return (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor={`targets-${instance.id}`}>Target Entity</Label>
                            <Input
                                id={`targets-${instance.id}`}
                                placeholder="@s"
                                value={config.targets || ''}
                                onChange={(e) => {
                                    updateConfig('targets', e.target.value);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`anchor-${instance.id}`}>Anchor</Label>
                            <Select
                                value={config.anchor || 'eyes'}
                                onValueChange={(value) => {
                                    updateConfig('anchor', value);
                                }}
                            >
                                <SelectTrigger id={`anchor-${instance.id}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {entityAnchors.map((anchor) => (
                                        <SelectItem key={anchor} value={anchor}>
                                            {anchor}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );

            case 'align':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={`axes-${instance.id}`}>Axes</Label>
                        <Select
                            value={config.axes || 'xyz'}
                            onValueChange={(value) => {
                                updateConfig('axes', value);
                            }}
                        >
                            <SelectTrigger id={`axes-${instance.id}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {axes.map((axis) => (
                                    <SelectItem key={axis} value={axis}>
                                        {axis}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );

            case 'anchored':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={`anchor-${instance.id}`}>Anchor Point</Label>
                        <Select
                            value={config.anchor || 'feet'}
                            onValueChange={(value) => {
                                updateConfig('anchor', value);
                            }}
                        >
                            <SelectTrigger id={`anchor-${instance.id}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {entityAnchors.map((anchor) => (
                                    <SelectItem key={anchor} value={anchor}>
                                        {anchor}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );

            case 'in':
            case 'if_dimension':
            case 'unless_dimension':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={`dimension-${instance.id}`}>Dimension</Label>
                        <Select
                            value={config.dimension || 'minecraft:overworld'}
                            onValueChange={(value) => {
                                updateConfig('dimension', value);
                            }}
                        >
                            <SelectTrigger id={`dimension-${instance.id}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {dimensions.map((dim) => (
                                    <SelectItem key={dim} value={dim}>
                                        {dim}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );

            case 'summon':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={`entity-${instance.id}`}>Entity Type</Label>
                        <Input
                            id={`entity-${instance.id}`}
                            placeholder="minecraft:pig"
                            value={config.entity || ''}
                            onChange={(e) => {
                                updateConfig('entity', e.target.value);
                            }}
                        />
                        <p className="text-xs text-muted-foreground">
                            Example: minecraft:zombie, minecraft:armor_stand
                        </p>
                    </div>
                );

            case 'on':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={`relation-${instance.id}`}>Entity Relation</Label>
                        <Select
                            value={config.relation || 'passengers'}
                            onValueChange={(value) => {
                                updateConfig('relation', value);
                            }}
                        >
                            <SelectTrigger id={`relation-${instance.id}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {entityRelations.map((rel) => (
                                    <SelectItem key={rel} value={rel}>
                                        {rel}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );

            case 'if_block':
            case 'unless_block':
            case 'if_loaded':
            case 'unless_loaded':
                return (
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor={`x-${instance.id}`}>X</Label>
                                <Input
                                    id={`x-${instance.id}`}
                                    placeholder="~"
                                    value={config.x || ''}
                                    onChange={(e) => {
                                        updateConfig('x', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`y-${instance.id}`}>Y</Label>
                                <Input
                                    id={`y-${instance.id}`}
                                    placeholder="~"
                                    value={config.y || ''}
                                    onChange={(e) => {
                                        updateConfig('y', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`z-${instance.id}`}>Z</Label>
                                <Input
                                    id={`z-${instance.id}`}
                                    placeholder="~"
                                    value={config.z || ''}
                                    onChange={(e) => {
                                        updateConfig('z', e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        {(instance.subcommandId === 'if_block' ||
                            instance.subcommandId === 'unless_block') && (
                            <div className="space-y-2">
                                <Label htmlFor={`block-${instance.id}`}>Block Type</Label>
                                <Input
                                    id={`block-${instance.id}`}
                                    placeholder="minecraft:stone"
                                    value={config.block || ''}
                                    onChange={(e) => {
                                        updateConfig('block', e.target.value);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );

            case 'if_blocks':
            case 'unless_blocks':
                return (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label>Start Position</Label>
                            <div className="grid grid-cols-3 gap-3">
                                <Input
                                    placeholder="x1"
                                    value={config.x1 || ''}
                                    onChange={(e) => {
                                        updateConfig('x1', e.target.value);
                                    }}
                                />
                                <Input
                                    placeholder="y1"
                                    value={config.y1 || ''}
                                    onChange={(e) => {
                                        updateConfig('y1', e.target.value);
                                    }}
                                />
                                <Input
                                    placeholder="z1"
                                    value={config.z1 || ''}
                                    onChange={(e) => {
                                        updateConfig('z1', e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>End Position</Label>
                            <div className="grid grid-cols-3 gap-3">
                                <Input
                                    placeholder="x2"
                                    value={config.x2 || ''}
                                    onChange={(e) => {
                                        updateConfig('x2', e.target.value);
                                    }}
                                />
                                <Input
                                    placeholder="y2"
                                    value={config.y2 || ''}
                                    onChange={(e) => {
                                        updateConfig('y2', e.target.value);
                                    }}
                                />
                                <Input
                                    placeholder="z2"
                                    value={config.z2 || ''}
                                    onChange={(e) => {
                                        updateConfig('z2', e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Destination</Label>
                            <div className="grid grid-cols-3 gap-3">
                                <Input
                                    placeholder="dx"
                                    value={config.dx || ''}
                                    onChange={(e) => {
                                        updateConfig('dx', e.target.value);
                                    }}
                                />
                                <Input
                                    placeholder="dy"
                                    value={config.dy || ''}
                                    onChange={(e) => {
                                        updateConfig('dy', e.target.value);
                                    }}
                                />
                                <Input
                                    placeholder="dz"
                                    value={config.dz || ''}
                                    onChange={(e) => {
                                        updateConfig('dz', e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Scan Mode</Label>
                            <Select
                                value={config.scanMode || 'all'}
                                onValueChange={(value) => {
                                    updateConfig('scanMode', value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {scanModes.map((mode) => (
                                        <SelectItem key={mode} value={mode}>
                                            {mode}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );

            case 'if_predicate':
            case 'unless_predicate':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={`predicate-${instance.id}`}>Predicate</Label>
                        <Input
                            id={`predicate-${instance.id}`}
                            placeholder="minecraft:example"
                            value={config.predicate || ''}
                            onChange={(e) => {
                                updateConfig('predicate', e.target.value);
                            }}
                        />
                        <p className="text-xs text-muted-foreground">
                            Example: minecraft:has_diamond
                        </p>
                    </div>
                );

            case 'if_score':
            case 'unless_score':
                return (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor={`target-${instance.id}`}>Target</Label>
                                <Input
                                    id={`target-${instance.id}`}
                                    placeholder="@s"
                                    value={config.target || ''}
                                    onChange={(e) => {
                                        updateConfig('target', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`objective-${instance.id}`}>Objective</Label>
                                <Input
                                    id={`objective-${instance.id}`}
                                    placeholder="score"
                                    value={config.objective || ''}
                                    onChange={(e) => {
                                        updateConfig('objective', e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`comparison-${instance.id}`}>Comparison</Label>
                            <Select
                                value={config.comparison || '>='}
                                onValueChange={(value) => {
                                    updateConfig('comparison', value);
                                }}
                            >
                                <SelectTrigger id={`comparison-${instance.id}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {scoreComparisons.map((comp) => (
                                        <SelectItem key={comp.value} value={comp.value}>
                                            {comp.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {config.comparison === 'matches' ? (
                            <div className="space-y-2">
                                <Label htmlFor={`range-${instance.id}`}>Range</Label>
                                <Input
                                    id={`range-${instance.id}`}
                                    placeholder="1..10 or 5.. or ..10"
                                    value={config.range || ''}
                                    onChange={(e) => {
                                        updateConfig('range', e.target.value);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor={`sourceTarget-${instance.id}`}>
                                        Source Target
                                    </Label>
                                    <Input
                                        id={`sourceTarget-${instance.id}`}
                                        placeholder="@s"
                                        value={config.sourceTarget || ''}
                                        onChange={(e) => {
                                            updateConfig('sourceTarget', e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`sourceObjective-${instance.id}`}>
                                        Source Objective
                                    </Label>
                                    <Input
                                        id={`sourceObjective-${instance.id}`}
                                        placeholder="score"
                                        value={config.sourceObjective || ''}
                                        onChange={(e) => {
                                            updateConfig('sourceObjective', e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'if_biome':
            case 'unless_biome':
                return (
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor={`x-${instance.id}`}>X</Label>
                                <Input
                                    id={`x-${instance.id}`}
                                    placeholder="~"
                                    value={config.x || ''}
                                    onChange={(e) => {
                                        updateConfig('x', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`y-${instance.id}`}>Y</Label>
                                <Input
                                    id={`y-${instance.id}`}
                                    placeholder="~"
                                    value={config.y || ''}
                                    onChange={(e) => {
                                        updateConfig('y', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`z-${instance.id}`}>Z</Label>
                                <Input
                                    id={`z-${instance.id}`}
                                    placeholder="~"
                                    value={config.z || ''}
                                    onChange={(e) => {
                                        updateConfig('z', e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`biome-${instance.id}`}>Biome</Label>
                            <Input
                                id={`biome-${instance.id}`}
                                placeholder="minecraft:plains"
                                value={config.biome || ''}
                                onChange={(e) => {
                                    updateConfig('biome', e.target.value);
                                }}
                            />
                        </div>
                    </div>
                );

            case 'store_result_score':
            case 'store_success_score':
                return (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor={`targets-${instance.id}`}>Target</Label>
                            <Input
                                id={`targets-${instance.id}`}
                                placeholder="@s"
                                value={config.targets || ''}
                                onChange={(e) => {
                                    updateConfig('targets', e.target.value);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`objective-${instance.id}`}>Objective</Label>
                            <Input
                                id={`objective-${instance.id}`}
                                placeholder="score"
                                value={config.objective || ''}
                                onChange={(e) => {
                                    updateConfig('objective', e.target.value);
                                }}
                            />
                        </div>
                    </div>
                );

            case 'store_result_block':
            case 'store_success_block':
                return (
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor={`x-${instance.id}`}>X</Label>
                                <Input
                                    id={`x-${instance.id}`}
                                    placeholder="~"
                                    value={config.x || ''}
                                    onChange={(e) => {
                                        updateConfig('x', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`y-${instance.id}`}>Y</Label>
                                <Input
                                    id={`y-${instance.id}`}
                                    placeholder="~"
                                    value={config.y || ''}
                                    onChange={(e) => {
                                        updateConfig('y', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`z-${instance.id}`}>Z</Label>
                                <Input
                                    id={`z-${instance.id}`}
                                    placeholder="~"
                                    value={config.z || ''}
                                    onChange={(e) => {
                                        updateConfig('z', e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`path-${instance.id}`}>NBT Path</Label>
                            <Input
                                id={`path-${instance.id}`}
                                placeholder="Items[0].Count"
                                value={config.path || ''}
                                onChange={(e) => {
                                    updateConfig('path', e.target.value);
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor={`dataType-${instance.id}`}>Data Type</Label>
                                <Select
                                    value={config.dataType || 'int'}
                                    onValueChange={(value) => {
                                        updateConfig('dataType', value);
                                    }}
                                >
                                    <SelectTrigger id={`dataType-${instance.id}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {nbtDataTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`scale-${instance.id}`}>Scale</Label>
                                <Input
                                    id={`scale-${instance.id}`}
                                    placeholder="1"
                                    value={config.scale || ''}
                                    onChange={(e) => {
                                        updateConfig('scale', e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'store_result_bossbar':
            case 'store_success_bossbar':
                return (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor={`id-${instance.id}`}>Bossbar ID</Label>
                            <Input
                                id={`id-${instance.id}`}
                                placeholder="minecraft:example"
                                value={config.id || ''}
                                onChange={(e) => {
                                    updateConfig('id', e.target.value);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`property-${instance.id}`}>Property</Label>
                            <Select
                                value={config.property || 'value'}
                                onValueChange={(value) => {
                                    updateConfig('property', value);
                                }}
                            >
                                <SelectTrigger id={`property-${instance.id}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {bossbarProperties.map((prop) => (
                                        <SelectItem key={prop} value={prop}>
                                            {prop}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );

            case 'store_result_entity':
            case 'store_success_entity':
                return (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor={`target-${instance.id}`}>Target Entity</Label>
                            <Input
                                id={`target-${instance.id}`}
                                placeholder="@s"
                                value={config.target || ''}
                                onChange={(e) => {
                                    updateConfig('target', e.target.value);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`path-${instance.id}`}>NBT Path</Label>
                            <Input
                                id={`path-${instance.id}`}
                                placeholder="Health"
                                value={config.path || ''}
                                onChange={(e) => {
                                    updateConfig('path', e.target.value);
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor={`dataType-${instance.id}`}>Data Type</Label>
                                <Select
                                    value={config.dataType || 'float'}
                                    onValueChange={(value) => {
                                        updateConfig('dataType', value);
                                    }}
                                >
                                    <SelectTrigger id={`dataType-${instance.id}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {nbtDataTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`scale-${instance.id}`}>Scale</Label>
                                <Input
                                    id={`scale-${instance.id}`}
                                    placeholder="1"
                                    value={config.scale || ''}
                                    onChange={(e) => {
                                        updateConfig('scale', e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'store_result_storage':
            case 'store_success_storage':
                return (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor={`target-${instance.id}`}>Storage ID</Label>
                            <Input
                                id={`target-${instance.id}`}
                                placeholder="minecraft:example"
                                value={config.target || ''}
                                onChange={(e) => {
                                    updateConfig('target', e.target.value);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`path-${instance.id}`}>NBT Path</Label>
                            <Input
                                id={`path-${instance.id}`}
                                placeholder="value"
                                value={config.path || ''}
                                onChange={(e) => {
                                    updateConfig('path', e.target.value);
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor={`dataType-${instance.id}`}>Data Type</Label>
                                <Select
                                    value={config.dataType || 'int'}
                                    onValueChange={(value) => {
                                        updateConfig('dataType', value);
                                    }}
                                >
                                    <SelectTrigger id={`dataType-${instance.id}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {nbtDataTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`scale-${instance.id}`}>Scale</Label>
                                <Input
                                    id={`scale-${instance.id}`}
                                    placeholder="1"
                                    value={config.scale || ''}
                                    onChange={(e) => {
                                        updateConfig('scale', e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const groupedSubcommands = {
        position: executeSubcommands.filter((s) => s.category === 'position'),
        context: executeSubcommands.filter((s) => s.category === 'context'),
        condition: executeSubcommands.filter((s) => s.category === 'condition'),
        store: executeSubcommands.filter((s) => s.category === 'store'),
    };

    const generatedCommand = generateCommand();
    const commandLines = showLineBreaks ? generatedCommand.split(' run ') : [generatedCommand];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Execute Command Builder" />

            <div className="mx-auto max-w-screen-2xl p-4 sm:p-6">
                <div className="mb-6 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Execute Command Builder
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Build complex execute commands with a visual chain interface
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Command Chain</CardTitle>
                                <CardDescription>
                                    Add and configure execute subcommands to build your command
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {chain.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center">
                                        <p className="mb-4 text-sm text-muted-foreground">
                                            No subcommands added yet. Click "Add Subcommand" to
                                            start building your execute command.
                                        </p>
                                        <Button
                                            onClick={() => {
                                                setAddingAfterIndex(-1);
                                            }}
                                            variant="outline"
                                        >
                                            <Plus className="mr-2 size-4" />
                                            Add Subcommand
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        {chain.map((instance, index) => {
                                            const subcommand = executeSubcommands.find(
                                                (s) => s.id === instance.subcommandId,
                                            );
                                            if (!subcommand) {
                                                return null;
                                            }

                                            return (
                                                <div key={instance.id}>
                                                    <div
                                                        className={`group rounded-lg border bg-card transition-all ${
                                                            selectedSubcommandIndex === index
                                                                ? 'border-[oklch(0.72_0.14_75)] ring-2 ring-[oklch(0.72_0.14_75)]/20 dark:border-[oklch(0.75_0.15_75)] dark:ring-[oklch(0.75_0.15_75)]/20'
                                                                : 'hover:border-muted-foreground/30'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3 p-3">
                                                            <div className="flex flex-col gap-1 pt-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        moveSubcommand(
                                                                            index,
                                                                            'up',
                                                                        );
                                                                    }}
                                                                    disabled={index === 0}
                                                                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                                                                    aria-label="Move up"
                                                                >
                                                                    <ChevronUp className="size-4" />
                                                                </button>
                                                                <GripVertical className="size-4 text-muted-foreground" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        moveSubcommand(
                                                                            index,
                                                                            'down',
                                                                        );
                                                                    }}
                                                                    disabled={
                                                                        index ===
                                                                        chain.length - 1
                                                                    }
                                                                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                                                                    aria-label="Move down"
                                                                >
                                                                    <ChevronDown className="size-4" />
                                                                </button>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="mb-2 flex items-center justify-between">
                                                                    <div>
                                                                        <h3 className="font-medium">
                                                                            {subcommand.label}
                                                                        </h3>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {subcommand.description}
                                                                        </p>
                                                                    </div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="size-8 p-0"
                                                                        onClick={() => {
                                                                            removeSubcommand(index);
                                                                        }}
                                                                    >
                                                                        <X className="size-4" />
                                                                    </Button>
                                                                </div>
                                                                {selectedSubcommandIndex ===
                                                                    index && (
                                                                    <div className="rounded-lg border bg-muted/30 p-3">
                                                                        {renderConfigPanel(
                                                                            instance,
                                                                            index,
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="border-t px-3 py-2">
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedSubcommandIndex(
                                                                            selectedSubcommandIndex ===
                                                                                index
                                                                                ? null
                                                                                : index,
                                                                        );
                                                                    }}
                                                                    className="text-xs"
                                                                >
                                                                    {selectedSubcommandIndex ===
                                                                    index
                                                                        ? 'Hide'
                                                                        : 'Configure'}
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setAddingAfterIndex(index);
                                                                    }}
                                                                    className="text-xs"
                                                                >
                                                                    <Plus className="mr-1 size-3" />
                                                                    Add After
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {addingAfterIndex === index && (
                                                        <Card className="my-3 border-[oklch(0.72_0.14_75)]/50 dark:border-[oklch(0.75_0.15_75)]/50">
                                                            <CardHeader>
                                                                <div className="flex items-center justify-between">
                                                                    <CardTitle className="text-base">
                                                                        Select Subcommand
                                                                    </CardTitle>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="size-8 p-0"
                                                                        onClick={() => {
                                                                            setAddingAfterIndex(
                                                                                null,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <X className="size-4" />
                                                                    </Button>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent className="max-h-96 space-y-4 overflow-y-auto">
                                                                <div className="space-y-3">
                                                                    <h4 className="text-sm font-medium">
                                                                        Position & Rotation
                                                                    </h4>
                                                                    <div className="grid gap-2">
                                                                        {groupedSubcommands.position.map(
                                                                            (sub) => (
                                                                                <Button
                                                                                    key={sub.id}
                                                                                    variant="outline"
                                                                                    className="justify-start"
                                                                                    onClick={() => {
                                                                                        addSubcommand(
                                                                                            sub.id,
                                                                                            index,
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">
                                                                                            {
                                                                                                sub.label
                                                                                            }
                                                                                        </div>
                                                                                        <div className="text-xs text-muted-foreground">
                                                                                            {
                                                                                                sub.description
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </Button>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <h4 className="text-sm font-medium">
                                                                        Context
                                                                    </h4>
                                                                    <div className="grid gap-2">
                                                                        {groupedSubcommands.context.map(
                                                                            (sub) => (
                                                                                <Button
                                                                                    key={sub.id}
                                                                                    variant="outline"
                                                                                    className="justify-start"
                                                                                    onClick={() => {
                                                                                        addSubcommand(
                                                                                            sub.id,
                                                                                            index,
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">
                                                                                            {
                                                                                                sub.label
                                                                                            }
                                                                                        </div>
                                                                                        <div className="text-xs text-muted-foreground">
                                                                                            {
                                                                                                sub.description
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </Button>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <h4 className="text-sm font-medium">
                                                                        Conditions
                                                                    </h4>
                                                                    <div className="grid gap-2">
                                                                        {groupedSubcommands.condition.map(
                                                                            (sub) => (
                                                                                <Button
                                                                                    key={sub.id}
                                                                                    variant="outline"
                                                                                    className="justify-start"
                                                                                    onClick={() => {
                                                                                        addSubcommand(
                                                                                            sub.id,
                                                                                            index,
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">
                                                                                            {
                                                                                                sub.label
                                                                                            }
                                                                                        </div>
                                                                                        <div className="text-xs text-muted-foreground">
                                                                                            {
                                                                                                sub.description
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </Button>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <h4 className="text-sm font-medium">
                                                                        Storage
                                                                    </h4>
                                                                    <div className="grid gap-2">
                                                                        {groupedSubcommands.store.map(
                                                                            (sub) => (
                                                                                <Button
                                                                                    key={sub.id}
                                                                                    variant="outline"
                                                                                    className="justify-start"
                                                                                    onClick={() => {
                                                                                        addSubcommand(
                                                                                            sub.id,
                                                                                            index,
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">
                                                                                            {
                                                                                                sub.label
                                                                                            }
                                                                                        </div>
                                                                                        <div className="text-xs text-muted-foreground">
                                                                                            {
                                                                                                sub.description
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </Button>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        <Button
                                            onClick={() => {
                                                setAddingAfterIndex(chain.length - 1);
                                            }}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Plus className="mr-2 size-4" />
                                            Add Subcommand
                                        </Button>
                                    </>
                                )}

                                {addingAfterIndex === -1 && (
                                    <Card className="border-[oklch(0.72_0.14_75)]/50 dark:border-[oklch(0.75_0.15_75)]/50">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base">
                                                    Select Subcommand
                                                </CardTitle>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="size-8 p-0"
                                                    onClick={() => {
                                                        setAddingAfterIndex(null);
                                                    }}
                                                >
                                                    <X className="size-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="max-h-96 space-y-4 overflow-y-auto">
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium">
                                                    Position & Rotation
                                                </h4>
                                                <div className="grid gap-2">
                                                    {groupedSubcommands.position.map((sub) => (
                                                        <Button
                                                            key={sub.id}
                                                            variant="outline"
                                                            className="justify-start"
                                                            onClick={() => {
                                                                addSubcommand(sub.id, null);
                                                            }}
                                                        >
                                                            <div className="text-left">
                                                                <div className="font-medium">
                                                                    {sub.label}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {sub.description}
                                                                </div>
                                                            </div>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium">Context</h4>
                                                <div className="grid gap-2">
                                                    {groupedSubcommands.context.map((sub) => (
                                                        <Button
                                                            key={sub.id}
                                                            variant="outline"
                                                            className="justify-start"
                                                            onClick={() => {
                                                                addSubcommand(sub.id, null);
                                                            }}
                                                        >
                                                            <div className="text-left">
                                                                <div className="font-medium">
                                                                    {sub.label}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {sub.description}
                                                                </div>
                                                            </div>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium">Conditions</h4>
                                                <div className="grid gap-2">
                                                    {groupedSubcommands.condition.map((sub) => (
                                                        <Button
                                                            key={sub.id}
                                                            variant="outline"
                                                            className="justify-start"
                                                            onClick={() => {
                                                                addSubcommand(sub.id, null);
                                                            }}
                                                        >
                                                            <div className="text-left">
                                                                <div className="font-medium">
                                                                    {sub.label}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {sub.description}
                                                                </div>
                                                            </div>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium">Storage</h4>
                                                <div className="grid gap-2">
                                                    {groupedSubcommands.store.map((sub) => (
                                                        <Button
                                                            key={sub.id}
                                                            variant="outline"
                                                            className="justify-start"
                                                            onClick={() => {
                                                                addSubcommand(sub.id, null);
                                                            }}
                                                        >
                                                            <div className="text-left">
                                                                <div className="font-medium">
                                                                    {sub.label}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {sub.description}
                                                                </div>
                                                            </div>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Run Command</CardTitle>
                                <CardDescription>
                                    The final command to execute (after "run")
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    placeholder="say Hello!"
                                    value={runCommand}
                                    onChange={(e) => {
                                        setRunCommand(e.target.value);
                                    }}
                                />
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Examples: say Hello!, kill @e[type=zombie], tp @s ~ ~10 ~
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-[oklch(0.72_0.14_75)] bg-gradient-to-br from-[oklch(0.72_0.14_75)]/10 to-transparent dark:border-[oklch(0.75_0.15_75)] dark:from-[oklch(0.75_0.15_75)]/10">
                            <CardHeader>
                                <CardTitle>Generated Command</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="line-breaks"
                                        checked={showLineBreaks}
                                        onCheckedChange={(checked) => {
                                            setShowLineBreaks(Boolean(checked));
                                        }}
                                    />
                                    <Label htmlFor="line-breaks" className="cursor-pointer text-sm">
                                        Show line breaks
                                    </Label>
                                </div>

                                <div className="max-h-96 overflow-y-auto overflow-x-auto rounded-lg border bg-muted/50 p-3">
                                    <code className="block font-mono text-xs text-[oklch(0.72_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                        {showLineBreaks ? (
                                            <>
                                                {commandLines.map((line, i) => (
                                                    <div key={i}>
                                                        {line}
                                                        {i < commandLines.length - 1 && ' run'}
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            generatedCommand
                                        )}
                                    </code>
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={copyCommand} className="flex-1">
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
                                    <Button onClick={resetAll} variant="outline" className="flex-1">
                                        <RotateCcw className="mr-2 size-4" />
                                        Reset
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="size-5" />
                                    Presets
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {commandPresets.map((preset, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="h-auto w-full justify-start p-3"
                                        onClick={() => {
                                            loadPreset(preset);
                                        }}
                                    >
                                        <div className="text-left">
                                            <div className="font-medium">{preset.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {preset.description}
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>How to Use</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div>
                                    <strong className="text-foreground">
                                        1. Add subcommands
                                    </strong>
                                    <p>
                                        Build your execute chain by adding subcommands in the order
                                        you want them.
                                    </p>
                                </div>
                                <div>
                                    <strong className="text-foreground">
                                        2. Configure each step
                                    </strong>
                                    <p>
                                        Click "Configure" on each subcommand to set its parameters.
                                    </p>
                                </div>
                                <div>
                                    <strong className="text-foreground">
                                        3. Set run command
                                    </strong>
                                    <p>Enter the final command to execute in the Run Command box.</p>
                                </div>
                                <div>
                                    <strong className="text-foreground">4. Copy and use</strong>
                                    <p>
                                        Copy the generated command and paste it into Minecraft or a
                                        command block.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
