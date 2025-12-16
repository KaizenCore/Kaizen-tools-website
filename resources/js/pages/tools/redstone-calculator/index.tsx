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
import {
    calculateComparatorSignal,
    calculateItemsForSignal,
    calculateSignalStrength,
    components,
    type Container,
    containers,
    pistonTimings,
    powerSources,
    tickToSeconds,
} from '@/data/redstone-data';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    Boxes,
    Cable,
    Clock,
    Info,
    Lightbulb,
    Repeat,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Redstone Calculator',
        href: '/tools/redstone-calculator',
    },
];

export default function RedstoneCalculator() {
    const [signalPower, setSignalPower] = useState<number>(15);
    const [signalDistance, setSignalDistance] = useState<number>(0);

    const [selectedContainer, setSelectedContainer] = useState<Container>(
        containers[0],
    );
    const [itemCount, setItemCount] = useState<number>(0);

    const [repeaterCount, setRepeaterCount] = useState<number>(1);
    const [repeaterDelay, setRepeaterDelay] = useState<number>(1);

    const resultingSignal = calculateSignalStrength(signalPower, signalDistance);
    const comparatorSignal = calculateComparatorSignal(
        itemCount,
        selectedContainer.slots,
        selectedContainer.stackSize,
    );
    const totalRepeaterDelay = repeaterCount * repeaterDelay;
    const totalRepeaterDelaySeconds = tickToSeconds(totalRepeaterDelay);

    const maxItems = selectedContainer.slots * selectedContainer.stackSize;

    const signalLevels = Array.from({ length: 15 }, (_, i) => i + 1).map(
        (level) => ({
            level,
            items: calculateItemsForSignal(
                level,
                selectedContainer.slots,
                selectedContainer.stackSize,
            ),
        }),
    );

    const wireVisualization = Array.from({ length: 15 }, (_, i) => {
        const distance = i;
        const strength = calculateSignalStrength(signalPower, distance);
        return { distance, strength };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Redstone Calculator" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Redstone Calculator</h1>
                    <p className="text-muted-foreground">
                        Calculate signal strengths, comparator outputs, and timing
                        for your redstone contraptions
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Cable className="size-5" />
                                    Signal Strength Calculator
                                </CardTitle>
                                <CardDescription>
                                    Calculate signal strength over distance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="signal-power">
                                        Initial Power Level (0-15)
                                    </Label>
                                    <Input
                                        id="signal-power"
                                        type="number"
                                        min="0"
                                        max="15"
                                        value={signalPower}
                                        onChange={(e) =>
                                            setSignalPower(
                                                Math.min(
                                                    15,
                                                    Math.max(
                                                        0,
                                                        parseInt(e.target.value) || 0,
                                                    ),
                                                ),
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="signal-distance">
                                        Distance (blocks)
                                    </Label>
                                    <Input
                                        id="signal-distance"
                                        type="number"
                                        min="0"
                                        max="15"
                                        value={signalDistance}
                                        onChange={(e) =>
                                            setSignalDistance(
                                                Math.min(
                                                    15,
                                                    Math.max(
                                                        0,
                                                        parseInt(e.target.value) || 0,
                                                    ),
                                                ),
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                                    <span className="font-semibold">
                                        Signal Strength at Destination
                                    </span>
                                    <span
                                        className={`text-2xl font-bold ${
                                            resultingSignal > 0
                                                ? 'text-[oklch(0.72_0.14_75)] dark:text-[oklch(0.75_0.15_75)]'
                                                : 'text-red-600 dark:text-red-400'
                                        }`}
                                    >
                                        {resultingSignal}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Signal Decay Visualization</Label>
                                    <div className="flex flex-col gap-1 rounded-lg border bg-[oklch(0.92_0.03_85)] p-3 dark:bg-[oklch(0.28_0.02_85)]">
                                        {wireVisualization.map((wire) => (
                                            <div
                                                key={wire.distance}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="w-12 text-xs text-muted-foreground">
                                                    {wire.distance}m
                                                </span>
                                                <div className="flex-1">
                                                    <div
                                                        className="h-2 rounded transition-all"
                                                        style={{
                                                            width: `${(wire.strength / 15) * 100}%`,
                                                            backgroundColor:
                                                                wire.strength > 0
                                                                    ? 'oklch(0.72 0.14 75)'
                                                                    : 'oklch(0.5 0.05 85)',
                                                        }}
                                                    />
                                                </div>
                                                <span className="w-8 text-xs font-medium">
                                                    {wire.strength}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {resultingSignal === 0 && signalDistance > 0 && (
                                    <div className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
                                        <AlertCircle className="size-5 shrink-0 text-yellow-700 dark:text-yellow-400" />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm">
                                                Signal is too weak! Use a repeater to
                                                boost the signal.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Boxes className="size-5" />
                                    Comparator Output Calculator
                                </CardTitle>
                                <CardDescription>
                                    Calculate comparator signal from container fullness
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="container-select">
                                        Container Type
                                    </Label>
                                    <Select
                                        value={selectedContainer.name}
                                        onValueChange={(value) => {
                                            const container = containers.find(
                                                (c) => c.name === value,
                                            );
                                            if (container) {
                                                setSelectedContainer(container);
                                                setItemCount(0);
                                            }
                                        }}
                                    >
                                        <SelectTrigger id="container-select">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {containers.map((container) => (
                                                <SelectItem
                                                    key={container.name}
                                                    value={container.name}
                                                >
                                                    {container.name} ({container.slots}{' '}
                                                    slots)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="item-count">
                                        Item Count (max {maxItems})
                                    </Label>
                                    <Input
                                        id="item-count"
                                        type="number"
                                        min="0"
                                        max={maxItems}
                                        value={itemCount}
                                        onChange={(e) =>
                                            setItemCount(
                                                Math.min(
                                                    maxItems,
                                                    Math.max(
                                                        0,
                                                        parseInt(e.target.value) || 0,
                                                    ),
                                                ),
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                                    <span className="font-semibold">
                                        Comparator Output
                                    </span>
                                    <span className="text-2xl font-bold text-[oklch(0.72_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                        {comparatorSignal}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                    <p>
                                        Fullness:{' '}
                                        {((itemCount / maxItems) * 100).toFixed(1)}%
                                    </p>
                                    <p>
                                        {itemCount} / {maxItems} items
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Items Needed for Each Signal Level</Label>
                                    <div className="grid max-h-48 grid-cols-3 gap-2 overflow-y-auto rounded-lg border bg-[oklch(0.92_0.03_85)] p-3 dark:bg-[oklch(0.28_0.02_85)]">
                                        {signalLevels.map((level) => (
                                            <div
                                                key={level.level}
                                                className={`flex items-center justify-between rounded p-2 text-sm ${
                                                    comparatorSignal === level.level
                                                        ? 'bg-[oklch(0.72_0.14_75)]/20 font-semibold'
                                                        : ''
                                                }`}
                                            >
                                                <span className="text-muted-foreground">
                                                    {level.level}:
                                                </span>
                                                <span>{level.items}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Repeat className="size-5" />
                                    Repeater Timing Calculator
                                </CardTitle>
                                <CardDescription>
                                    Calculate total delay from repeater chain
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="repeater-count">
                                        Number of Repeaters
                                    </Label>
                                    <Input
                                        id="repeater-count"
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={repeaterCount}
                                        onChange={(e) =>
                                            setRepeaterCount(
                                                Math.max(
                                                    1,
                                                    parseInt(e.target.value) || 1,
                                                ),
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="repeater-delay">
                                        Delay per Repeater (1-4 ticks)
                                    </Label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4].map((delay) => (
                                            <Button
                                                key={delay}
                                                variant={
                                                    repeaterDelay === delay
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                onClick={() => setRepeaterDelay(delay)}
                                                className="flex-1"
                                            >
                                                {delay}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                                        <span className="font-semibold">
                                            Total Delay
                                        </span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-2xl font-bold text-[oklch(0.72_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                                {totalRepeaterDelay} ticks
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {totalRepeaterDelaySeconds.toFixed(2)}s
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                                    <Info className="size-5 shrink-0 text-blue-700 dark:text-blue-400" />
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm">
                                            20 ticks = 1 second in Minecraft. Each
                                            repeater can add 1-4 ticks of delay.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="size-5" />
                                    Piston Timing Reference
                                </CardTitle>
                                <CardDescription>
                                    Standard piston behavior timings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                                    <span className="font-medium">Extension Time</span>
                                    <div className="flex flex-col items-end">
                                        <span className="font-semibold">
                                            {pistonTimings.extension.ticks} ticks
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {pistonTimings.extension.seconds}s
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                                    <span className="font-medium">Retraction Time</span>
                                    <div className="flex flex-col items-end">
                                        <span className="font-semibold">
                                            {pistonTimings.retraction.ticks} ticks
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {pistonTimings.retraction.seconds}s
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                                    <span className="font-medium">BUD Delay</span>
                                    <div className="flex flex-col items-end">
                                        <span className="font-semibold">
                                            {pistonTimings.budDelay.ticks} ticks
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {pistonTimings.budDelay.seconds}s
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                                    <Info className="size-5 shrink-0 text-blue-700 dark:text-blue-400" />
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm">
                                            Pistons take 1.5 redstone ticks (3 game
                                            ticks) to extend or retract. BUD
                                            (Block Update Detector) mechanics use a
                                            2-tick delay.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="size-5" />
                                    Power Sources
                                </CardTitle>
                                <CardDescription>
                                    Common redstone power sources and their strengths
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2">
                                    {powerSources.map((source) => (
                                        <div
                                            key={source.name}
                                            className="flex items-start justify-between rounded-lg border bg-card p-3"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium">
                                                    {source.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {source.description}
                                                </span>
                                            </div>
                                            <span className="text-lg font-semibold text-[oklch(0.72_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                                {source.strength}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="size-5" />
                                    Component Behaviors
                                </CardTitle>
                                <CardDescription>
                                    How redstone components work
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2">
                                    {components.map((component) => (
                                        <div
                                            key={component.name}
                                            className="flex flex-col gap-1 rounded-lg border bg-card p-3"
                                        >
                                            <span className="font-medium">
                                                {component.name}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {component.behavior}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="size-5" />
                                    Quick Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-semibold">
                                            Signal Decay
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Redstone wire loses 1 signal strength per
                                            block. Use repeaters every 15 blocks to
                                            maintain full strength.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-semibold">
                                            Comparator Modes
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Comparators have two modes: Compare (front
                                            torch off) and Subtract (front torch on).
                                            Click to toggle.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-semibold">
                                            Instant vs Delayed
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Redstone torches, comparators, and repeaters
                                            add delays. Direct power transfer is
                                            instant.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-semibold">
                                            Powering vs Activating
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Blocks can be "powered" (receive signal) or
                                            "activated" (directly connected). This
                                            affects how signals propagate.
                                        </p>
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
