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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OutputPanel, ToolLayout } from '@/components/tool-layout';
import {
    minecraftItems,
    recipeCategories,
    recipeTypes,
} from '@/data/recipe-generator-data';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Check,
    Copy,
    Download,
    RotateCcw,
    Search,
    Sparkles,
    X,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Recipe Generator',
        href: '/tools/recipe-generator',
    },
];

type GridCell = string | null;

export default function RecipeGenerator() {
    const [recipeType, setRecipeType] = useState('crafting_shaped');
    const [copied, setCopied] = useState(false);

    // Common recipe fields
    const [namespace, setNamespace] = useState('custom');
    const [recipePath, setRecipePath] = useState('my_recipe');
    const [resultItem, setResultItem] = useState('diamond');
    const [resultCount, setResultCount] = useState('1');
    const [recipeCategory, setRecipeCategory] = useState('misc');

    // Shaped crafting state
    const [craftingGrid, setCraftingGrid] = useState<GridCell[]>(
        Array(9).fill(null),
    );
    const [selectedGridItem, setSelectedGridItem] = useState<string | null>(
        null,
    );

    // Shapeless crafting state
    const [shapelessIngredients, setShapelessIngredients] = useState<string[]>(
        [],
    );

    // Cooking recipes state (smelting, blasting, smoking, campfire)
    const [cookingInput, setCookingInput] = useState('raw_iron');
    const [cookingExperience, setCookingExperience] = useState('0.7');
    const [cookingTime, setCookingTime] = useState('200');

    // Stonecutting state
    const [stonecuttingInput, setStonecuttingInput] = useState('stone');
    const [stonecuttingCount, setStonecuttingCount] = useState('1');

    // Smithing state
    const [smithingTemplate, setSmithingTemplate] = useState(
        'netherite_upgrade_smithing_template',
    );
    const [smithingBase, setSmithingBase] = useState('diamond_sword');
    const [smithingAddition, setSmithingAddition] = useState('netherite_ingot');

    // Item search
    const [itemSearch, setItemSearch] = useState('');

    const filteredItems = minecraftItems.filter(
        (item) =>
            item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
            item.id.toLowerCase().includes(itemSearch.toLowerCase()),
    );

    const handleGridClick = (index: number) => {
        if (selectedGridItem) {
            const newGrid = [...craftingGrid];
            newGrid[index] = selectedGridItem;
            setCraftingGrid(newGrid);
        }
    };

    const clearGridCell = (index: number) => {
        const newGrid = [...craftingGrid];
        newGrid[index] = null;
        setCraftingGrid(newGrid);
    };

    const addShapelessIngredient = () => {
        if (selectedGridItem && shapelessIngredients.length < 9) {
            setShapelessIngredients([
                ...shapelessIngredients,
                selectedGridItem,
            ]);
        }
    };

    const removeShapelessIngredient = (index: number) => {
        setShapelessIngredients(
            shapelessIngredients.filter((_, i) => i !== index),
        );
    };

    const reset = () => {
        setCraftingGrid(Array(9).fill(null));
        setShapelessIngredients([]);
        setNamespace('custom');
        setRecipePath('my_recipe');
        setResultItem('diamond');
        setResultCount('1');
        setRecipeCategory('misc');
        setCookingInput('raw_iron');
        setCookingExperience('0.7');
        setCookingTime('200');
        setStonecuttingInput('stone');
        setStonecuttingCount('1');
        setSmithingTemplate('netherite_upgrade_smithing_template');
        setSmithingBase('diamond_sword');
        setSmithingAddition('netherite_ingot');
    };

    const generateShapedRecipe = () => {
        const pattern: string[] = [];
        const key: Record<string, { item: string }> = {};
        const usedSymbols = new Set<string>();
        const symbols = 'ABCDEFGHI'.split('');

        // Convert grid to pattern and key
        for (let row = 0; row < 3; row++) {
            let rowPattern = '';
            for (let col = 0; col < 3; col++) {
                const index = row * 3 + col;
                const item = craftingGrid[index];

                if (item) {
                    let symbol = '';
                    const existingKey = Object.entries(key).find(
                        ([, value]) => value.item === `minecraft:${item}`,
                    );

                    if (existingKey) {
                        symbol = existingKey[0];
                    } else {
                        symbol =
                            symbols.find((s) => !usedSymbols.has(s)) || 'X';
                        usedSymbols.add(symbol);
                        key[symbol] = { item: `minecraft:${item}` };
                    }

                    rowPattern += symbol;
                } else {
                    rowPattern += ' ';
                }
            }

            pattern.push(rowPattern);
        }

        // Trim empty rows and columns
        while (pattern.length > 0 && pattern[0].trim() === '') {
            pattern.shift();
        }
        while (
            pattern.length > 0 &&
            pattern[pattern.length - 1].trim() === ''
        ) {
            pattern.pop();
        }

        const recipe = {
            type: 'minecraft:crafting_shaped',
            category: recipeCategory,
            pattern,
            key,
            result: {
                id: `minecraft:${resultItem}`,
                count: Number.parseInt(resultCount),
            },
        };

        return JSON.stringify(recipe, null, 2);
    };

    const generateShapelessRecipe = () => {
        const recipe = {
            type: 'minecraft:crafting_shapeless',
            category: recipeCategory,
            ingredients: shapelessIngredients.map((item) => ({
                item: `minecraft:${item}`,
            })),
            result: {
                id: `minecraft:${resultItem}`,
                count: Number.parseInt(resultCount),
            },
        };

        return JSON.stringify(recipe, null, 2);
    };

    const generateCookingRecipe = () => {
        const typeMap: Record<string, string> = {
            smelting: 'minecraft:smelting',
            blasting: 'minecraft:blasting',
            smoking: 'minecraft:smoking',
            campfire_cooking: 'minecraft:campfire_cooking',
        };

        const recipe = {
            type: typeMap[recipeType] || 'minecraft:smelting',
            category: recipeCategory,
            ingredient: {
                item: `minecraft:${cookingInput}`,
            },
            result: {
                id: `minecraft:${resultItem}`,
            },
            experience: Number.parseFloat(cookingExperience),
            cookingtime: Number.parseInt(cookingTime),
        };

        return JSON.stringify(recipe, null, 2);
    };

    const generateStonecuttingRecipe = () => {
        const recipe = {
            type: 'minecraft:stonecutting',
            ingredient: {
                item: `minecraft:${stonecuttingInput}`,
            },
            result: {
                id: `minecraft:${resultItem}`,
                count: Number.parseInt(stonecuttingCount),
            },
        };

        return JSON.stringify(recipe, null, 2);
    };

    const generateSmithingRecipe = () => {
        const recipe = {
            type: 'minecraft:smithing_transform',
            template: {
                item: `minecraft:${smithingTemplate}`,
            },
            base: {
                item: `minecraft:${smithingBase}`,
            },
            addition: {
                item: `minecraft:${smithingAddition}`,
            },
            result: {
                id: `minecraft:${resultItem}`,
            },
        };

        return JSON.stringify(recipe, null, 2);
    };

    const generateRecipe = () => {
        switch (recipeType) {
            case 'crafting_shaped':
                return generateShapedRecipe();
            case 'crafting_shapeless':
                return generateShapelessRecipe();
            case 'smelting':
            case 'blasting':
            case 'smoking':
            case 'campfire_cooking':
                return generateCookingRecipe();
            case 'stonecutting':
                return generateStonecuttingRecipe();
            case 'smithing_transform':
                return generateSmithingRecipe();
            default:
                return '{}';
        }
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(generateRecipe());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadRecipe = () => {
        const recipe = generateRecipe();
        const blob = new Blob([recipe], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${namespace}/${recipePath}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const loadPreset = (preset: string) => {
        switch (preset) {
            case 'diamond_sword':
                setRecipeType('crafting_shaped');
                setResultItem('diamond_sword');
                setResultCount('1');
                setCraftingGrid([
                    null,
                    'diamond',
                    null,
                    null,
                    'diamond',
                    null,
                    null,
                    'stick',
                    null,
                ]);
                break;
            case 'iron_ingot':
                setRecipeType('smelting');
                setCookingInput('raw_iron');
                setResultItem('iron_ingot');
                setResultCount('1');
                setCookingExperience('0.7');
                setCookingTime('200');
                break;
            case 'stone_stairs':
                setRecipeType('stonecutting');
                setStonecuttingInput('stone');
                setResultItem('stone_stairs');
                setStonecuttingCount('1');
                break;
            case 'netherite_sword':
                setRecipeType('smithing_transform');
                setSmithingTemplate('netherite_upgrade_smithing_template');
                setSmithingBase('diamond_sword');
                setSmithingAddition('netherite_ingot');
                setResultItem('netherite_sword');
                break;
        }
    };

    const getItemByName = (id: string) => {
        return minecraftItems.find((item) => item.id === id);
    };

    const sidebar = (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Presets</CardTitle>
                    <CardDescription>
                        Load common recipe examples
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button
                        onClick={() => loadPreset('diamond_sword')}
                        variant="outline"
                        className="w-full justify-start"
                    >
                        <Sparkles className="mr-2 size-4" />
                        Diamond Sword
                    </Button>
                    <Button
                        onClick={() => loadPreset('iron_ingot')}
                        variant="outline"
                        className="w-full justify-start"
                    >
                        <Sparkles className="mr-2 size-4" />
                        Iron Ingot (Smelting)
                    </Button>
                    <Button
                        onClick={() => loadPreset('stone_stairs')}
                        variant="outline"
                        className="w-full justify-start"
                    >
                        <Sparkles className="mr-2 size-4" />
                        Stone Stairs (Stonecutting)
                    </Button>
                    <Button
                        onClick={() =>
                            loadPreset('netherite_sword')
                        }
                        variant="outline"
                        className="w-full justify-start"
                    >
                        <Sparkles className="mr-2 size-4" />
                        Netherite Sword (Smithing)
                    </Button>
                </CardContent>
            </Card>

            <OutputPanel
                title="JSON Output"
                actions={
                    <>
                        <Button
                            onClick={copyToClipboard}
                            variant="ghost"
                            size="sm"
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
                        <Button
                            onClick={downloadRecipe}
                            variant="ghost"
                            size="sm"
                        >
                            <Download className="mr-1 size-3" />
                            Download
                        </Button>
                    </>
                }
            >
                <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                    <pre className="text-xs">
                        <code>{generateRecipe()}</code>
                    </pre>
                </div>

                <Button
                    onClick={reset}
                    variant="outline"
                    className="w-full"
                >
                    <RotateCcw className="mr-2 size-4" />
                    Reset
                </Button>
            </OutputPanel>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">How to Use</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                    <div>
                        <strong className="text-foreground">
                            1. Choose recipe type
                        </strong>
                        <p className="text-muted-foreground">
                            Select between shaped crafting,
                            shapeless, cooking, stonecutting, or
                            smithing.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            2. Configure the recipe
                        </strong>
                        <p className="text-muted-foreground">
                            Set up ingredients, patterns, and
                            cooking parameters as needed.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            3. Set result and settings
                        </strong>
                        <p className="text-muted-foreground">
                            Define the output item, count, and file
                            location for your datapack.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <strong className="text-foreground">
                            4. Download or copy
                        </strong>
                        <p className="text-muted-foreground">
                            Save the JSON file to
                            data/namespace/recipe/ in your
                            datapack.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recipe Generator" />
            <ToolLayout
                title="Minecraft Recipe Generator"
                description="Generate custom datapack recipes for crafting, smelting, smithing, and more"
                sidebar={sidebar}
            >
                        <Card>
                            <CardHeader>
                                <CardTitle>Recipe Type</CardTitle>
                                <CardDescription>
                                    Select the type of recipe you want to create
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs
                                    value={recipeType}
                                    onValueChange={setRecipeType}
                                >
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="crafting_shaped">
                                            Shaped
                                        </TabsTrigger>
                                        <TabsTrigger value="crafting_shapeless">
                                            Shapeless
                                        </TabsTrigger>
                                        <TabsTrigger value="smelting">
                                            Cooking
                                        </TabsTrigger>
                                        <TabsTrigger value="stonecutting">
                                            Other
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent
                                        value="crafting_shaped"
                                        className="space-y-4"
                                    >
                                        <div>
                                            <Label>Crafting Grid</Label>
                                            <p className="mb-3 text-sm text-muted-foreground">
                                                Click a cell, then select an item
                                                below to place it
                                            </p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {craftingGrid.map(
                                                    (item, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() =>
                                                                handleGridClick(
                                                                    index,
                                                                )
                                                            }
                                                            className="group relative flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 transition-all hover:border-primary hover:bg-muted"
                                                        >
                                                            {item ? (
                                                                <>
                                                                    <span className="text-xs font-medium">
                                                                        {
                                                                            getItemByName(
                                                                                item,
                                                                            )
                                                                                ?.name
                                                                        }
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            clearGridCell(
                                                                                index,
                                                                            );
                                                                        }}
                                                                        className="absolute right-1 top-1 hidden rounded bg-destructive p-0.5 text-white transition-opacity group-hover:block"
                                                                    >
                                                                        <X className="size-3" />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <span className="text-2xl text-muted-foreground/50">
                                                                    +
                                                                </span>
                                                            )}
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value="crafting_shapeless"
                                        className="space-y-4"
                                    >
                                        <div>
                                            <Label>Ingredients</Label>
                                            <p className="mb-3 text-sm text-muted-foreground">
                                                Add up to 9 ingredients in any order
                                            </p>
                                            {shapelessIngredients.length > 0 && (
                                                <div className="mb-3 flex flex-wrap gap-2">
                                                    {shapelessIngredients.map(
                                                        (item, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-sm"
                                                            >
                                                                {
                                                                    getItemByName(
                                                                        item,
                                                                    )?.name
                                                                }
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeShapelessIngredient(
                                                                            index,
                                                                        )
                                                                    }
                                                                    className="text-destructive"
                                                                >
                                                                    <X className="size-3" />
                                                                </button>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                            <Button
                                                onClick={addShapelessIngredient}
                                                disabled={
                                                    !selectedGridItem ||
                                                    shapelessIngredients.length >=
                                                        9
                                                }
                                                className="w-full"
                                            >
                                                Add Ingredient (
                                                {shapelessIngredients.length}/9)
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value="smelting"
                                        className="space-y-4"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Cooking Type</Label>
                                                <Select
                                                    value={recipeType}
                                                    onValueChange={setRecipeType}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="smelting">
                                                            Smelting (Furnace)
                                                        </SelectItem>
                                                        <SelectItem value="blasting">
                                                            Blasting (Blast
                                                            Furnace)
                                                        </SelectItem>
                                                        <SelectItem value="smoking">
                                                            Smoking (Smoker)
                                                        </SelectItem>
                                                        <SelectItem value="campfire_cooking">
                                                            Campfire Cooking
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label>Input Item</Label>
                                                <Select
                                                    value={cookingInput}
                                                    onValueChange={setCookingInput}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {minecraftItems
                                                            .slice(0, 50)
                                                            .map((item) => (
                                                                <SelectItem
                                                                    key={item.id}
                                                                    value={
                                                                        item.id
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Experience</Label>
                                                    <Input
                                                        type="number"
                                                        value={cookingExperience}
                                                        onChange={(e) =>
                                                            setCookingExperience(
                                                                e.target.value,
                                                            )
                                                        }
                                                        step="0.1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>
                                                        Cooking Time (ticks)
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        value={cookingTime}
                                                        onChange={(e) =>
                                                            setCookingTime(
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value="stonecutting"
                                        className="space-y-4"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Recipe Type</Label>
                                                <Select
                                                    value={recipeType}
                                                    onValueChange={setRecipeType}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="stonecutting">
                                                            Stonecutting
                                                        </SelectItem>
                                                        <SelectItem value="smithing_transform">
                                                            Smithing Transform
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {recipeType === 'stonecutting' && (
                                                <>
                                                    <div>
                                                        <Label>Input Item</Label>
                                                        <Select
                                                            value={
                                                                stonecuttingInput
                                                            }
                                                            onValueChange={
                                                                setStonecuttingInput
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {minecraftItems
                                                                    .filter(
                                                                        (item) =>
                                                                            item.category ===
                                                                            'building',
                                                                    )
                                                                    .map(
                                                                        (
                                                                            item,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    item.id
                                                                                }
                                                                                value={
                                                                                    item.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label>Output Count</Label>
                                                        <Input
                                                            type="number"
                                                            value={
                                                                stonecuttingCount
                                                            }
                                                            onChange={(e) =>
                                                                setStonecuttingCount(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            min="1"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {recipeType ===
                                                'smithing_transform' && (
                                                <>
                                                    <div>
                                                        <Label>Template</Label>
                                                        <Select
                                                            value={
                                                                smithingTemplate
                                                            }
                                                            onValueChange={
                                                                setSmithingTemplate
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="netherite_upgrade_smithing_template">
                                                                    Netherite
                                                                    Upgrade
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label>Base Item</Label>
                                                        <Select
                                                            value={smithingBase}
                                                            onValueChange={
                                                                setSmithingBase
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {minecraftItems
                                                                    .filter(
                                                                        (item) =>
                                                                            item.category ===
                                                                                'tools' ||
                                                                            item.category ===
                                                                                'combat',
                                                                    )
                                                                    .map(
                                                                        (
                                                                            item,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    item.id
                                                                                }
                                                                                value={
                                                                                    item.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label>Addition Item</Label>
                                                        <Select
                                                            value={
                                                                smithingAddition
                                                            }
                                                            onValueChange={
                                                                setSmithingAddition
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {minecraftItems
                                                                    .filter(
                                                                        (item) =>
                                                                            item.category ===
                                                                            'materials',
                                                                    )
                                                                    .map(
                                                                        (
                                                                            item,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    item.id
                                                                                }
                                                                                value={
                                                                                    item.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Result & Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label>Namespace</Label>
                                        <Input
                                            value={namespace}
                                            onChange={(e) =>
                                                setNamespace(e.target.value)
                                            }
                                            placeholder="custom"
                                        />
                                    </div>
                                    <div>
                                        <Label>Recipe Path</Label>
                                        <Input
                                            value={recipePath}
                                            onChange={(e) =>
                                                setRecipePath(e.target.value)
                                            }
                                            placeholder="my_recipe"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label>Result Item</Label>
                                        <Select
                                            value={resultItem}
                                            onValueChange={setResultItem}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {minecraftItems
                                                    .slice(0, 100)
                                                    .map((item) => (
                                                        <SelectItem
                                                            key={item.id}
                                                            value={item.id}
                                                        >
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Result Count</Label>
                                        <Input
                                            type="number"
                                            value={resultCount}
                                            onChange={(e) =>
                                                setResultCount(e.target.value)
                                            }
                                            min="1"
                                        />
                                    </div>
                                </div>

                                {(recipeType === 'crafting_shaped' ||
                                    recipeType === 'crafting_shapeless' ||
                                    recipeType === 'smelting' ||
                                    recipeType === 'blasting' ||
                                    recipeType === 'smoking' ||
                                    recipeType === 'campfire_cooking') && (
                                    <div>
                                        <Label>Recipe Book Category</Label>
                                        <Select
                                            value={recipeCategory}
                                            onValueChange={setRecipeCategory}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {recipeCategories.map((cat) => (
                                                    <SelectItem
                                                        key={cat}
                                                        value={cat}
                                                    >
                                                        {cat
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            cat.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Item Selector</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        value={itemSearch}
                                        onChange={(e) =>
                                            setItemSearch(e.target.value)
                                        }
                                        placeholder="Search items..."
                                        className="pl-9"
                                    />
                                </div>

                                <div className="grid max-h-96 grid-cols-2 gap-2 overflow-y-auto rounded-lg border p-3 md:grid-cols-3">
                                    {filteredItems.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedGridItem(item.id)
                                            }
                                            className="rounded-lg border-2 px-3 py-2 text-left text-sm transition-all hover:bg-muted"
                                            style={{
                                                borderColor:
                                                    selectedGridItem === item.id
                                                        ? 'hsl(var(--primary))'
                                                        : 'transparent',
                                            }}
                                        >
                                            <div className="font-medium">
                                                {item.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.id}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
            </ToolLayout>
        </AppLayout>
    );
}
