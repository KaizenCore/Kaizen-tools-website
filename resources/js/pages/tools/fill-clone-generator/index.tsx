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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    blockStates,
    cloneModes,
    cloneTypes,
    coordinateTypes,
    fillModes,
    minecraftBlocks,
    presets,
} from '@/data/fill-clone-data';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeftRight,
    Check,
    Copy,
    Box,
    Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Fill/Clone Command Generator',
        href: '/tools/fill-clone-generator',
    },
];

interface Position {
    x: string;
    y: string;
    z: string;
    type: string;
}

export default function FillCloneGenerator() {
    const [activeTab, setActiveTab] = useState<'fill' | 'clone'>('fill');
    const [copied, setCopied] = useState(false);
    const [blockSearch, setBlockSearch] = useState('');

    // Fill command state
    const [fillFrom, setFillFrom] = useState<Position>({
        x: '0',
        y: '64',
        z: '0',
        type: 'absolute',
    });
    const [fillTo, setFillTo] = useState<Position>({
        x: '10',
        y: '74',
        z: '10',
        type: 'absolute',
    });
    const [selectedBlock, setSelectedBlock] = useState('stone');
    const [blockStateValues, setBlockStateValues] = useState<Record<string, string>>({});
    const [fillMode, setFillMode] = useState('replace');
    const [replaceFilter, setReplaceFilter] = useState('');

    // Clone command state
    const [cloneFrom, setCloneFrom] = useState<Position>({
        x: '0',
        y: '64',
        z: '0',
        type: 'absolute',
    });
    const [cloneTo, setCloneTo] = useState<Position>({
        x: '10',
        y: '74',
        z: '10',
        type: 'absolute',
    });
    const [cloneDest, setCloneDest] = useState<Position>({
        x: '100',
        y: '64',
        z: '100',
        type: 'absolute',
    });
    const [cloneMode, setCloneMode] = useState('replace');
    const [cloneType, setCloneType] = useState('normal');
    const [filterBlock, setFilterBlock] = useState('');

    const filteredBlocks = useMemo(() => {
        if (!blockSearch) {
            return minecraftBlocks;
        }
        return minecraftBlocks.filter((block) => {
            return block.name.toLowerCase().includes(blockSearch.toLowerCase());
        });
    }, [blockSearch]);

    const selectedBlockData = useMemo(() => {
        return minecraftBlocks.find((b) => {
            return b.id === selectedBlock;
        });
    }, [selectedBlock]);

    const calculateVolume = (from: Position, to: Position): number => {
        const x1 = parseInt(from.x) || 0;
        const y1 = parseInt(from.y) || 0;
        const z1 = parseInt(from.z) || 0;
        const x2 = parseInt(to.x) || 0;
        const y2 = parseInt(to.y) || 0;
        const z2 = parseInt(to.z) || 0;

        return Math.abs(x2 - x1 + 1) * Math.abs(y2 - y1 + 1) * Math.abs(z2 - z1 + 1);
    };

    const formatCoordinate = (value: string, type: string): string => {
        const coordType = coordinateTypes.find((t) => {
            return t.id === type;
        });
        if (!coordType) {
            return value;
        }
        if (type === 'absolute') {
            return value;
        }
        return `${coordType.symbol}${value === '0' || value === '' ? '' : value}`;
    };

    const buildBlockString = (): string => {
        let blockString = selectedBlock;
        const states = selectedBlockData?.states || [];

        if (states.length > 0) {
            const stateEntries = states
                .map((stateName) => {
                    const value = blockStateValues[stateName];
                    if (value) {
                        return `${stateName}=${value}`;
                    }
                    return null;
                })
                .filter(Boolean);

            if (stateEntries.length > 0) {
                blockString += `[${stateEntries.join(',')}]`;
            }
        }

        return blockString;
    };

    const generateFillCommand = (): string => {
        const fromCoords = `${formatCoordinate(fillFrom.x, fillFrom.type)} ${formatCoordinate(fillFrom.y, fillFrom.type)} ${formatCoordinate(fillFrom.z, fillFrom.type)}`;
        const toCoords = `${formatCoordinate(fillTo.x, fillTo.type)} ${formatCoordinate(fillTo.y, fillTo.type)} ${formatCoordinate(fillTo.z, fillTo.type)}`;
        const blockStr = buildBlockString();

        let command = `/fill ${fromCoords} ${toCoords} ${blockStr}`;

        if (fillMode !== 'replace') {
            command += ` ${fillMode}`;
        } else if (replaceFilter) {
            command += ` replace ${replaceFilter}`;
        }

        return command;
    };

    const generateCloneCommand = (): string => {
        const fromCoords = `${formatCoordinate(cloneFrom.x, cloneFrom.type)} ${formatCoordinate(cloneFrom.y, cloneFrom.type)} ${formatCoordinate(cloneFrom.z, cloneFrom.type)}`;
        const toCoords = `${formatCoordinate(cloneTo.x, cloneTo.type)} ${formatCoordinate(cloneTo.y, cloneTo.type)} ${formatCoordinate(cloneTo.z, cloneTo.type)}`;
        const destCoords = `${formatCoordinate(cloneDest.x, cloneDest.type)} ${formatCoordinate(cloneDest.y, cloneDest.type)} ${formatCoordinate(cloneDest.z, cloneDest.type)}`;

        let command = `/clone ${fromCoords} ${toCoords} ${destCoords}`;

        if (cloneMode === 'masked') {
            command += ` masked`;
            if (filterBlock) {
                command += ` ${filterBlock}`;
            }
        } else {
            command += ` replace`;
        }

        if (cloneType !== 'normal') {
            command += ` ${cloneType}`;
        }

        return command;
    };

    const currentCommand = activeTab === 'fill' ? generateFillCommand() : generateCloneCommand();

    const currentVolume =
        activeTab === 'fill' ? calculateVolume(fillFrom, fillTo) : calculateVolume(cloneFrom, cloneTo);

    const copyCommand = () => {
        navigator.clipboard.writeText(currentCommand);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const swapCorners = () => {
        if (activeTab === 'fill') {
            const temp = { ...fillFrom };
            setFillFrom(fillTo);
            setFillTo(temp);
        } else {
            const temp = { ...cloneFrom };
            setCloneFrom(cloneTo);
            setCloneTo(temp);
        }
    };

    const applyPreset = (presetName: string) => {
        const preset = presets.find((p) => {
            return p.name === presetName;
        });
        if (!preset) {
            return;
        }

        if (preset.tab === 'fill') {
            setActiveTab('fill');
            if (preset.config.block) {
                setSelectedBlock(preset.config.block);
            }
            if (preset.config.fillMode) {
                setFillMode(preset.config.fillMode);
            }
        } else {
            setActiveTab('clone');
            if (preset.config.cloneMode) {
                setCloneMode(preset.config.cloneMode);
            }
            if (preset.config.cloneType) {
                setCloneType(preset.config.cloneType);
            }
        }
    };

    const CoordinateInput = ({
        position,
        onChange,
        label,
    }: {
        position: Position;
        onChange: (pos: Position) => void;
        label: string;
    }) => {
        return (
            <div className="flex flex-col gap-3">
                <Label className="text-sm font-semibold">{label}</Label>
                <div className="grid gap-3 sm:grid-cols-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`${label}-x`} className="text-xs">
                            X
                        </Label>
                        <div className="flex gap-2">
                            <Select
                                value={position.type}
                                onValueChange={(value) => {
                                    onChange({ ...position, type: value });
                                }}
                            >
                                <SelectTrigger className="w-16">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {coordinateTypes.map((type) => {
                                        return (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.symbol || '='}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            <Input
                                id={`${label}-x`}
                                type="text"
                                value={position.x}
                                onChange={(e) => {
                                    onChange({ ...position, x: e.target.value });
                                }}
                                className="flex-1"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`${label}-y`} className="text-xs">
                            Y
                        </Label>
                        <Input
                            id={`${label}-y`}
                            type="text"
                            value={position.y}
                            onChange={(e) => {
                                onChange({ ...position, y: e.target.value });
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`${label}-z`} className="text-xs">
                            Z
                        </Label>
                        <Input
                            id={`${label}-z`}
                            type="text"
                            value={position.z}
                            onChange={(e) => {
                                onChange({ ...position, z: e.target.value });
                            }}
                        />
                    </div>
                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                const newX = (parseInt(position.x) + 1).toString();
                                onChange({ ...position, x: newX });
                            }}
                            className="w-full"
                        >
                            +1
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fill/Clone Command Generator" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Fill/Clone Command Generator</h1>
                    <p className="text-muted-foreground">
                        Generate /fill and /clone commands for Minecraft
                    </p>
                </div>

                {copied && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                        <Check className="size-4" />
                        Command copied to clipboard!
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Tabs value={activeTab} onValueChange={(v) => {
                            setActiveTab(v as 'fill' | 'clone');
                        }}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="fill">Fill Command</TabsTrigger>
                                <TabsTrigger value="clone">Clone Command</TabsTrigger>
                            </TabsList>

                            <TabsContent value="fill" className="mt-6 flex flex-col gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Positions</CardTitle>
                                        <CardDescription>
                                            Define the region to fill
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <CoordinateInput
                                            position={fillFrom}
                                            onChange={setFillFrom}
                                            label="From Position"
                                        />
                                        <CoordinateInput
                                            position={fillTo}
                                            onChange={setFillTo}
                                            label="To Position"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={swapCorners}
                                            className="w-full sm:w-auto"
                                        >
                                            <ArrowLeftRight className="size-4" />
                                            Swap Corners
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Block Selection</CardTitle>
                                        <CardDescription>
                                            Choose the block to fill with
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label>Search Blocks</Label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="Search blocks..."
                                                    value={blockSearch}
                                                    onChange={(e) => {
                                                        setBlockSearch(e.target.value);
                                                    }}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label>Block</Label>
                                            <Select
                                                value={selectedBlock}
                                                onValueChange={(value) => {
                                                    setSelectedBlock(value);
                                                    setBlockStateValues({});
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredBlocks.map((block) => {
                                                        return (
                                                            <SelectItem
                                                                key={block.id}
                                                                value={block.id}
                                                            >
                                                                {block.name}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {selectedBlockData?.states &&
                                            selectedBlockData.states.length > 0 && (
                                                <div className="flex flex-col gap-3">
                                                    <Label className="text-sm font-semibold">
                                                        Block States
                                                    </Label>
                                                    {selectedBlockData.states.map((stateName) => {
                                                        const state = blockStates[stateName];
                                                        if (!state) {
                                                            return null;
                                                        }
                                                        return (
                                                            <div
                                                                key={stateName}
                                                                className="flex flex-col gap-1.5"
                                                            >
                                                                <Label className="text-xs capitalize">
                                                                    {state.name}
                                                                </Label>
                                                                <Select
                                                                    value={
                                                                        blockStateValues[
                                                                            stateName
                                                                        ] || ''
                                                                    }
                                                                    onValueChange={(value) => {
                                                                        setBlockStateValues({
                                                                            ...blockStateValues,
                                                                            [stateName]: value,
                                                                        });
                                                                    }}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {state.values.map(
                                                                            (value) => {
                                                                                return (
                                                                                    <SelectItem
                                                                                        key={value}
                                                                                        value={
                                                                                            value
                                                                                        }
                                                                                    >
                                                                                        {value}
                                                                                    </SelectItem>
                                                                                );
                                                                            },
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Fill Options</CardTitle>
                                        <CardDescription>
                                            Configure how the fill operates
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label>Fill Mode</Label>
                                            <Select value={fillMode} onValueChange={setFillMode}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fillModes.map((mode) => {
                                                        return (
                                                            <SelectItem
                                                                key={mode.id}
                                                                value={mode.id}
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span>{mode.name}</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {mode.description}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {fillMode === 'replace' && (
                                            <div className="flex flex-col gap-2">
                                                <Label>Replace Filter (Optional)</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="e.g., stone"
                                                    value={replaceFilter}
                                                    onChange={(e) => {
                                                        setReplaceFilter(e.target.value);
                                                    }}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Only replace blocks of this type
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="clone" className="mt-6 flex flex-col gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Source Region</CardTitle>
                                        <CardDescription>
                                            Define the region to copy from
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <CoordinateInput
                                            position={cloneFrom}
                                            onChange={setCloneFrom}
                                            label="Source From"
                                        />
                                        <CoordinateInput
                                            position={cloneTo}
                                            onChange={setCloneTo}
                                            label="Source To"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={swapCorners}
                                            className="w-full sm:w-auto"
                                        >
                                            <ArrowLeftRight className="size-4" />
                                            Swap Corners
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Destination</CardTitle>
                                        <CardDescription>
                                            Where to clone the region to
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <CoordinateInput
                                            position={cloneDest}
                                            onChange={setCloneDest}
                                            label="Destination"
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Clone Options</CardTitle>
                                        <CardDescription>
                                            Configure how the clone operates
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label>Clone Mode</Label>
                                            <Select value={cloneMode} onValueChange={setCloneMode}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {cloneModes.map((mode) => {
                                                        return (
                                                            <SelectItem
                                                                key={mode.id}
                                                                value={mode.id}
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span>{mode.name}</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {mode.description}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label>Clone Type</Label>
                                            <Select value={cloneType} onValueChange={setCloneType}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {cloneTypes.map((type) => {
                                                        return (
                                                            <SelectItem
                                                                key={type.id}
                                                                value={type.id}
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span>{type.name}</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {type.description}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {cloneMode === 'masked' && (
                                            <div className="flex flex-col gap-2">
                                                <Label>Filter Block (Optional)</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="e.g., stone"
                                                    value={filterBlock}
                                                    onChange={(e) => {
                                                        setFilterBlock(e.target.value);
                                                    }}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Only clone blocks of this type
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Box className="size-5" />
                                    Volume Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm text-muted-foreground">Total Blocks</p>
                                    <p className="text-2xl font-bold">
                                        {currentVolume.toLocaleString()}
                                    </p>
                                </div>
                                {currentVolume > 32768 && (
                                    <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm text-yellow-700 dark:text-yellow-400">
                                        <AlertTriangle className="size-4 shrink-0" />
                                        <div>
                                            <p className="font-semibold">Large Volume Warning</p>
                                            <p className="text-xs">
                                                This operation affects {currentVolume.toLocaleString()}{' '}
                                                blocks. It may cause lag.
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-muted-foreground">Dimensions</p>
                                    <p className="text-sm">
                                        {activeTab === 'fill'
                                            ? `${Math.abs(parseInt(fillTo.x) - parseInt(fillFrom.x) + 1)} × ${Math.abs(parseInt(fillTo.y) - parseInt(fillFrom.y) + 1)} × ${Math.abs(parseInt(fillTo.z) - parseInt(fillFrom.z) + 1)}`
                                            : `${Math.abs(parseInt(cloneTo.x) - parseInt(cloneFrom.x) + 1)} × ${Math.abs(parseInt(cloneTo.y) - parseInt(cloneFrom.y) + 1)} × ${Math.abs(parseInt(cloneTo.z) - parseInt(cloneFrom.z) + 1)}`}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Command Output</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="rounded-lg border bg-muted/50 p-3">
                                    <code className="break-all text-sm">{currentCommand}</code>
                                </div>
                                <Button onClick={copyCommand} className="w-full">
                                    <Copy className="size-4" />
                                    {copied ? 'Copied!' : 'Copy Command'}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Presets</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                {presets.map((preset) => {
                                    return (
                                        <Button
                                            key={preset.name}
                                            variant="outline"
                                            onClick={() => {
                                                applyPreset(preset.name);
                                            }}
                                            className="justify-start"
                                        >
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="text-sm font-medium">
                                                    {preset.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {preset.description}
                                                </span>
                                            </div>
                                        </Button>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
