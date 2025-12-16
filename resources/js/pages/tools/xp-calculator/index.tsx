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
import { OutputPanel, ToolLayout, ToolSection } from '@/components/tool-layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calculator, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'XP Calculator',
        href: '/tools/xp-calculator',
    },
];

interface XPSource {
    name: string;
    xp: string;
    category: string;
}

const xpSources: XPSource[] = [
    { name: 'Zombie', xp: '5', category: 'Hostile Mobs' },
    { name: 'Skeleton', xp: '5', category: 'Hostile Mobs' },
    { name: 'Creeper', xp: '5', category: 'Hostile Mobs' },
    { name: 'Spider', xp: '5', category: 'Hostile Mobs' },
    { name: 'Enderman', xp: '5', category: 'Hostile Mobs' },
    { name: 'Blaze', xp: '10', category: 'Hostile Mobs' },
    { name: 'Witch', xp: '5', category: 'Hostile Mobs' },
    { name: 'Ender Dragon', xp: '12,000', category: 'Bosses' },
    { name: 'Wither', xp: '50', category: 'Bosses' },
    { name: 'Elder Guardian', xp: '10', category: 'Hostile Mobs' },
    { name: 'Coal Ore', xp: '0-2', category: 'Mining' },
    { name: 'Lapis Lazuli Ore', xp: '2-5', category: 'Mining' },
    { name: 'Redstone Ore', xp: '1-5', category: 'Mining' },
    { name: 'Diamond Ore', xp: '3-7', category: 'Mining' },
    { name: 'Emerald Ore', xp: '3-7', category: 'Mining' },
    { name: 'Nether Quartz Ore', xp: '2-5', category: 'Mining' },
    { name: 'Nether Gold Ore', xp: '0-1', category: 'Mining' },
    { name: 'Breeding Animals', xp: '1-7', category: 'Other' },
    { name: 'Fishing', xp: '1-6', category: 'Other' },
    { name: 'Trading', xp: '3-6', category: 'Other' },
    { name: 'Smelting', xp: 'Varies', category: 'Other' },
];

export default function XpCalculator() {
    const [levelToXp, setLevelToXp] = useState<string>('');
    const [xpToLevel, setXpToLevel] = useState<string>('');
    const [currentLevel, setCurrentLevel] = useState<string>('');
    const [targetLevel, setTargetLevel] = useState<string>('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const levelParam = params.get('level');

        if (levelParam && !isNaN(Number(levelParam)) && Number(levelParam) >= 0) {
            setLevelToXp(levelParam);
        }
    }, []);

    const calculateXpForLevel = (level: number): number => {
        if (level <= 16) {
            return level * level + 6 * level;
        }
        if (level <= 31) {
            return Math.floor(2.5 * level * level - 40.5 * level + 360);
        }
        return Math.floor(4.5 * level * level - 162.5 * level + 2220);
    };

    const calculateTotalXpToLevel = (level: number): number => {
        if (level <= 16) {
            return Math.floor((level * level * level) / 3 + 3 * level * level + (10 * level) / 3);
        }
        if (level <= 31) {
            return Math.floor(
                (5 * level * level * level) / 6 - (81 * level * level) / 4 + 1087 * level / 6 - 112,
            );
        }
        return Math.floor(
            (3 * level * level * level) / 2 - (325 * level * level) / 4 + 9275 * level / 6 - 2220,
        );
    };

    const calculateLevelFromXp = (xp: number): number => {
        let level = 0;
        while (calculateTotalXpToLevel(level + 1) <= xp) {
            level++;
        }
        return level;
    };

    const getTotalXpResult = (): number | null => {
        const level = Number(levelToXp);
        if (levelToXp === '' || isNaN(level) || level < 0) {
            return null;
        }
        return calculateTotalXpToLevel(level);
    };

    const getLevelFromXpResult = (): number | null => {
        const xp = Number(xpToLevel);
        if (xpToLevel === '' || isNaN(xp) || xp < 0) {
            return null;
        }
        return calculateLevelFromXp(xp);
    };

    const getXpForNextLevel = (level: number): number => {
        return calculateXpForLevel(level + 1);
    };

    const getRangeXpResult = (): {
        xpNeeded: number;
        currentXp: number;
        targetXp: number;
    } | null => {
        const current = Number(currentLevel);
        const target = Number(targetLevel);

        if (
            currentLevel === '' ||
            targetLevel === '' ||
            isNaN(current) ||
            isNaN(target) ||
            current < 0 ||
            target < 0 ||
            target <= current
        ) {
            return null;
        }

        const currentXp = calculateTotalXpToLevel(current);
        const targetXp = calculateTotalXpToLevel(target);

        return {
            xpNeeded: targetXp - currentXp,
            currentXp,
            targetXp,
        };
    };

    const getBottlesNeeded = (): number | null => {
        const rangeResult = getRangeXpResult();
        if (!rangeResult) {
            return null;
        }
        return Math.ceil(rangeResult.xpNeeded / 7);
    };

    const getProgressPercentage = (current: number, target: number): number => {
        if (target === 0) {
            return 100;
        }
        return Math.min(100, (current / target) * 100);
    };

    const formatNumber = (num: number): string => {
        return num.toLocaleString();
    };

    const groupedSources = xpSources.reduce(
        (acc, source) => {
            if (!acc[source.category]) {
                acc[source.category] = [];
            }
            acc[source.category].push(source);
            return acc;
        },
        {} as Record<string, XPSource[]>,
    );

    const sidebar = (
        <>
            {/* Quick Stats */}
            {getRangeXpResult() && (
                <OutputPanel title="Level Range Summary">
                    <div className="flex flex-col gap-3">
                        <div className="rounded-lg border p-3">
                            <p className="text-xs font-medium text-muted-foreground">
                                XP Needed
                            </p>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                                {formatNumber(getRangeXpResult()!.xpNeeded)}
                            </p>
                        </div>
                        <div className="rounded-lg border p-3">
                            <p className="text-xs font-medium text-muted-foreground">
                                Estimated Bottles
                            </p>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                ~{formatNumber(getBottlesNeeded()!)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Average 7 XP per bottle
                            </p>
                        </div>
                        <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{
                                    width: `${getProgressPercentage(
                                        getRangeXpResult()!.currentXp,
                                        getRangeXpResult()!.targetXp,
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>
                </OutputPanel>
            )}

            {/* How It Works */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">How XP Works</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                    <div>
                        <p className="font-semibold">Level Formula</p>
                        <p className="text-xs text-muted-foreground">
                            Levels 0-16: XP = level² + 6 × level
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Levels 17-31: XP = 2.5 × level² - 40.5 × level + 360
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Levels 32+: XP = 4.5 × level² - 162.5 × level + 2220
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold">Enchanting Costs</p>
                        <p className="text-xs text-muted-foreground">
                            Level 30 enchantments require 1,395 total XP
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="XP Calculator" />
            <ToolLayout
                title="Minecraft XP Calculator"
                description="Calculate experience points needed for enchanting and leveling"
                sidebar={sidebar}
            >
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent dark:border-green-500/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                <TrendingUp className="size-5" />
                                Level to XP
                            </CardTitle>
                            <CardDescription>
                                Calculate total XP needed to reach a level
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="level-to-xp">Target Level</Label>
                                <Input
                                    id="level-to-xp"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="30"
                                    value={levelToXp}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (
                                            value === '' ||
                                            (!isNaN(Number(value)) && Number(value) >= 0)
                                        ) {
                                            setLevelToXp(value);
                                        }
                                    }}
                                />
                            </div>

                            {getTotalXpResult() !== null && (
                                <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                            Total XP Required
                                        </p>
                                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                                            {formatNumber(getTotalXpResult()!)} XP
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            XP for next level:{' '}
                                            {formatNumber(
                                                getXpForNextLevel(Number(levelToXp)),
                                            )}
                                        </p>
                                    </div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-green-900/20">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-300"
                                            style={{
                                                width: `${getProgressPercentage(getTotalXpResult()!, getTotalXpResult()!)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent dark:border-green-500/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                <Calculator className="size-5" />
                                XP to Level
                            </CardTitle>
                            <CardDescription>
                                Calculate what level your XP equals
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="xp-to-level">Experience Points</Label>
                                <Input
                                    id="xp-to-level"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="1395"
                                    value={xpToLevel}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (
                                            value === '' ||
                                            (!isNaN(Number(value)) && Number(value) >= 0)
                                        ) {
                                            setXpToLevel(value);
                                        }
                                    }}
                                />
                            </div>

                            {getLevelFromXpResult() !== null && (
                                <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                            Current Level
                                        </p>
                                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                                            Level {getLevelFromXpResult()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            XP to next level:{' '}
                                            {formatNumber(
                                                calculateTotalXpToLevel(
                                                    getLevelFromXpResult()! + 1,
                                                ) - Number(xpToLevel),
                                            )}
                                        </p>
                                    </div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-green-900/20">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-300"
                                            style={{
                                                width: `${getProgressPercentage(
                                                    Number(xpToLevel) -
                                                        calculateTotalXpToLevel(
                                                            getLevelFromXpResult()!,
                                                        ),
                                                    calculateXpForLevel(
                                                        getLevelFromXpResult()! + 1,
                                                    ),
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Level Range Calculator */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="size-5" />
                            Level Range Calculator
                        </CardTitle>
                        <CardDescription>
                            Calculate XP needed between two levels
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="current-level">Current Level</Label>
                                <Input
                                    id="current-level"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={currentLevel}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (
                                            value === '' ||
                                            (!isNaN(Number(value)) && Number(value) >= 0)
                                        ) {
                                            setCurrentLevel(value);
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="target-level">Target Level</Label>
                                <Input
                                    id="target-level"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="30"
                                    value={targetLevel}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (
                                            value === '' ||
                                            (!isNaN(Number(value)) && Number(value) >= 0)
                                        ) {
                                            setTargetLevel(value);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {getRangeXpResult() && (
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                        XP Needed
                                    </h3>
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                                        {formatNumber(getRangeXpResult()!.xpNeeded)}
                                    </p>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                        Current Total XP
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        {formatNumber(getRangeXpResult()!.currentXp)}
                                    </p>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                        Target Total XP
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        {formatNumber(getRangeXpResult()!.targetXp)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>XP Sources Reference</CardTitle>
                        <CardDescription>
                            Common sources of experience points in Minecraft
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(groupedSources).map(([category, sources]) => (
                                <div key={category} className="flex flex-col gap-3">
                                    <h3 className="font-semibold text-primary">
                                        {category}
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        {sources.map((source, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between rounded-md border px-3 py-2"
                                            >
                                                <span className="text-sm">
                                                    {source.name}
                                                </span>
                                                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                                    {source.xp} XP
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </ToolLayout>
        </AppLayout>
    );
}
