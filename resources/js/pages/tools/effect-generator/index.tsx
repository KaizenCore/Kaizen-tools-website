import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    type Effect,
    type EffectCategory,
    type EffectPreset,
    areEffectsCompatible,
    durationPresets,
    effectCategories,
    effectPresets,
    effects,
    formatAmplifier,
    getEffectById,
    getEffectsByCategory,
    targetSelectors,
} from '@/data/effect-data';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    Copy,
    Plus,
    Search,
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
        title: 'Effect Generator',
        href: '/tools/effect-generator',
    },
];

interface SelectedEffect {
    effect: Effect;
    duration: number;
    amplifier: number;
    hideParticles: boolean;
    infinite: boolean;
}

type CommandType = 'give' | 'clear' | 'clear_all';

export default function EffectGenerator() {
    const [commandType, setCommandType] = useState<CommandType>('give');
    const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
    const [target, setTarget] = useState<string>('@p');
    const [duration, setDuration] = useState<number>(30);
    const [infinite, setInfinite] = useState<boolean>(false);
    const [amplifier, setAmplifier] = useState<number>(0);
    const [hideParticles, setHideParticles] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<EffectCategory>('All');
    const [multipleEffects, setMultipleEffects] = useState<SelectedEffect[]>([]);
    const [copiedMessage, setCopiedMessage] = useState<string>('');

    const filteredEffects = getEffectsByCategory(categoryFilter).filter((effect) =>
        effect.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const generateCommand = (
        effectId: string,
        targetStr: string,
        durationSec: number,
        amp: number,
        hide: boolean,
        isInfinite: boolean,
    ): string => {
        const actualDuration = isInfinite ? 1000000 : durationSec;

        if (commandType === 'give') {
            return `/effect give ${targetStr} ${effectId} ${actualDuration} ${amp}${hide ? ' true' : ''}`;
        }

        if (commandType === 'clear') {
            return `/effect clear ${targetStr} ${effectId}`;
        }

        return `/effect clear ${targetStr}`;
    };

    const getGeneratedCommand = (): string => {
        if (commandType === 'clear_all') {
            return `/effect clear ${target}`;
        }

        if (!selectedEffect) {
            return 'Select an effect to generate a command';
        }

        return generateCommand(
            selectedEffect.id,
            target,
            duration,
            amplifier,
            hideParticles,
            infinite,
        );
    };

    const getMultipleCommands = (): string[] => {
        return multipleEffects.map((se) =>
            generateCommand(
                se.effect.id,
                target,
                se.duration,
                se.amplifier,
                se.hideParticles,
                se.infinite,
            ),
        );
    };

    const copyCommand = (command: string) => {
        navigator.clipboard.writeText(command);
        setCopiedMessage('Command copied!');
        setTimeout(() => {
            setCopiedMessage('');
        }, 2000);
    };

    const copyAllCommands = () => {
        const commands = getMultipleCommands().join('\n');
        navigator.clipboard.writeText(commands);
        setCopiedMessage('All commands copied!');
        setTimeout(() => {
            setCopiedMessage('');
        }, 2000);
    };

    const addToMultiple = () => {
        if (!selectedEffect) {
            return;
        }

        const incompatibleEffect = multipleEffects.find(
            (se) => !areEffectsCompatible(selectedEffect.id, se.effect.id),
        );

        if (incompatibleEffect) {
            setCopiedMessage(
                `Warning: ${selectedEffect.name} is incompatible with ${incompatibleEffect.effect.name}`,
            );
            setTimeout(() => {
                setCopiedMessage('');
            }, 3000);
        }

        setMultipleEffects([
            ...multipleEffects,
            {
                effect: selectedEffect,
                duration,
                amplifier,
                hideParticles,
                infinite,
            },
        ]);
    };

    const removeFromMultiple = (index: number) => {
        setMultipleEffects(multipleEffects.filter((_, i) => i !== index));
    };

    const applyPreset = (preset: EffectPreset) => {
        if (preset.effects.length === 0) {
            setCommandType('clear_all');
            setMultipleEffects([]);
            return;
        }

        setCommandType('give');
        setMultipleEffects(
            preset.effects.map((pe) => ({
                effect: getEffectById(pe.effectId)!,
                duration: pe.duration,
                amplifier: pe.amplifier,
                hideParticles: pe.hideParticles,
                infinite: false,
            })),
        );
    };

    const isHighAmplifier = amplifier > 10;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Effect Generator" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Minecraft Effect Command Generator</h1>
                    <p className="text-muted-foreground">
                        Generate commands to give or clear status effects
                    </p>
                </div>

                {copiedMessage && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                        <Check className="size-4" />
                        {copiedMessage}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Command Type</CardTitle>
                                <CardDescription>
                                    Choose the type of effect command
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs
                                    value={commandType}
                                    onValueChange={(value) => {
                                        setCommandType(value as CommandType);
                                    }}
                                >
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="give">Give Effect</TabsTrigger>
                                        <TabsTrigger value="clear">Clear Effect</TabsTrigger>
                                        <TabsTrigger value="clear_all">Clear All</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="give" className="mt-4 flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label>Target Selector</Label>
                                            <Input
                                                value={target}
                                                onChange={(e) => {
                                                    setTarget(e.target.value);
                                                }}
                                                placeholder="@p"
                                            />
                                            <div className="flex flex-wrap gap-2">
                                                {targetSelectors.map((ts) => (
                                                    <Button
                                                        key={ts.value}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setTarget(ts.value);
                                                        }}
                                                    >
                                                        {ts.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="clear" className="mt-4 flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label>Target Selector</Label>
                                            <Input
                                                value={target}
                                                onChange={(e) => {
                                                    setTarget(e.target.value);
                                                }}
                                                placeholder="@p"
                                            />
                                            <div className="flex flex-wrap gap-2">
                                                {targetSelectors.map((ts) => (
                                                    <Button
                                                        key={ts.value}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setTarget(ts.value);
                                                        }}
                                                    >
                                                        {ts.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value="clear_all"
                                        className="mt-4 flex flex-col gap-4"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <Label>Target Selector</Label>
                                            <Input
                                                value={target}
                                                onChange={(e) => {
                                                    setTarget(e.target.value);
                                                }}
                                                placeholder="@p"
                                            />
                                            <div className="flex flex-wrap gap-2">
                                                {targetSelectors.map((ts) => (
                                                    <Button
                                                        key={ts.value}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setTarget(ts.value);
                                                        }}
                                                    >
                                                        {ts.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {commandType !== 'clear_all' && (
                            <>
                                <Card className="mt-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="size-5" />
                                            Select Effect
                                        </CardTitle>
                                        <CardDescription>
                                            Choose a status effect to apply
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="search">Search Effects</Label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="search"
                                                    className="pl-10"
                                                    placeholder="Search..."
                                                    value={searchQuery}
                                                    onChange={(e) => {
                                                        setSearchQuery(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {effectCategories.map((cat) => (
                                                <Button
                                                    key={cat}
                                                    variant={
                                                        categoryFilter === cat
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    onClick={() => {
                                                        setCategoryFilter(cat);
                                                    }}
                                                >
                                                    {cat}
                                                </Button>
                                            ))}
                                        </div>

                                        <div className="grid max-h-96 gap-2 overflow-y-auto sm:grid-cols-2">
                                            {filteredEffects.map((effect) => (
                                                <button
                                                    key={effect.id}
                                                    onClick={() => {
                                                        setSelectedEffect(effect);
                                                        setAmplifier(0);
                                                    }}
                                                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                                                        selectedEffect?.id === effect.id
                                                            ? 'border-primary bg-accent'
                                                            : ''
                                                    }`}
                                                >
                                                    <div
                                                        className="size-4 shrink-0 rounded"
                                                        style={{ backgroundColor: effect.color }}
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-medium">
                                                            {effect.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {effect.description}
                                                        </div>
                                                    </div>
                                                    {selectedEffect?.id === effect.id && (
                                                        <Check className="size-4 text-primary" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {selectedEffect && commandType === 'give' && (
                                    <Card className="mt-6">
                                        <CardHeader>
                                            <CardTitle>Effect Configuration</CardTitle>
                                            <CardDescription>
                                                Configure {selectedEffect.name} parameters
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="duration">
                                                        Duration (seconds)
                                                    </Label>
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            id="infinite"
                                                            checked={infinite}
                                                            onCheckedChange={(checked) => {
                                                                setInfinite(checked === true);
                                                            }}
                                                        />
                                                        <Label
                                                            htmlFor="infinite"
                                                            className="text-sm font-normal"
                                                        >
                                                            Infinite (1.19.4+)
                                                        </Label>
                                                    </div>
                                                </div>
                                                <Input
                                                    id="duration"
                                                    type="number"
                                                    min="1"
                                                    max="1000000"
                                                    value={duration}
                                                    disabled={infinite}
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        if (value >= 1 && value <= 1000000) {
                                                            setDuration(value);
                                                        }
                                                    }}
                                                />
                                                <div className="flex flex-wrap gap-2">
                                                    {durationPresets.map((preset) => (
                                                        <Button
                                                            key={preset.label}
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (preset.label === 'Infinite') {
                                                                    setInfinite(true);
                                                                } else {
                                                                    setInfinite(false);
                                                                    setDuration(preset.value);
                                                                }
                                                            }}
                                                        >
                                                            {preset.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="amplifier">
                                                        Amplifier (Level {formatAmplifier(amplifier)}
                                                        )
                                                    </Label>
                                                    <Input
                                                        id="amplifier-input"
                                                        type="number"
                                                        min="0"
                                                        max="255"
                                                        value={amplifier}
                                                        onChange={(e) => {
                                                            const value = Number(e.target.value);
                                                            if (value >= 0 && value <= 255) {
                                                                setAmplifier(value);
                                                            }
                                                        }}
                                                        className="w-20"
                                                    />
                                                </div>
                                                <Slider
                                                    id="amplifier"
                                                    min={0}
                                                    max={Math.min(
                                                        selectedEffect.maxUsefulAmplifier,
                                                        20,
                                                    )}
                                                    step={1}
                                                    value={[amplifier]}
                                                    onValueChange={(value) => {
                                                        setAmplifier(value[0]);
                                                    }}
                                                />
                                                {isHighAmplifier && (
                                                    <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm text-yellow-700 dark:text-yellow-400">
                                                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                                                        <span>
                                                            High amplifier values may cause
                                                            unexpected behavior or game crashes
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="hide-particles"
                                                    checked={hideParticles}
                                                    onCheckedChange={(checked) => {
                                                        setHideParticles(checked === true);
                                                    }}
                                                />
                                                <Label
                                                    htmlFor="hide-particles"
                                                    className="text-sm font-normal"
                                                >
                                                    Hide Particles
                                                </Label>
                                            </div>

                                            <Button
                                                onClick={addToMultiple}
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <Plus className="size-4" />
                                                Add to Multiple Effects
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Presets</CardTitle>
                                <CardDescription>Quick effect combinations</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                {effectPresets.map((preset) => (
                                    <Button
                                        key={preset.name}
                                        variant="outline"
                                        onClick={() => {
                                            applyPreset(preset);
                                        }}
                                        className="h-auto flex-col items-start gap-1 py-3"
                                    >
                                        <div className="font-medium">{preset.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {preset.description}
                                        </div>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>

                        {multipleEffects.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Multiple Effects</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setMultipleEffects([]);
                                            }}
                                        >
                                            <X className="size-4" />
                                            Clear
                                        </Button>
                                    </div>
                                    <CardDescription>
                                        {multipleEffects.length} effect(s) added
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    {multipleEffects.map((se, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 rounded-lg border p-2"
                                        >
                                            <div
                                                className="size-3 shrink-0 rounded"
                                                style={{ backgroundColor: se.effect.color }}
                                            />
                                            <div className="flex-1 text-sm">
                                                <div className="font-medium">{se.effect.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {se.infinite ? 'Infinite' : `${se.duration}s`} •
                                                    Level {formatAmplifier(se.amplifier)}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    removeFromMultiple(index);
                                                }}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button onClick={copyAllCommands} className="mt-2 w-full">
                                        <Copy className="size-4" />
                                        Copy All Commands
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Generated Command</CardTitle>
                                <CardDescription>
                                    Copy this command to use in Minecraft
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="rounded-lg border bg-muted/50 p-3">
                                    <code className="break-all text-sm">
                                        {getGeneratedCommand()}
                                    </code>
                                </div>
                                <Button
                                    onClick={() => {
                                        copyCommand(getGeneratedCommand());
                                    }}
                                    disabled={
                                        commandType !== 'clear_all' && !selectedEffect
                                    }
                                >
                                    <Copy className="size-4" />
                                    Copy Command
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Effect Command Syntax</CardTitle>
                        <CardDescription>
                            Understanding Minecraft effect commands
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Give Effect Command</h4>
                                <code className="text-sm text-muted-foreground">
                                    /effect give &lt;target&gt; &lt;effect&gt; [seconds]
                                    [amplifier] [hideParticles]
                                </code>
                                <p className="text-sm text-muted-foreground">
                                    Applies a status effect to the target. Duration defaults to 30
                                    seconds, amplifier defaults to 0 (level I).
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Clear Specific Effect</h4>
                                <code className="text-sm text-muted-foreground">
                                    /effect clear &lt;target&gt; &lt;effect&gt;
                                </code>
                                <p className="text-sm text-muted-foreground">
                                    Removes a specific status effect from the target.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Clear All Effects</h4>
                                <code className="text-sm text-muted-foreground">
                                    /effect clear &lt;target&gt;
                                </code>
                                <p className="text-sm text-muted-foreground">
                                    Removes all status effects from the target.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Amplifier Levels</h4>
                                <p className="text-sm text-muted-foreground">
                                    Amplifier 0 = Level I, Amplifier 1 = Level II, etc. Most
                                    effects are useful up to level 5, but can go up to 255. High
                                    values may cause issues.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Infinite Duration</h4>
                                <p className="text-sm text-muted-foreground">
                                    In Minecraft 1.19.4+, you can use very high duration values
                                    (like 1,000,000 seconds) for effectively infinite effects.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
