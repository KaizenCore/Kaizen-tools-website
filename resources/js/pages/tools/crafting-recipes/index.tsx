import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { craftingRecipes, type Recipe } from '@/data/crafting-recipes';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ToolLayout } from '@/components/tool-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Crafting Recipes',
        href: '/tools/crafting-recipes',
    },
];

const categories = [
    { id: 'all', label: 'All Recipes' },
    { id: 'tools', label: 'Tools' },
    { id: 'weapons', label: 'Weapons' },
    { id: 'armor', label: 'Armor' },
    { id: 'building', label: 'Building' },
    { id: 'redstone', label: 'Redstone' },
    { id: 'food', label: 'Food' },
    { id: 'decoration', label: 'Decoration' },
    { id: 'transportation', label: 'Transportation' },
    { id: 'misc', label: 'Misc' },
];

const materialColors: Record<string, string> = {
    // Wood/Organic
    Planks: '#A0714A',
    Stick: '#9C6F3F',
    Leather: '#C35E24',
    Wool: '#E9ECEC',
    Paper: '#FEFEFE',
    'Sugar Cane': '#93C756',
    Wheat: '#D8C668',
    Book: '#8D5333',
    Feather: '#FFFFFF',

    // Stone/Minerals
    Cobblestone: '#7F7F7F',
    Stone: '#9E9E9E',
    'Iron Ingot': '#D8D8D8',
    'Gold Ingot': '#FCEE4B',
    Diamond: '#5CDBD5',
    Coal: '#433E3B',
    Redstone: '#C50000',
    Quartz: '#E3DBD1',
    Obsidian: '#15132B',
    Brick: '#985542',
    'Block of Iron': '#D8D8D8',
    Flint: '#3C3C3C',

    // Food
    Apple: '#FF0000',
    'Cocoa Beans': '#7B3F00',
    'Milk Bucket': '#FFFFFF',
    Sugar: '#FFFFFF',
    Egg: '#FFF4CC',
    'Red Mushroom': '#C42025',
    'Brown Mushroom': '#9E7962',
    Bowl: '#8D6E57',

    // Misc
    String: '#E0E0E0',
    Slimeball: '#7FC97F',
    'Blaze Rod': '#FFC93C',
    'Redstone Torch': '#C50000',
    Piston: '#B8946F',

    // Default for unknown items
    default: '#8E8E8E',
};

function getIngredientColor(ingredient: string): string {
    return materialColors[ingredient] ?? materialColors.default;
}

interface CraftingGridProps {
    recipe: Recipe;
    size?: 'sm' | 'md' | 'lg';
}

function CraftingGrid({ recipe, size = 'md' }: CraftingGridProps) {
    const cellSize = size === 'sm' ? 'size-8' : size === 'md' ? 'size-12' : 'size-16';
    const fontSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

    return (
        <div className="inline-flex flex-col gap-0.5 rounded-lg bg-gradient-to-br from-amber-900 to-amber-950 p-2 shadow-md">
            {recipe.pattern.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-0.5">
                    {row.map((cell, colIndex) => {
                        const ingredient = cell ? recipe.ingredients[cell] : null;
                        const color = ingredient ? getIngredientColor(ingredient) : undefined;

                        return (
                            <div
                                key={colIndex}
                                className={`${cellSize} flex items-center justify-center rounded border-2 border-stone-700 ${
                                    ingredient
                                        ? 'shadow-inner'
                                        : 'bg-stone-800/50'
                                }`}
                                style={
                                    ingredient
                                        ? {
                                              backgroundColor: color,
                                              boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3)`,
                                          }
                                        : undefined
                                }
                                title={ingredient ?? undefined}
                            >
                                {ingredient && (
                                    <span
                                        className={`${fontSize} font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]`}
                                    >
                                        {cell}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

interface RecipeCardProps {
    recipe: Recipe;
    onClick: () => void;
}

function RecipeCard({ recipe, onClick }: RecipeCardProps) {
    return (
        <Card
            className="group cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
            onClick={onClick}
        >
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">{recipe.name}</CardTitle>
                {recipe.shapeless && (
                    <CardDescription className="text-xs italic">
                        Shapeless Recipe
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <CraftingGrid recipe={recipe} size="sm" />
                <div className="text-center text-sm text-muted-foreground">
                    Yields: {recipe.output.count}x {recipe.name}
                </div>
            </CardContent>
        </Card>
    );
}

interface RecipeDetailDialogProps {
    recipe: Recipe | null;
    isOpen: boolean;
    onClose: () => void;
}

function RecipeDetailDialog({ recipe, isOpen, onClose }: RecipeDetailDialogProps) {
    if (!recipe) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{recipe.name}</DialogTitle>
                    <DialogDescription>
                        Category: {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
                        {recipe.shapeless && ' • Shapeless Recipe'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6">
                    <div className="flex justify-center rounded-lg border bg-gradient-to-br from-slate-50 to-slate-100 p-8 dark:from-slate-900 dark:to-slate-800">
                        <CraftingGrid recipe={recipe} size="lg" />
                    </div>

                    <div>
                        <h3 className="mb-3 font-semibold">Ingredients Required:</h3>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {Object.entries(recipe.ingredients).map(([key, ingredient]) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-3 rounded-lg border bg-card p-3"
                                >
                                    <div
                                        className="size-8 flex-shrink-0 rounded border-2 border-stone-700 shadow-inner"
                                        style={{
                                            backgroundColor: getIngredientColor(ingredient),
                                        }}
                                        title={ingredient}
                                    >
                                        <div className="flex size-full items-center justify-center">
                                            <span className="text-sm font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                                {key}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{ingredient}</div>
                                        <div className="text-xs text-muted-foreground">
                                            Symbol: {key}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border bg-muted/50 p-4">
                        <h3 className="mb-2 font-semibold">Output:</h3>
                        <p className="text-muted-foreground">
                            {recipe.output.count}x {recipe.name}
                        </p>
                    </div>

                    {recipe.shapeless && (
                        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 text-sm">
                            <p className="text-blue-700 dark:text-blue-400">
                                <strong>Shapeless Recipe:</strong> The ingredients can be placed
                                anywhere in the crafting grid, they don't need to follow a specific
                                pattern.
                            </p>
                        </div>
                    )}
                </div>

                <Button onClick={onClose} variant="outline" className="mt-4">
                    <X className="mr-2 size-4" />
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default function CraftingRecipes() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filteredRecipes = useMemo(() => {
        return craftingRecipes.filter((recipe) => {
            const matchesSearch = recipe.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesCategory =
                selectedCategory === 'all' || recipe.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const handleRecipeClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setTimeout(() => {
            setSelectedRecipe(null);
        }, 200);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crafting Recipes" />
            <ToolLayout
                title="Crafting Recipe Viewer"
                description="Browse and search Minecraft crafting recipes"
            >
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search recipes..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                            }}
                            className="pl-9"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                    setSelectedCategory(category.id);
                                }}
                            >
                                {category.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredRecipes.length} recipe
                        {filteredRecipes.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {filteredRecipes.length === 0 ? (
                    <Card className="p-12 text-center">
                        <CardTitle className="mb-2 text-xl">No recipes found</CardTitle>
                        <CardDescription>
                            Try adjusting your search or category filter
                        </CardDescription>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onClick={() => {
                                    handleRecipeClick(recipe);
                                }}
                            />
                        ))}
                    </div>
                )}
            </ToolLayout>

            <RecipeDetailDialog
                recipe={selectedRecipe}
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
            />
        </AppLayout>
    );
}
