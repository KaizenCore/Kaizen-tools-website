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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    brewingSteps,
    getBrewingPathSteps,
    getPotionsByEffect,
    modifierEffects,
    potions,
    type Potion,
} from '@/data/potion-brewing-data';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Beaker,
    BookOpen,
    Flame,
    Info,
    Lightbulb,
    Search,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Potion Brewing Guide',
        href: '/tools/potion-brewing',
    },
];

function formatIngredientName(id: string): string {
    return id
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function PotionDisplay({ potion }: { potion: Potion }) {
    const brewingPath = getBrewingPathSteps(potion);

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <CardTitle className="flex items-center gap-2">
                                <div
                                    className="size-4 rounded-full"
                                    style={{ backgroundColor: potion.color }}
                                />
                                {potion.name}
                            </CardTitle>
                            <CardDescription>Potion Effects</CardDescription>
                        </div>
                        <div
                            className="size-12 rounded-lg border-2"
                            style={{ backgroundColor: potion.color }}
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {potion.effects.map((effect, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-2 rounded-lg border bg-card p-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">
                                    {effect.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    {effect.level && (
                                        <Badge variant="secondary">
                                            {effect.level}
                                        </Badge>
                                    )}
                                    {effect.duration && (
                                        <Badge variant="outline">
                                            {effect.duration}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {effect.description}
                            </p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {brewingPath.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Beaker className="size-5" />
                            Brewing Path
                        </CardTitle>
                        <CardDescription>
                            Follow these steps to brew this potion
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {brewingPath.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 rounded-lg border bg-card p-4"
                                >
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-honey/20 text-sm font-bold text-honey">
                                        {step.step}
                                    </div>
                                    <div className="flex flex-1 items-center gap-2 text-sm">
                                        <span className="font-medium">
                                            Add {formatIngredientName(step.ingredient)}
                                        </span>
                                        <span className="text-muted-foreground">
                                            →
                                        </span>
                                        <span className="text-muted-foreground">
                                            {step.result}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {potion.modifiers && potion.modifiers.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="size-5" />
                            Available Modifiers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            {potion.modifiers.map((modifierId) => {
                                const modifier =
                                    modifierEffects[
                                        modifierId as keyof typeof modifierEffects
                                    ];
                                return (
                                    <div
                                        key={modifierId}
                                        className="flex items-start gap-3 rounded-lg border bg-card p-3"
                                    >
                                        <Sparkles className="size-4 shrink-0 text-purple-500" />
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium">
                                                {modifier.name}
                                            </span>
                                            <p className="text-sm text-muted-foreground">
                                                {modifier.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {potion.tips && potion.tips.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="size-5" />
                            Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="flex flex-col gap-2">
                            {potion.tips.map((tip, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                    <span className="text-honey">•</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default function PotionBrewing() {
    const [selectedPotion, setSelectedPotion] = useState<Potion | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPotions =
        searchTerm.length > 0 ? getPotionsByEffect(searchTerm) : potions;

    const handlePotionSelect = (potionId: string) => {
        const potion = potions.find((p) => p.id === potionId);
        setSelectedPotion(potion || null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Potion Brewing Guide" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Potion Brewing Guide</h1>
                    <p className="text-muted-foreground">
                        Complete guide to brewing potions in Minecraft with
                        recipes, effects, and tips
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Search className="size-5" />
                                    Find a Potion
                                </CardTitle>
                                <CardDescription>
                                    Search by name or effect
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="search">Search</Label>
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="e.g., healing, speed, fire..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="potion-select">
                                        Select Potion
                                    </Label>
                                    <Select
                                        value={selectedPotion?.id || ''}
                                        onValueChange={handlePotionSelect}
                                    >
                                        <SelectTrigger id="potion-select">
                                            <SelectValue placeholder="Choose a potion..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredPotions.map((potion) => (
                                                <SelectItem
                                                    key={potion.id}
                                                    value={potion.id}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="size-3 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    potion.color,
                                                            }}
                                                        />
                                                        {potion.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {filteredPotions.length === 0 && (
                                    <div className="flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm">
                                        <AlertCircle className="size-4 text-yellow-600 dark:text-yellow-400" />
                                        <span className="text-muted-foreground">
                                            No potions found matching your search
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Flame className="size-5" />
                                    Brewing Basics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-3">
                                    {brewingSteps.map((step) => (
                                        <div
                                            key={step.step}
                                            className="flex items-start gap-3 rounded-lg border bg-card p-3"
                                        >
                                            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-honey/20 text-xs font-bold text-honey">
                                                {step.step}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium">
                                                    {step.name}
                                                </span>
                                                <p className="text-sm text-muted-foreground">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="size-5" />
                                    Modifiers
                                </CardTitle>
                                <CardDescription>
                                    Enhance your potions with these ingredients
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2">
                                    {Object.values(modifierEffects).map(
                                        (modifier) => (
                                            <div
                                                key={modifier.name}
                                                className="flex items-start gap-3 rounded-lg border bg-card p-3"
                                            >
                                                <Sparkles className="size-4 shrink-0 text-purple-500" />
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-medium">
                                                            {modifier.name}
                                                        </span>
                                                        <Badge variant="secondary">
                                                            {modifier.effect}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {modifier.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        {selectedPotion ? (
                            <PotionDisplay potion={selectedPotion} />
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="size-5" />
                                        Get Started
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-semibold">
                                                Welcome to the Potion Brewing Guide
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Select a potion from the dropdown to view
                                                its full brewing recipe, effects, and
                                                helpful tips.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-semibold">
                                                Brewing Stand Required
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                You need a brewing stand and blaze powder
                                                as fuel to brew potions. Craft a brewing
                                                stand with 1 blaze rod and 3 cobblestone.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-semibold">
                                                Water Bottles
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                All potions start with water bottles. Fill
                                                glass bottles with water from a cauldron or
                                                water source.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-semibold">
                                                Nether Wart
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Most potions require Nether Wart as the
                                                first ingredient, which creates an Awkward
                                                Potion. Find Nether Wart in Nether
                                                Fortresses.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-semibold">
                                                Brewing Time
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Each brewing step takes 20 seconds. You can
                                                brew up to 3 potions simultaneously in one
                                                brewing stand.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-semibold">
                                                Quick Potion Browser
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Browse all available potions:
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {potions.slice(0, 8).map((potion) => (
                                                    <Button
                                                        key={potion.id}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handlePotionSelect(potion.id)
                                                        }
                                                    >
                                                        <div
                                                            className="size-3 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    potion.color,
                                                            }}
                                                        />
                                                        {potion.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
