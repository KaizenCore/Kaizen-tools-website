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
    calculateEffectiveLightLevel,
    calculateMobCap,
    canMobSpawnAtLight,
    getMobsByCategory,
    getMobsByDimension,
    lightSources,
    type MobData,
    mobs,
    spawnProofBlocks,
} from '@/data/mob-spawning-data';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Ghost, Lightbulb, Moon, Shield, Sun, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Mob Spawning Calculator',
        href: '/tools/mob-spawning',
    },
];

export default function MobSpawningCalculator() {
    const [blockLight, setBlockLight] = useState<string>('0');
    const [skyLight, setSkyLight] = useState<string>('15');
    const [timeOfDay, setTimeOfDay] = useState<string>('13000');
    const [selectedMob, setSelectedMob] = useState<string>('zombie');
    const [chunksInRange, setChunksInRange] = useState<string>('289');

    const getEffectiveLight = (): number => {
        const block = Number(blockLight) || 0;
        const sky = Number(skyLight) || 0;
        const time = Number(timeOfDay) || 0;
        return calculateEffectiveLightLevel(block, sky, time);
    };

    const getMobsCanSpawn = (): MobData[] => {
        const effectiveLight = getEffectiveLight();
        return mobs.filter((mob) => canMobSpawnAtLight(mob, effectiveLight));
    };

    const getSelectedMobData = (): MobData | undefined => {
        return mobs.find((mob) => mob.id === selectedMob);
    };

    const getMobCapResults = (): {
        hostile: number;
        passive: number;
        water: number;
        ambient: number;
    } => {
        const chunks = Number(chunksInRange) || 0;
        return {
            hostile: calculateMobCap(chunks, 'hostile'),
            passive: calculateMobCap(chunks, 'passive'),
            water: calculateMobCap(chunks, 'water'),
            ambient: calculateMobCap(chunks, 'ambient'),
        };
    };

    const formatNumber = (num: number): string => {
        return num.toLocaleString();
    };

    const groupedLightSources = lightSources.reduce(
        (acc, source) => {
            if (!acc[source.category]) {
                acc[source.category] = [];
            }
            acc[source.category].push(source);
            return acc;
        },
        {} as Record<string, typeof lightSources>,
    );

    const mobData = getSelectedMobData();
    const effectiveLightLevel = getEffectiveLight();
    const mobsCanSpawn = getMobsCanSpawn();
    const mobCapResults = getMobCapResults();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mob Spawning Calculator" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Minecraft Mob Spawning Calculator</h1>
                    <p className="text-muted-foreground">
                        Calculate mob spawning conditions, light levels, and spawn rates
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-[oklch(0.72_0.14_75)] bg-gradient-to-br from-[oklch(0.72_0.14_75)]/10 to-transparent dark:border-[oklch(0.75_0.15_75)]/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[oklch(0.55_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                <Sun className="size-5" />
                                Light Level Calculator
                            </CardTitle>
                            <CardDescription>
                                Calculate effective light level and spawnable mobs
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="block-light">Block Light (0-15)</Label>
                                    <Input
                                        id="block-light"
                                        type="number"
                                        min="0"
                                        max="15"
                                        value={blockLight}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const num = Number(value);
                                            if (
                                                value === '' ||
                                                (!isNaN(num) && num >= 0 && num <= 15)
                                            ) {
                                                setBlockLight(value);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="sky-light">Sky Light (0-15)</Label>
                                    <Input
                                        id="sky-light"
                                        type="number"
                                        min="0"
                                        max="15"
                                        value={skyLight}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const num = Number(value);
                                            if (
                                                value === '' ||
                                                (!isNaN(num) && num >= 0 && num <= 15)
                                            ) {
                                                setSkyLight(value);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="time-of-day">Time of Day (0-24000)</Label>
                                <Input
                                    id="time-of-day"
                                    type="number"
                                    min="0"
                                    max="24000"
                                    value={timeOfDay}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const num = Number(value);
                                        if (
                                            value === '' ||
                                            (!isNaN(num) && num >= 0 && num <= 24000)
                                        ) {
                                            setTimeOfDay(value);
                                        }
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    0=Dawn, 6000=Noon, 13000=Dusk, 18000=Midnight
                                </p>
                            </div>

                            <div className="rounded-lg border border-[oklch(0.72_0.14_75)]/20 bg-[oklch(0.72_0.14_75)]/10 p-4 dark:border-[oklch(0.75_0.15_75)]/20">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-[oklch(0.55_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                            Effective Light Level
                                        </p>
                                        <p className="text-3xl font-bold text-[oklch(0.55_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                            {effectiveLightLevel}
                                        </p>
                                    </div>

                                    <div className="h-3 overflow-hidden rounded-full bg-[oklch(0.23_0.02_85)] dark:bg-[oklch(0.87_0.04_85)]/20">
                                        <div
                                            className="h-full bg-gradient-to-r from-[oklch(0.55_0.14_75)] to-[oklch(0.75_0.15_75)] transition-all duration-300"
                                            style={{
                                                width: `${(effectiveLightLevel / 15) * 100}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs font-medium text-[oklch(0.55_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                            Hostile mobs can spawn:{' '}
                                            {effectiveLightLevel <= 7 ? 'YES' : 'NO'}
                                        </p>
                                        <p className="text-xs font-medium text-[oklch(0.55_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                            Passive mobs can spawn:{' '}
                                            {effectiveLightLevel >= 9 ? 'YES' : 'NO'}
                                        </p>
                                    </div>

                                    <div className="mt-2">
                                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                                            {mobsCanSpawn.length} mob types can spawn at this light
                                            level
                                        </p>
                                        <div className="flex max-h-32 flex-col gap-1 overflow-y-auto">
                                            {mobsCanSpawn.slice(0, 10).map((mob) => (
                                                <span
                                                    key={mob.id}
                                                    className="text-xs text-muted-foreground"
                                                >
                                                    • {mob.name} ({mob.category})
                                                </span>
                                            ))}
                                            {mobsCanSpawn.length > 10 && (
                                                <span className="text-xs text-muted-foreground">
                                                    ... and {mobsCanSpawn.length - 10} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent dark:border-purple-500/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                                <Ghost className="size-5" />
                                Spawn Conditions Checker
                            </CardTitle>
                            <CardDescription>
                                View detailed spawn requirements for any mob
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="mob-select">Select Mob</Label>
                                <Select value={selectedMob} onValueChange={setSelectedMob}>
                                    <SelectTrigger id="mob-select">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['hostile', 'passive', 'neutral', 'water', 'ambient'].map(
                                            (category) => {
                                                const categoryMobs = getMobsByCategory(
                                                    category as MobData['category'],
                                                );
                                                return (
                                                    <div key={category}>
                                                        <div className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground">
                                                            {category}
                                                        </div>
                                                        {categoryMobs.map((mob) => (
                                                            <SelectItem
                                                                key={mob.id}
                                                                value={mob.id}
                                                            >
                                                                {mob.name}
                                                            </SelectItem>
                                                        ))}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {mobData && (
                                <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <h4 className="mb-1 font-semibold text-purple-700 dark:text-purple-400">
                                                {mobData.name}
                                            </h4>
                                            <p className="text-xs capitalize text-muted-foreground">
                                                Category: {mobData.category}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-2 text-sm">
                                            <div>
                                                <span className="font-medium">Light Level: </span>
                                                {mobData.minLightLevel !== null &&
                                                mobData.maxLightLevel !== null
                                                    ? `${mobData.minLightLevel}-${mobData.maxLightLevel}`
                                                    : mobData.minLightLevel !== null
                                                      ? `≥${mobData.minLightLevel}`
                                                      : mobData.maxLightLevel !== null
                                                        ? `≤${mobData.maxLightLevel}`
                                                        : 'Any'}
                                            </div>

                                            <div>
                                                <span className="font-medium">Dimensions: </span>
                                                {mobData.dimensions
                                                    .map(
                                                        (d) =>
                                                            d.charAt(0).toUpperCase() + d.slice(1),
                                                    )
                                                    .join(', ')}
                                            </div>

                                            <div>
                                                <span className="font-medium">Spawn Blocks: </span>
                                                {mobData.spawnBlocks.join(', ')}
                                            </div>

                                            <div>
                                                <span className="font-medium">Biomes: </span>
                                                <div className="mt-1 flex max-h-20 flex-col gap-1 overflow-y-auto text-xs text-muted-foreground">
                                                    {mobData.biomes.map((biome, idx) => (
                                                        <span key={idx}>• {biome}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            {mobData.additionalConditions.length > 0 && (
                                                <div>
                                                    <span className="font-medium">
                                                        Additional Conditions:
                                                    </span>
                                                    <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
                                                        {mobData.additionalConditions.map(
                                                            (condition, idx) => (
                                                                <span key={idx}>
                                                                    • {condition}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent dark:border-blue-500/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <Users className="size-5" />
                            Mob Cap Calculator
                        </CardTitle>
                        <CardDescription>
                            Calculate mob caps based on loaded chunks
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="chunks-in-range">
                                Chunks in Range (default: 289 for 17x17)
                            </Label>
                            <Input
                                id="chunks-in-range"
                                type="number"
                                min="1"
                                value={chunksInRange}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const num = Number(value);
                                    if (value === '' || (!isNaN(num) && num >= 0)) {
                                        setChunksInRange(value);
                                    }
                                }}
                            />
                            <p className="text-xs text-muted-foreground">
                                Formula: mobCap = constant × chunksInRange / 289
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                    Hostile
                                </h3>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                                    {formatNumber(mobCapResults.hostile)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Constant: 70
                                </p>
                            </div>

                            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                    Passive
                                </h3>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                                    {formatNumber(mobCapResults.passive)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Constant: 10
                                </p>
                            </div>

                            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                    Water
                                </h3>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                    {formatNumber(mobCapResults.water)}
                                </p>
                                <p className="text-xs text-muted-foreground">Constant: 5</p>
                            </div>

                            <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
                                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                    Ambient
                                </h3>
                                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                                    {formatNumber(mobCapResults.ambient)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Constant: 15
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg border p-4">
                            <h4 className="mb-2 font-semibold">Understanding Mob Caps</h4>
                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                <p>
                                    Mob caps limit how many mobs can spawn in loaded chunks around
                                    players. When the cap is reached, no more mobs of that category
                                    will spawn until some are removed.
                                </p>
                                <p>
                                    The default 289 chunks represents a 17×17 chunk area (simulation
                                    distance). Mob spawning is checked in a 128-block sphere around
                                    each player.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="size-5" />
                                Light Sources Reference
                            </CardTitle>
                            <CardDescription>
                                Common light sources and their levels
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {Object.entries(groupedLightSources).map(
                                    ([category, sources]) => (
                                        <div key={category} className="flex flex-col gap-2">
                                            <h3 className="font-semibold text-primary">
                                                {category}
                                            </h3>
                                            <div className="flex flex-col gap-1">
                                                {sources.map((source, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between rounded-md border px-3 py-2"
                                                    >
                                                        <span className="text-sm">
                                                            {source.name}
                                                        </span>
                                                        <span className="text-sm font-medium text-[oklch(0.55_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                                            {source.lightLevel}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="size-5" />
                                Spawn-Proofing Guide
                            </CardTitle>
                            <CardDescription>
                                Blocks and techniques to prevent mob spawning
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                {spawnProofBlocks.map((block, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col gap-1 rounded-md border p-3"
                                    >
                                        <span className="text-sm font-medium">{block.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {block.description}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-lg border border-[oklch(0.72_0.14_75)]/20 bg-[oklch(0.72_0.14_75)]/10 p-4 dark:border-[oklch(0.75_0.15_75)]/20">
                                <h4 className="mb-2 font-semibold text-[oklch(0.55_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                    Key Tips
                                </h4>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                    <p>
                                        • Light level 8+ prevents hostile mob spawning (most common
                                        method)
                                    </p>
                                    <p>
                                        • Torches every 12 blocks creates safe zones (light level
                                        14)
                                    </p>
                                    <p>
                                        • Slabs, stairs, and glass are transparent blocks - mobs
                                        won't spawn on them
                                    </p>
                                    <p>
                                        • Carpets and buttons are decoration blocks - prevent
                                        spawning but allow walking
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Moon className="size-5" />
                            Mob Spawning Mechanics
                        </CardTitle>
                        <CardDescription>
                            Understanding how mob spawning works in Minecraft
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-3">
                                <h4 className="font-semibold">Light Level Rules</h4>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                    <p>
                                        <strong>Hostile Mobs:</strong> Light level ≤ 7 (most mobs)
                                    </p>
                                    <p>
                                        <strong>Passive Mobs:</strong> Light level ≥ 9 (most mobs)
                                    </p>
                                    <p>
                                        <strong>Neutral Mobs:</strong> Varies by mob type
                                    </p>
                                    <p>
                                        Effective light = max(block light, sky light - time
                                        reduction)
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h4 className="font-semibold">Spawning Algorithm</h4>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                    <p>
                                        1. Game randomly selects a chunk within 128 blocks of player
                                    </p>
                                    <p>2. Picks random position within chunk to spawn mob</p>
                                    <p>
                                        3. Checks light level, block type, and mob-specific
                                        conditions
                                    </p>
                                    <p>
                                        4. If all conditions met and cap not reached, mob spawns
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h4 className="font-semibold">Spawn Range</h4>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                    <p>
                                        <strong>Minimum Distance:</strong> 24 blocks from any player
                                    </p>
                                    <p>
                                        <strong>Maximum Distance:</strong> 128 blocks from any
                                        player (spherical)
                                    </p>
                                    <p>
                                        <strong>Despawn Distance:</strong> 128+ blocks (instant at
                                        128+, chance at 32+)
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h4 className="font-semibold">Special Conditions</h4>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                    <p>
                                        <strong>Slimes:</strong> Spawn in slime chunks (Y &lt; 40)
                                        or swamps
                                    </p>
                                    <p>
                                        <strong>Phantoms:</strong> Require 3+ days without sleep
                                    </p>
                                    <p>
                                        <strong>Water Mobs:</strong> Check water depth and biome
                                        type
                                    </p>
                                    <p>
                                        <strong>Nether Mobs:</strong> Different light and block
                                        requirements
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border p-4">
                            <h4 className="mb-2 font-semibold">Spawn Cycle</h4>
                            <p className="text-sm text-muted-foreground">
                                Minecraft attempts to spawn mobs every game tick (1/20th of a
                                second) for each eligible chunk. The game checks mob caps first,
                                then randomly selects positions and validates conditions. Hostile
                                mobs spawn more frequently than passive mobs, which mostly spawn
                                during world generation. Understanding these mechanics helps create
                                efficient mob farms and spawn-proof areas.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
