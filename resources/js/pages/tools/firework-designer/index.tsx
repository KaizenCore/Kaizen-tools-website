import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { fireworkShapes, fireworkEffects, flightDurations } from '@/data/firework-data';
import { minecraftColors } from '@/data/minecraft-colors';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Check, Copy, RotateCcw, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { OutputPanel, ToolLayout } from '@/components/tool-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Firework Designer',
        href: '/tools/firework-designer',
    },
];

export default function FireworkDesigner() {
    const [shape, setShape] = useState('small_ball');
    const [primaryColors, setPrimaryColors] = useState<string[]>(['red', 'orange']);
    const [fadeColors, setFadeColors] = useState<string[]>([]);
    const [enabledEffects, setEnabledEffects] = useState<string[]>([]);
    const [flightDuration, setFlightDuration] = useState(1);
    const [copied, setCopied] = useState(false);
    const [isExploding, setIsExploding] = useState(false);

    const togglePrimaryColor = (colorId: string) => {
        if (primaryColors.includes(colorId)) {
            setPrimaryColors(primaryColors.filter((c) => c !== colorId));
        } else {
            setPrimaryColors([...primaryColors, colorId]);
        }
    };

    const toggleFadeColor = (colorId: string) => {
        if (fadeColors.includes(colorId)) {
            setFadeColors(fadeColors.filter((c) => c !== colorId));
        } else {
            setFadeColors([...fadeColors, colorId]);
        }
    };

    const toggleEffect = (effectId: string) => {
        if (enabledEffects.includes(effectId)) {
            setEnabledEffects(enabledEffects.filter((e) => e !== effectId));
        } else {
            setEnabledEffects([...enabledEffects, effectId]);
        }
    };

    const reset = () => {
        setShape('small_ball');
        setPrimaryColors(['red', 'orange']);
        setFadeColors([]);
        setEnabledEffects([]);
        setFlightDuration(1);
    };

    const generateCommand = () => {
        const colorIndices = primaryColors.map((colorId) =>
            minecraftColors.findIndex((c) => c.id === colorId)
        );

        const fadeIndices = fadeColors.map((colorId) =>
            minecraftColors.findIndex((c) => c.id === colorId)
        );

        let explosion = `{Type:${getShapeTypeNumber(shape)}`;

        if (colorIndices.length > 0) {
            explosion += `,Colors:[I;${colorIndices.join(',')}]`;
        }

        if (fadeIndices.length > 0) {
            explosion += `,FadeColors:[I;${fadeIndices.join(',')}]`;
        }

        if (enabledEffects.includes('trail')) {
            explosion += ',Trail:1b';
        }

        if (enabledEffects.includes('twinkle')) {
            explosion += ',Flicker:1b';
        }

        explosion += '}';

        return `/give @p minecraft:firework_rocket{Fireworks:{Flight:${flightDuration},Explosions:[${explosion}]}} 1`;
    };

    const getShapeTypeNumber = (shapeId: string): number => {
        const shapeMap: { [key: string]: number } = {
            small_ball: 0,
            large_ball: 1,
            star: 2,
            creeper: 3,
            burst: 4,
        };
        return shapeMap[shapeId] || 0;
    };

    const copyCommand = async () => {
        const command = generateCommand();
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const triggerExplosion = () => {
        setIsExploding(true);
        setTimeout(() => setIsExploding(false), 1500);
    };

    useEffect(() => {
        if (isExploding) {
            const timer = setTimeout(() => setIsExploding(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [isExploding]);

    const selectedShape = fireworkShapes.find((s) => s.id === shape);

    const sidebar = (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br from-slate-900 to-slate-950 p-8">
                        <button
                            type="button"
                            onClick={triggerExplosion}
                            className="group relative z-10"
                        >
                            <Sparkles className="size-12 text-muted-foreground transition-all group-hover:scale-110 group-hover:text-primary" />
                            <span className="mt-2 block text-xs text-muted-foreground">
                                Click to preview
                            </span>
                        </button>

                        {isExploding && (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                {primaryColors.map((colorId, index) => {
                                    const color = minecraftColors.find(
                                        (c) => c.id === colorId
                                    );
                                    const angle = (360 / primaryColors.length) * index;
                                    const rotation = angle + Math.random() * 30 - 15;

                                    return (
                                        <div
                                            key={`${colorId}-${index}`}
                                            className="absolute animate-[ping_1.5s_ease-out]"
                                            style={{
                                                transform: `rotate(${rotation}deg)`,
                                            }}
                                        >
                                            <div
                                                className="size-3 rounded-full"
                                                style={{
                                                    backgroundColor: color?.hex,
                                                    boxShadow: `0 0 20px ${color?.hex}`,
                                                }}
                                            />
                                        </div>
                                    );
                                })}

                                {shape === 'star' && (
                                    <div className="absolute animate-[spin_1.5s_ease-out]">
                                        {[...Array(5)].map((_, i) => {
                                            const angle = (360 / 5) * i;
                                            return (
                                                <div
                                                    key={i}
                                                    className="absolute h-16 w-1 origin-bottom bg-gradient-to-t from-yellow-400 to-transparent"
                                                    style={{
                                                        transform: `rotate(${angle}deg) translateY(-32px)`,
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                )}

                                {enabledEffects.includes('trail') && (
                                    <div className="absolute inset-0 animate-[fadeIn_1.5s_ease-out]">
                                        {[...Array(20)].map((_, i) => {
                                            const angle = (360 / 20) * i;
                                            return (
                                                <div
                                                    key={i}
                                                    className="absolute left-1/2 top-1/2 h-1 w-12 origin-left bg-gradient-to-r from-white to-transparent opacity-50"
                                                    style={{
                                                        transform: `rotate(${angle}deg)`,
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                )}

                                {enabledEffects.includes('twinkle') && (
                                    <div className="absolute inset-0 animate-[pulse_0.5s_ease-in-out_infinite]">
                                        {[...Array(12)].map((_, i) => {
                                            const angle = (360 / 12) * i;
                                            const radius = 60 + Math.random() * 40;
                                            const x = Math.cos((angle * Math.PI) / 180) * radius;
                                            const y = Math.sin((angle * Math.PI) / 180) * radius;

                                            return (
                                                <div
                                                    key={i}
                                                    className="absolute left-1/2 top-1/2 size-1 rounded-full bg-white"
                                                    style={{
                                                        transform: `translate(${x}px, ${y}px)`,
                                                        animation: `twinkle 0.${3 + i}s ease-in-out infinite`,
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recipe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div>
                        <strong className="text-foreground">Base Materials:</strong>
                        <ul className="ml-4 mt-1 list-disc text-muted-foreground">
                            <li>1 Paper</li>
                            <li>
                                {flightDuration} Gunpowder (Flight Duration: {flightDuration})
                            </li>
                        </ul>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">Firework Star:</strong>
                        <ul className="ml-4 mt-1 list-disc text-muted-foreground">
                            <li>1 Gunpowder</li>
                            {selectedShape?.ingredient && (
                                <li>
                                    1 {selectedShape.ingredient} ({selectedShape.name})
                                </li>
                            )}
                            {primaryColors.length > 0 && (
                                <li>
                                    {primaryColors.length} Dye
                                    {primaryColors.length !== 1 ? 's' : ''} (
                                    {primaryColors
                                        .map(
                                            (id) =>
                                                minecraftColors.find((c) => c.id === id)
                                                    ?.name
                                        )
                                        .join(', ')}
                                    )
                                </li>
                            )}
                            {fadeColors.length > 0 && (
                                <li>
                                    {fadeColors.length} Fade Dye
                                    {fadeColors.length !== 1 ? 's' : ''} (
                                    {fadeColors
                                        .map(
                                            (id) =>
                                                minecraftColors.find((c) => c.id === id)
                                                    ?.name
                                        )
                                        .join(', ')}
                                    )
                                </li>
                            )}
                            {enabledEffects.map((effectId) => {
                                const effect = fireworkEffects.find(
                                    (e) => e.id === effectId
                                );
                                return (
                                    <li key={effectId}>
                                        1 {effect?.ingredient} ({effect?.name})
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <OutputPanel
                title="Command"
                actions={
                    <Button onClick={reset} variant="ghost" size="sm">
                        <RotateCcw className="mr-2 size-4" />
                        Reset
                    </Button>
                }
            >
                <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                    <code className="block break-all font-mono text-xs">
                        {generateCommand()}
                    </code>
                </div>

                <Button
                    onClick={copyCommand}
                    className="w-full"
                    disabled={copied || primaryColors.length === 0}
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
            </OutputPanel>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Firework Designer" />
            <ToolLayout
                title="Minecraft Firework Designer"
                description="Create custom firework rockets with colors, effects, and flight duration"
                sidebar={sidebar}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Firework Shape</CardTitle>
                    </CardHeader>
                            <CardContent>
                                <RadioGroup value={shape} onValueChange={setShape}>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {fireworkShapes.map((s) => (
                                            <div
                                                key={s.id}
                                                className="flex items-center space-x-3 rounded-lg border p-4 transition-all hover:bg-muted"
                                                style={{
                                                    borderColor:
                                                        shape === s.id
                                                            ? 'hsl(var(--primary))'
                                                            : 'hsl(var(--border))',
                                                    backgroundColor:
                                                        shape === s.id
                                                            ? 'hsl(var(--accent) / 0.1)'
                                                            : 'transparent',
                                                }}
                                            >
                                                <RadioGroupItem value={s.id} id={s.id} />
                                                <Label
                                                    htmlFor={s.id}
                                                    className="flex-1 cursor-pointer font-medium"
                                                >
                                                    {s.name}
                                                    {s.ingredient && (
                                                        <span className="block text-xs font-normal text-muted-foreground">
                                                            + {s.ingredient}
                                                        </span>
                                                    )}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Primary Colors</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-8 gap-2">
                                    {minecraftColors.map((color) => (
                                        <button
                                            key={color.id}
                                            type="button"
                                            onClick={() => togglePrimaryColor(color.id)}
                                            className="aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105"
                                            style={{
                                                backgroundColor: color.hex,
                                                borderColor: primaryColors.includes(color.id)
                                                    ? 'hsl(var(--primary))'
                                                    : 'transparent',
                                            }}
                                            title={color.name}
                                        >
                                            {primaryColors.includes(color.id) && (
                                                <div className="flex size-full items-center justify-center bg-black/20">
                                                    <Check className="size-4 text-white drop-shadow" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {primaryColors.length === 0 && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Select at least one primary color
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Fade Colors (Optional)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-8 gap-2">
                                    {minecraftColors.map((color) => (
                                        <button
                                            key={color.id}
                                            type="button"
                                            onClick={() => toggleFadeColor(color.id)}
                                            className="aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105"
                                            style={{
                                                backgroundColor: color.hex,
                                                borderColor: fadeColors.includes(color.id)
                                                    ? 'hsl(var(--primary))'
                                                    : 'transparent',
                                            }}
                                            title={color.name}
                                        >
                                            {fadeColors.includes(color.id) && (
                                                <div className="flex size-full items-center justify-center bg-black/20">
                                                    <Check className="size-4 text-white drop-shadow" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {fadeColors.length > 0 && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {fadeColors.length} fade color{fadeColors.length !== 1 ? 's' : ''}{' '}
                                        selected
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Special Effects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {fireworkEffects.map((effect) => (
                                        <div
                                            key={effect.id}
                                            className="flex items-center space-x-3 rounded-lg border p-4"
                                        >
                                            <Checkbox
                                                id={effect.id}
                                                checked={enabledEffects.includes(effect.id)}
                                                onCheckedChange={() => toggleEffect(effect.id)}
                                            />
                                            <Label
                                                htmlFor={effect.id}
                                                className="flex-1 cursor-pointer font-medium"
                                            >
                                                {effect.name}
                                                <span className="block text-xs font-normal text-muted-foreground">
                                                    + {effect.ingredient}
                                                </span>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Flight Duration</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {flightDuration} Gunpowder
                                        </span>
                                        <span className="text-sm font-medium">
                                            Duration: {flightDuration}
                                        </span>
                                    </div>
                                    <Slider
                                        value={[flightDuration]}
                                        onValueChange={(value) => setFlightDuration(value[0])}
                                        min={1}
                                        max={3}
                                        step={1}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Short</span>
                                        <span>Medium</span>
                                        <span>Long</span>
                                    </div>
                                </div>
                    </CardContent>
                </Card>
            </ToolLayout>

            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.5); }
                }
            `}</style>
        </AppLayout>
    );
}
