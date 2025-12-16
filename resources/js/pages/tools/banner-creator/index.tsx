import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    BannerLayer,
    BannerPreview,
} from '@/components/tools/banner-preview';
import { OutputPanel, ToolLayout } from '@/components/tool-layout';
import { bannerPatterns } from '@/data/banner-patterns';
import { minecraftColors } from '@/data/minecraft-colors';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Check,
    ChevronDown,
    ChevronUp,
    Copy,
    RotateCcw,
    Trash2,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Banner Creator',
        href: '/tools/banner-creator',
    },
];

export default function BannerCreator() {
    const [baseColor, setBaseColor] = useState('white');
    const [layers, setLayers] = useState<BannerLayer[]>([]);
    const [selectedPattern, setSelectedPattern] = useState('stripe_bottom');
    const [selectedColor, setSelectedColor] = useState('black');
    const [copied, setCopied] = useState(false);

    const addLayer = useCallback(() => {
        if (layers.length >= 6) {
            return;
        }

        setLayers([
            ...layers,
            { pattern: selectedPattern, color: selectedColor },
        ]);
    }, [layers, selectedPattern, selectedColor]);

    const removeLayer = useCallback((index: number) => {
        setLayers((prevLayers) => prevLayers.filter((_, i) => i !== index));
    }, []);

    const moveLayer = useCallback((index: number, direction: 'up' | 'down') => {
        setLayers((prevLayers) => {
            const newLayers = [...prevLayers];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;

            if (targetIndex < 0 || targetIndex >= newLayers.length) {
                return prevLayers;
            }

            [newLayers[index], newLayers[targetIndex]] = [
                newLayers[targetIndex],
                newLayers[index],
            ];
            return newLayers;
        });
    }, []);

    const reset = useCallback(() => {
        setBaseColor('white');
        setLayers([]);
        setSelectedPattern('stripe_bottom');
        setSelectedColor('black');
    }, []);

    const generateCommand = useCallback(() => {
        let nbtData = `{BlockEntityTag:{Base:${minecraftColors.findIndex((c) => c.id === baseColor)}`;

        if (layers.length > 0) {
            nbtData += ',Patterns:[';
            const patternStrings = layers.map((layer) => {
                const colorIndex = minecraftColors.findIndex(
                    (c) => c.id === layer.color,
                );
                return `{Pattern:${layer.pattern},Color:${colorIndex}}`;
            });
            nbtData += patternStrings.join(',');
            nbtData += ']';
        }

        nbtData += '}}';

        return `/give @p minecraft:${baseColor}_banner${nbtData}`;
    }, [baseColor, layers]);

    const copyCommand = useCallback(async () => {
        const command = generateCommand();
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [generateCommand]);

    const getColorByName = useCallback((colorId: string) => {
        return minecraftColors.find((c) => c.id === colorId);
    }, []);

    const getPatternByName = useCallback((patternId: string) => {
        return bannerPatterns.find((p) => p.id === patternId);
    }, []);

    const filteredPatterns = useMemo(
        () => bannerPatterns.filter((p) => p.id !== 'base'),
        [],
    );

    const sidebar = (
        <>
            {/* Preview */}
            <OutputPanel title="Banner Preview">
                <div className="flex justify-center rounded-lg border bg-gradient-to-br from-slate-50 to-slate-100 p-8 dark:from-slate-900 dark:to-slate-800">
                    <BannerPreview baseColor={baseColor} layers={layers} />
                </div>
            </OutputPanel>

            {/* Command */}
            <OutputPanel
                title="Command"
                actions={
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyCommand}
                            disabled={copied}
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
                        <Button variant="ghost" size="sm" onClick={reset}>
                            <RotateCcw className="size-3" />
                        </Button>
                    </div>
                }
            >
                <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                    <code className="block break-all font-mono text-xs">
                        {generateCommand()}
                    </code>
                </div>
            </OutputPanel>

            {/* How to Use */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div>
                        <strong className="text-foreground">
                            1. Choose a base color
                        </strong>
                        <p className="text-xs">
                            This is the background color of your banner.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            2. Add pattern layers
                        </strong>
                        <p className="text-xs">
                            Select a pattern and color, then click "Add Layer".
                            You can add up to 6 layers.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            3. Reorder or remove layers
                        </strong>
                        <p className="text-xs">
                            Use the arrows to change layer order, or the trash
                            icon to remove a layer.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            4. Copy the command
                        </strong>
                        <p className="text-xs">
                            Click "Copy" and paste the command in your Minecraft
                            chat to get your banner.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Banner Creator" />
            <ToolLayout
                title="Minecraft Banner Creator"
                description="Design custom Minecraft banners with patterns and colors"
                sidebar={sidebar}
            >
                <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Base Color</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-8 gap-2">
                                    {minecraftColors.map((color) => (
                                        <button
                                            key={color.id}
                                            type="button"
                                            onClick={() =>
                                                setBaseColor(color.id)
                                            }
                                            className="group relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105"
                                            style={{
                                                backgroundColor: color.hex,
                                                borderColor:
                                                    baseColor === color.id
                                                        ? 'hsl(var(--primary))'
                                                        : 'transparent',
                                            }}
                                            title={color.name}
                                        >
                                            {baseColor === color.id && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <Check className="size-5 text-white drop-shadow" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Add Pattern Layer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="mb-2 text-sm font-medium">
                                        Pattern
                                    </h3>
                                    <div className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto rounded-lg border p-2 md:grid-cols-6">
                                        {filteredPatterns.map((pattern) => (
                                                <button
                                                    key={pattern.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedPattern(
                                                            pattern.id,
                                                        )
                                                    }
                                                    className="flex flex-col items-center gap-1 rounded-lg border-2 p-2 text-center transition-all hover:bg-muted"
                                                    style={{
                                                        borderColor:
                                                            selectedPattern ===
                                                            pattern.id
                                                                ? 'hsl(var(--primary))'
                                                                : 'transparent',
                                                    }}
                                                    title={pattern.name}
                                                >
                                                    <div
                                                        className="size-8"
                                                        style={{
                                                            imageRendering:
                                                                'pixelated',
                                                        }}
                                                    >
                                                        <BannerPreview
                                                            baseColor="white"
                                                            layers={[
                                                                {
                                                                    pattern:
                                                                        pattern.id,
                                                                    color: 'black',
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                    <span className="line-clamp-2 text-[10px] leading-tight">
                                                        {pattern.name}
                                                    </span>
                                                </button>
                                            ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-2 text-sm font-medium">
                                        Color
                                    </h3>
                                    <div className="grid grid-cols-8 gap-2">
                                        {minecraftColors.map((color) => (
                                            <button
                                                key={color.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedColor(color.id)
                                                }
                                                className="aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105"
                                                style={{
                                                    backgroundColor: color.hex,
                                                    borderColor:
                                                        selectedColor ===
                                                        color.id
                                                            ? 'hsl(var(--primary))'
                                                            : 'transparent',
                                                }}
                                                title={color.name}
                                            >
                                                {selectedColor === color.id && (
                                                    <div className="flex size-full items-center justify-center bg-black/20">
                                                        <Check className="size-4 text-white drop-shadow" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={addLayer}
                                    disabled={layers.length >= 6}
                                    className="w-full"
                                >
                                    Add Layer {layers.length > 0 && `(${layers.length}/6)`}
                                </Button>
                                {layers.length >= 6 && (
                                    <p className="text-center text-sm text-muted-foreground">
                                        Maximum of 6 layers reached
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {layers.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Layers ({layers.length}/6)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {layers.map((layer, index) => {
                                            const color = getColorByName(
                                                layer.color,
                                            );
                                            const pattern = getPatternByName(
                                                layer.pattern,
                                            );

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 rounded-lg border bg-card p-3"
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                moveLayer(
                                                                    index,
                                                                    'up',
                                                                )
                                                            }
                                                            disabled={index === 0}
                                                            className="h-6 px-2"
                                                        >
                                                            <ChevronUp className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                moveLayer(
                                                                    index,
                                                                    'down',
                                                                )
                                                            }
                                                            disabled={
                                                                index ===
                                                                layers.length - 1
                                                            }
                                                            className="h-6 px-2"
                                                        >
                                                            <ChevronDown className="size-4" />
                                                        </Button>
                                                    </div>

                                                    <div
                                                        className="size-12 shrink-0"
                                                        style={{
                                                            imageRendering:
                                                                'pixelated',
                                                        }}
                                                    >
                                                        <BannerPreview
                                                            baseColor="white"
                                                            layers={[layer]}
                                                        />
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="font-medium">
                                                            {pattern?.name}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <div
                                                                className="size-4 rounded border"
                                                                style={{
                                                                    backgroundColor:
                                                                        color?.hex,
                                                                }}
                                                            />
                                                            {color?.name}
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeLayer(index)
                                                        }
                                                    >
                                                        <Trash2 className="size-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                </div>
            </ToolLayout>
        </AppLayout>
    );
}
