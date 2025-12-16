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
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    commonBlocks,
    commonItems,
    particleCategories,
    particles,
    presets,
} from '@/data/particle-data';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Check, Copy, RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Particle Generator',
        href: '/tools/particle-generator',
    },
];

type CoordinateType = 'absolute' | 'relative' | 'local';

interface SpecialParams {
    r?: string;
    g?: string;
    b?: string;
    size?: string;
    fromR?: string;
    fromG?: string;
    fromB?: string;
    toR?: string;
    toG?: string;
    toB?: string;
    block?: string;
    item?: string;
    roll?: string;
    delay?: string;
}

export default function ParticleGenerator() {
    const [selectedParticle, setSelectedParticle] = useState('flame');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [coordinateType, setCoordinateType] = useState<CoordinateType>('relative');
    const [x, setX] = useState('0');
    const [y, setY] = useState('1');
    const [z, setZ] = useState('0');
    const [dx, setDx] = useState('0.5');
    const [dy, setDy] = useState('0.5');
    const [dz, setDz] = useState('0.5');
    const [speed, setSpeed] = useState('1');
    const [count, setCount] = useState('10');
    const [forceMode, setForceMode] = useState(false);
    const [viewer, setViewer] = useState('@a');
    const [specialParams, setSpecialParams] = useState<SpecialParams>({
        r: '1',
        g: '0',
        b: '0',
        size: '1',
    });
    const [copied, setCopied] = useState(false);

    const filteredParticles = particles.filter((particle) => {
        const matchesCategory =
            selectedCategory === 'All' ||
            particle.category === selectedCategory;
        const matchesSearch = particle.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const currentParticle = particles.find((p) => p.id === selectedParticle);

    const getCoordinatePrefix = () => {
        if (coordinateType === 'relative') {
            return '~';
        }

        if (coordinateType === 'local') {
            return '^';
        }

        return '';
    };

    const generateCommand = () => {
        const prefix = getCoordinatePrefix();
        const position = `${prefix}${x} ${prefix}${y} ${prefix}${z}`;
        let particleName = selectedParticle;

        if (currentParticle?.specialParams) {
            const { type } = currentParticle.specialParams;

            if (type === 'dust') {
                particleName = `${selectedParticle}{color:[${specialParams.r || 1},${specialParams.g || 0},${specialParams.b || 0}],scale:${specialParams.size || 1}}`;
            } else if (type === 'dust_color_transition') {
                particleName = `${selectedParticle}{from_color:[${specialParams.fromR || 1},${specialParams.fromG || 0},${specialParams.fromB || 0}],to_color:[${specialParams.toR || 0},${specialParams.toG || 0},${specialParams.toB || 1}],scale:${specialParams.size || 1}}`;
            } else if (
                type === 'block' ||
                type === 'block_marker' ||
                type === 'falling_dust'
            ) {
                particleName = `${selectedParticle}{block_state:"${specialParams.block || 'minecraft:stone'}"}`;
            } else if (type === 'item') {
                particleName = `${selectedParticle}{item:"${specialParams.item || 'minecraft:diamond'}"}`;
            } else if (type === 'sculk_charge') {
                particleName = `${selectedParticle}{roll:${specialParams.roll || 0}}`;
            } else if (type === 'shriek') {
                particleName = `${selectedParticle}{delay:${specialParams.delay || 0}}`;
            } else if (type === 'vibration') {
                particleName = selectedParticle;
            }
        }

        const delta = `${dx} ${dy} ${dz}`;
        const mode = forceMode ? 'force' : 'normal';

        return `/particle ${particleName} ${position} ${delta} ${speed} ${count} ${mode} ${viewer}`;
    };

    const copyCommand = async () => {
        const command = generateCommand();
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const reset = () => {
        setSelectedParticle('flame');
        setSelectedCategory('All');
        setSearchQuery('');
        setCoordinateType('relative');
        setX('0');
        setY('1');
        setZ('0');
        setDx('0.5');
        setDy('0.5');
        setDz('0.5');
        setSpeed('1');
        setCount('10');
        setForceMode(false);
        setViewer('@a');
        setSpecialParams({
            r: '1',
            g: '0',
            b: '0',
            size: '1',
        });
    };

    const loadPreset = (preset: (typeof presets)[0]) => {
        setSelectedParticle(preset.particle);
        setX(preset.x.replace(/[~^]/g, ''));
        setY(preset.y.replace(/[~^]/g, ''));
        setZ(preset.z.replace(/[~^]/g, ''));
        setDx(preset.dx);
        setDy(preset.dy);
        setDz(preset.dz);
        setSpeed(preset.speed);
        setCount(preset.count);
        setForceMode(preset.mode === 'force');
        setViewer(preset.viewer);

        if (preset.x.startsWith('~')) {
            setCoordinateType('relative');
        } else if (preset.x.startsWith('^')) {
            setCoordinateType('local');
        } else {
            setCoordinateType('absolute');
        }

        if ('specialParams' in preset && preset.specialParams) {
            setSpecialParams(preset.specialParams as SpecialParams);
        }
    };

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: Math.round((Number.parseInt(result[1], 16) / 255) * 100) / 100,
                  g: Math.round((Number.parseInt(result[2], 16) / 255) * 100) / 100,
                  b: Math.round((Number.parseInt(result[3], 16) / 255) * 100) / 100,
              }
            : { r: 1, g: 0, b: 0 };
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rgb = hexToRgb(e.target.value);
        setSpecialParams({
            ...specialParams,
            r: rgb.r.toString(),
            g: rgb.g.toString(),
            b: rgb.b.toString(),
        });
    };

    const handleFromColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rgb = hexToRgb(e.target.value);
        setSpecialParams({
            ...specialParams,
            fromR: rgb.r.toString(),
            fromG: rgb.g.toString(),
            fromB: rgb.b.toString(),
        });
    };

    const handleToColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rgb = hexToRgb(e.target.value);
        setSpecialParams({
            ...specialParams,
            toR: rgb.r.toString(),
            toG: rgb.g.toString(),
            toB: rgb.b.toString(),
        });
    };

    const renderSpecialParams = () => {
        if (!currentParticle?.specialParams) {
            return null;
        }

        const { type } = currentParticle.specialParams;

        if (type === 'dust') {
            return (
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="dust-color">Color</Label>
                        <Input
                            id="dust-color"
                            type="color"
                            onChange={handleColorChange}
                            className="h-10 w-full"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                            RGB: {specialParams.r || 1}, {specialParams.g || 0},{' '}
                            {specialParams.b || 0}
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="dust-size">
                            Size: {specialParams.size || 1}
                        </Label>
                        <Slider
                            id="dust-size"
                            min={0.01}
                            max={4}
                            step={0.01}
                            value={[Number.parseFloat(specialParams.size || '1')]}
                            onValueChange={(value) =>
                                setSpecialParams({
                                    ...specialParams,
                                    size: value[0].toString(),
                                })
                            }
                        />
                    </div>
                </div>
            );
        }

        if (type === 'dust_color_transition') {
            return (
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="from-color">From Color</Label>
                        <Input
                            id="from-color"
                            type="color"
                            onChange={handleFromColorChange}
                            className="h-10 w-full"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                            RGB: {specialParams.fromR || 1},{' '}
                            {specialParams.fromG || 0},{' '}
                            {specialParams.fromB || 0}
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="to-color">To Color</Label>
                        <Input
                            id="to-color"
                            type="color"
                            onChange={handleToColorChange}
                            className="h-10 w-full"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                            RGB: {specialParams.toR || 0},{' '}
                            {specialParams.toG || 0}, {specialParams.toB || 1}
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="transition-size">
                            Size: {specialParams.size || 1}
                        </Label>
                        <Slider
                            id="transition-size"
                            min={0.01}
                            max={4}
                            step={0.01}
                            value={[Number.parseFloat(specialParams.size || '1')]}
                            onValueChange={(value) =>
                                setSpecialParams({
                                    ...specialParams,
                                    size: value[0].toString(),
                                })
                            }
                        />
                    </div>
                </div>
            );
        }

        if (
            type === 'block' ||
            type === 'block_marker' ||
            type === 'falling_dust'
        ) {
            return (
                <div className="space-y-2">
                    <Label htmlFor="block-type">Block Type</Label>
                    <Select
                        value={specialParams.block || 'minecraft:stone'}
                        onValueChange={(value) =>
                            setSpecialParams({ ...specialParams, block: value })
                        }
                    >
                        <SelectTrigger id="block-type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {commonBlocks.map((block) => (
                                <SelectItem key={block} value={block}>
                                    {block.replace('minecraft:', '')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );
        }

        if (type === 'item') {
            return (
                <div className="space-y-2">
                    <Label htmlFor="item-type">Item Type</Label>
                    <Select
                        value={specialParams.item || 'minecraft:diamond'}
                        onValueChange={(value) =>
                            setSpecialParams({ ...specialParams, item: value })
                        }
                    >
                        <SelectTrigger id="item-type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {commonItems.map((item) => (
                                <SelectItem key={item} value={item}>
                                    {item.replace('minecraft:', '')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );
        }

        if (type === 'sculk_charge') {
            return (
                <div className="space-y-2">
                    <Label htmlFor="roll">Roll</Label>
                    <Input
                        id="roll"
                        type="number"
                        value={specialParams.roll || '0'}
                        onChange={(e) =>
                            setSpecialParams({
                                ...specialParams,
                                roll: e.target.value,
                            })
                        }
                        step="0.1"
                    />
                </div>
            );
        }

        if (type === 'shriek') {
            return (
                <div className="space-y-2">
                    <Label htmlFor="delay">Delay (ticks)</Label>
                    <Input
                        id="delay"
                        type="number"
                        value={specialParams.delay || '0'}
                        onChange={(e) =>
                            setSpecialParams({
                                ...specialParams,
                                delay: e.target.value,
                            })
                        }
                        min="0"
                    />
                </div>
            );
        }

        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Particle Generator" />

            <div className="mx-auto max-w-screen-2xl p-4 sm:p-6">
                <div className="mb-6 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Minecraft Particle Command Generator
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Create custom particle effects with full control over
                        position, spread, and appearance
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Particle</CardTitle>
                                <CardDescription>
                                    Choose from {particles.length}+ particle
                                    types
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search particles..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {particleCategories.map((category) => (
                                        <Button
                                            key={category}
                                            variant={
                                                selectedCategory === category
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() =>
                                                setSelectedCategory(category)
                                            }
                                        >
                                            {category}
                                        </Button>
                                    ))}
                                </div>

                                <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border p-2">
                                    {filteredParticles.map((particle) => (
                                        <button
                                            key={particle.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedParticle(particle.id)
                                            }
                                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                                            style={{
                                                backgroundColor:
                                                    selectedParticle ===
                                                    particle.id
                                                        ? 'hsl(var(--accent))'
                                                        : undefined,
                                            }}
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {particle.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {particle.category}
                                                </div>
                                            </div>
                                            {selectedParticle ===
                                                particle.id && (
                                                <Check className="size-4 text-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label>Coordinate Type</Label>
                                        <div className="mt-2 flex gap-2">
                                            <Button
                                                variant={
                                                    coordinateType === 'absolute'
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    setCoordinateType('absolute')
                                                }
                                            >
                                                Absolute
                                            </Button>
                                            <Button
                                                variant={
                                                    coordinateType === 'relative'
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    setCoordinateType('relative')
                                                }
                                            >
                                                Relative (~)
                                            </Button>
                                            <Button
                                                variant={
                                                    coordinateType === 'local'
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    setCoordinateType('local')
                                                }
                                            >
                                                Local (^)
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="x">X Position</Label>
                                            <Input
                                                id="x"
                                                type="number"
                                                value={x}
                                                onChange={(e) => setX(e.target.value)}
                                                step="0.1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="y">Y Position</Label>
                                            <Input
                                                id="y"
                                                type="number"
                                                value={y}
                                                onChange={(e) => setY(e.target.value)}
                                                step="0.1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="z">Z Position</Label>
                                            <Input
                                                id="z"
                                                type="number"
                                                value={z}
                                                onChange={(e) => setZ(e.target.value)}
                                                step="0.1"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="dx">Delta X</Label>
                                            <Input
                                                id="dx"
                                                type="number"
                                                value={dx}
                                                onChange={(e) => setDx(e.target.value)}
                                                step="0.1"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="dy">Delta Y</Label>
                                            <Input
                                                id="dy"
                                                type="number"
                                                value={dy}
                                                onChange={(e) => setDy(e.target.value)}
                                                step="0.1"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="dz">Delta Z</Label>
                                            <Input
                                                id="dz"
                                                type="number"
                                                value={dz}
                                                onChange={(e) => setDz(e.target.value)}
                                                step="0.1"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="speed">Speed</Label>
                                            <Input
                                                id="speed"
                                                type="number"
                                                value={speed}
                                                onChange={(e) =>
                                                    setSpeed(e.target.value)
                                                }
                                                step="0.1"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="count">Count</Label>
                                            <Input
                                                id="count"
                                                type="number"
                                                value={count}
                                                onChange={(e) =>
                                                    setCount(e.target.value)
                                                }
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Label htmlFor="viewer">Viewer</Label>
                                            <Select
                                                value={viewer}
                                                onValueChange={setViewer}
                                            >
                                                <SelectTrigger id="viewer">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="@a">
                                                        All Players (@a)
                                                    </SelectItem>
                                                    <SelectItem value="@p">
                                                        Nearest Player (@p)
                                                    </SelectItem>
                                                    <SelectItem value="@s">
                                                        Self (@s)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center gap-2 pt-6">
                                            <Label htmlFor="force-mode">
                                                Force Mode
                                            </Label>
                                            <input
                                                id="force-mode"
                                                type="checkbox"
                                                checked={forceMode}
                                                onChange={(e) =>
                                                    setForceMode(e.target.checked)
                                                }
                                                className="size-4 rounded border-input"
                                            />
                                        </div>
                                    </div>

                                    {renderSpecialParams()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Command Output</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                                    <code className="block break-all font-mono text-xs">
                                        {generateCommand()}
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Presets</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {presets.map((preset, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => loadPreset(preset)}
                                        className="flex w-full flex-col gap-1 rounded-lg border p-3 text-left transition-colors hover:bg-muted"
                                    >
                                        <div className="font-medium">
                                            {preset.name}
                                        </div>
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
                                    <strong className="text-foreground">
                                        1. Choose a particle
                                    </strong>
                                    <p>
                                        Search or filter by category to find the
                                        perfect particle effect.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <strong className="text-foreground">
                                        2. Set position and spread
                                    </strong>
                                    <p>
                                        Use coordinates for position and delta
                                        values to control the spread area.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <strong className="text-foreground">
                                        3. Adjust properties
                                    </strong>
                                    <p>
                                        Configure speed, count, and special
                                        parameters like color or block type.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <strong className="text-foreground">
                                        4. Copy and use
                                    </strong>
                                    <p>
                                        Click Copy and paste the command in your
                                        Minecraft command block or chat.
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
