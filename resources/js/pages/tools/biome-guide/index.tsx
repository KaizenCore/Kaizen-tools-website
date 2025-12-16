import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolLayout, ToolSection } from '@/components/tool-layout';
import {
    biomes,
    categories,
    getBiomesByCategory,
    getBiomesByDimension,
    getRainfallLabel,
    getTemperatureLabel,
    searchBiomes,
    type BiomeData,
} from '@/data/biome-data';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronUp,
    Droplet,
    Eye,
    Globe,
    MapPin,
    Search,
    Sparkles,
    Thermometer,
    Trees,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Biome Guide',
        href: '/tools/biome-guide',
    },
];

export default function BiomeGuide() {
    const [selectedDimension, setSelectedDimension] = useState<'overworld' | 'nether' | 'end'>(
        'overworld'
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedBiome, setExpandedBiome] = useState<string | null>(null);

    const getFilteredBiomes = (): BiomeData[] => {
        let filtered = getBiomesByDimension(selectedDimension);

        if (searchQuery) {
            filtered = searchBiomes(searchQuery).filter((b) => b.dimension === selectedDimension);
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter((b) => b.category === selectedCategory);
        }

        return filtered;
    };

    const toggleBiome = (biomeId: string) => {
        setExpandedBiome((prev) => (prev === biomeId ? null : biomeId));
    };

    const filteredBiomes = getFilteredBiomes();

    const getTemperatureColor = (temperature: number): string => {
        if (temperature < 0) {
            return 'text-cyan-600 dark:text-cyan-400';
        }
        if (temperature < 0.5) {
            return 'text-blue-600 dark:text-blue-400';
        }
        if (temperature < 1.0) {
            return 'text-green-600 dark:text-green-400';
        }
        if (temperature < 1.5) {
            return 'text-yellow-600 dark:text-yellow-400';
        }
        return 'text-red-600 dark:text-red-400';
    };

    const getRainfallColor = (rainfall: number): string => {
        if (rainfall === 0.0) {
            return 'text-gray-400 dark:text-gray-500';
        }
        if (rainfall < 0.3) {
            return 'text-yellow-600 dark:text-yellow-500';
        }
        if (rainfall < 0.7) {
            return 'text-blue-500 dark:text-blue-400';
        }
        return 'text-blue-700 dark:text-blue-300';
    };

    const availableCategories = categories.filter((cat) => {
        if (cat.id === 'all') {
            return true;
        }
        return getBiomesByDimension(selectedDimension).some((b) => b.category === cat.id);
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Biome Guide" />
            <ToolLayout
                title="Minecraft Biome Guide"
                description="Explore all Minecraft biomes with detailed information about structures, mobs, and features"
            >

                <Card className="border-[oklch(0.72_0.14_75)]/20 bg-gradient-to-br from-[oklch(0.72_0.14_75)]/10 to-transparent dark:border-[oklch(0.75_0.15_75)]/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[oklch(0.55_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                            <Globe className="size-5" />
                            Dimension & Filter
                        </CardTitle>
                        <CardDescription>
                            Select dimension and filter biomes by category or search
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Tabs
                            value={selectedDimension}
                            onValueChange={(value) => {
                                setSelectedDimension(value as 'overworld' | 'nether' | 'end');
                                setSelectedCategory('all');
                            }}
                        >
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overworld">Overworld</TabsTrigger>
                                <TabsTrigger value="nether">Nether</TabsTrigger>
                                <TabsTrigger value="end">The End</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="flex flex-col gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search biomes by name, structures, or features..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                    }}
                                    className="pl-9"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {availableCategories.map((cat) => (
                                    <Button
                                        key={cat.id}
                                        variant={selectedCategory === cat.id ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => {
                                            setSelectedCategory(cat.id);
                                        }}
                                    >
                                        {cat.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border border-[oklch(0.72_0.14_75)]/20 bg-[oklch(0.72_0.14_75)]/5 p-3 dark:border-[oklch(0.75_0.15_75)]/20">
                            <p className="text-sm text-muted-foreground">
                                Found <span className="font-semibold">{filteredBiomes.length}</span>{' '}
                                {filteredBiomes.length === 1 ? 'biome' : 'biomes'} in{' '}
                                <span className="capitalize">{selectedDimension}</span>
                                {selectedCategory !== 'all' &&
                                    ` (${categories.find((c) => c.id === selectedCategory)?.name})`}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {filteredBiomes.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
                            <MapPin className="size-12 text-muted-foreground" />
                            <p className="text-lg font-medium text-muted-foreground">
                                No biomes found
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Try adjusting your filters or search query
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredBiomes.map((biome) => (
                            <Card
                                key={biome.id}
                                className="cursor-pointer transition-all hover:border-[oklch(0.72_0.14_75)]/50 hover:shadow-md dark:hover:border-[oklch(0.75_0.15_75)]/50"
                                onClick={() => {
                                    toggleBiome(biome.id);
                                }}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex flex-col gap-1">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                {biome.name}
                                            </CardTitle>
                                            <Badge variant="secondary" className="w-fit text-xs">
                                                {biome.category}
                                            </Badge>
                                        </div>
                                        {expandedBiome === biome.id ? (
                                            <ChevronUp className="size-5 shrink-0 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="size-5 shrink-0 text-muted-foreground" />
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3 pt-0">
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <Thermometer
                                                className={`size-4 ${getTemperatureColor(biome.temperature)}`}
                                            />
                                            <span className="text-muted-foreground">
                                                {getTemperatureLabel(biome.temperature)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Droplet
                                                className={`size-4 ${getRainfallColor(biome.rainfall)}`}
                                            />
                                            <span className="text-muted-foreground">
                                                {getRainfallLabel(biome.rainfall)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <div
                                            className="size-8 shrink-0 rounded border border-border"
                                            style={{ backgroundColor: biome.grassColor }}
                                            title="Grass Color"
                                        />
                                        <div
                                            className="size-8 shrink-0 rounded border border-border"
                                            style={{ backgroundColor: biome.foliageColor }}
                                            title="Foliage Color"
                                        />
                                        {biome.waterColor && (
                                            <div
                                                className="size-8 shrink-0 rounded border border-border"
                                                style={{ backgroundColor: biome.waterColor }}
                                                title="Water Color"
                                            />
                                        )}
                                    </div>

                                    {expandedBiome === biome.id && (
                                        <div className="flex flex-col gap-3 border-t pt-3">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="size-4 text-[oklch(0.55_0.14_75)] dark:text-[oklch(0.75_0.15_75)]" />
                                                    <span className="text-sm font-semibold">
                                                        Key Features
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    {biome.features.map((feature, idx) => (
                                                        <p
                                                            key={idx}
                                                            className="text-xs text-muted-foreground"
                                                        >
                                                            • {feature}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>

                                            {biome.structures.length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="size-4 text-purple-600 dark:text-purple-400" />
                                                        <span className="text-sm font-semibold">
                                                            Structures
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {biome.structures.map((structure, idx) => (
                                                            <Badge
                                                                key={idx}
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {structure}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Eye className="size-4 text-green-600 dark:text-green-400" />
                                                    <span className="text-sm font-semibold">Mobs</span>
                                                </div>
                                                <div className="flex flex-col gap-2 text-xs">
                                                    {biome.mobs.hostile.length > 0 && (
                                                        <div>
                                                            <span className="font-medium text-red-600 dark:text-red-400">
                                                                Hostile:
                                                            </span>{' '}
                                                            <span className="text-muted-foreground">
                                                                {biome.mobs.hostile.join(', ')}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {biome.mobs.passive.length > 0 && (
                                                        <div>
                                                            <span className="font-medium text-green-600 dark:text-green-400">
                                                                Passive:
                                                            </span>{' '}
                                                            <span className="text-muted-foreground">
                                                                {biome.mobs.passive.join(', ')}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {biome.mobs.neutral.length > 0 && (
                                                        <div>
                                                            <span className="font-medium text-yellow-600 dark:text-yellow-400">
                                                                Neutral:
                                                            </span>{' '}
                                                            <span className="text-muted-foreground">
                                                                {biome.mobs.neutral.join(', ')}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Trees className="size-4 text-blue-600 dark:text-blue-400" />
                                                    <span className="text-sm font-semibold">
                                                        Notable Blocks
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {biome.blocks.join(', ')}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 rounded-lg border border-[oklch(0.72_0.14_75)]/20 bg-[oklch(0.72_0.14_75)]/5 p-3 text-xs dark:border-[oklch(0.75_0.15_75)]/20">
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Temperature:
                                                    </span>
                                                    <p className="font-medium">
                                                        {biome.temperature.toFixed(1)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Rainfall:
                                                    </span>
                                                    <p className="font-medium">
                                                        {biome.rainfall.toFixed(1)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="size-5" />
                            Understanding Biomes
                        </CardTitle>
                        <CardDescription>
                            Learn about biome mechanics and characteristics
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-3">
                                <h4 className="font-semibold">Temperature & Rainfall</h4>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                    <p>
                                        <strong>Temperature:</strong> Determines snow coverage, ice
                                        formation, and affects grass/foliage colors. Ranges from -0.7
                                        (frozen) to 2.0 (scorching).
                                    </p>
                                    <p>
                                        <strong>Rainfall:</strong> Affects whether it rains or snows, and
                                        influences vegetation density. Ranges from 0.0 (no precipitation)
                                        to 1.0 (heavy rain).
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h4 className="font-semibold">Biome Colors</h4>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                    <p>
                                        Each biome has unique grass, foliage, and water colors that create
                                        distinct visual atmospheres. These colors are based on the biome's
                                        temperature and rainfall values.
                                    </p>
                                    <p>
                                        The color squares shown for each biome represent the actual
                                        in-game colors you'll see for grass, leaves, and water.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h4 className="font-semibold">Structures</h4>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                    <p>
                                        Structures are generated features like villages, temples, and
                                        fortresses. They spawn naturally in specific biomes and contain
                                        valuable loot.
                                    </p>
                                    <p>
                                        Some structures like woodland mansions are very rare, while others
                                        like villages are more common. Ocean monuments only spawn in deep
                                        ocean biomes.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h4 className="font-semibold">Mob Spawning</h4>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                    <p>
                                        Different mobs spawn in different biomes. Some biomes like
                                        mushroom fields prevent hostile mob spawning entirely.
                                    </p>
                                    <p>
                                        Biome-specific mobs include polar bears in snowy biomes, pandas in
                                        jungles, and piglins in nether biomes. Temperature affects which
                                        variant of common mobs spawn (e.g., husks in deserts).
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-[oklch(0.72_0.14_75)]/20 bg-[oklch(0.72_0.14_75)]/10 p-4 dark:border-[oklch(0.75_0.15_75)]/20">
                            <h4 className="mb-2 font-semibold text-[oklch(0.55_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                                Finding Biomes
                            </h4>
                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                <p>
                                    Use the <strong>/locatebiome</strong> command to find specific biomes
                                    near you. Example: <code className="rounded bg-muted px-1 py-0.5">/locatebiome minecraft:jungle</code>
                                </p>
                                <p>
                                    Biomes generate in a semi-random pattern based on temperature,
                                    rainfall, and climate zones. Similar biomes tend to cluster together.
                                </p>
                                <p>
                                    Some biomes are much rarer than others. Mushroom fields, eroded
                                    badlands, and modified jungle edge are among the rarest biomes in the
                                    game.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ToolLayout>
        </AppLayout>
    );
}
