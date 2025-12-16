import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    areEnchantmentsCompatible,
    enchantments,
    getEnchantmentsForItem,
    type ItemType,
    itemTypes,
} from '@/data/enchantments';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    Book,
    CheckCircle2,
    Info,
    Plus,
    Sparkles,
    Trash2,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Enchantment Calculator',
        href: '/tools/enchantment-calculator',
    },
];

interface SelectedEnchantment {
    id: string;
    level: number;
}

interface CombineStep {
    item1: string;
    item2: string;
    result: string;
    cost: number;
    priorWork1: number;
    priorWork2: number;
}

const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V'];

function toRoman(num: number): string {
    return romanNumerals[num] || num.toString();
}

function calculateAnvilCost(
    enchantmentLevel: number,
    multiplier: number,
): number {
    return enchantmentLevel * multiplier;
}

function calculatePriorWorkPenalty(priorWork: number): number {
    return Math.pow(2, priorWork) - 1;
}

export default function EnchantmentCalculator() {
    const [selectedItem, setSelectedItem] = useState<ItemType>('sword');
    const [selectedEnchantments, setSelectedEnchantments] = useState<
        SelectedEnchantment[]
    >([]);
    const [selectedEnchantment, setSelectedEnchantment] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<number>(1);

    const availableEnchantments = getEnchantmentsForItem(selectedItem);
    const currentEnchantmentIds = selectedEnchantments.map((e) => e.id);

    const compatibleEnchantments = availableEnchantments.filter((enc) => {
        if (currentEnchantmentIds.includes(enc.id)) {
            return false;
        }

        return currentEnchantmentIds.every((existingId) =>
            areEnchantmentsCompatible(enc.id, existingId),
        );
    });

    const handleAddEnchantment = () => {
        if (!selectedEnchantment) {
            return;
        }

        const enc = enchantments.find((e) => e.id === selectedEnchantment);
        if (!enc) {
            return;
        }

        setSelectedEnchantments([
            ...selectedEnchantments,
            { id: selectedEnchantment, level: selectedLevel },
        ]);
        setSelectedEnchantment('');
        setSelectedLevel(1);
    };

    const handleRemoveEnchantment = (index: number) => {
        setSelectedEnchantments(selectedEnchantments.filter((_, i) => i !== index));
    };

    const handleItemChange = (item: ItemType) => {
        setSelectedItem(item);
        setSelectedEnchantments([]);
        setSelectedEnchantment('');
        setSelectedLevel(1);
    };

    const calculateOptimalCombining = (): {
        steps: CombineStep[];
        totalCost: number;
        isTooExpensive: boolean;
    } => {
        if (selectedEnchantments.length === 0) {
            return { steps: [], totalCost: 0, isTooExpensive: false };
        }

        const steps: CombineStep[] = [];
        let totalCost = 0;

        const enchantmentsCopy = selectedEnchantments
            .map((se) => {
                const enc = enchantments.find((e) => e.id === se.id);
                return enc
                    ? {
                          ...se,
                          cost: calculateAnvilCost(se.level, enc.bookCost),
                      }
                    : null;
            })
            .filter((e): e is NonNullable<typeof e> => e !== null)
            .sort((a, b) => b.cost - a.cost);

        let items: Array<{
            name: string;
            enchantments: SelectedEnchantment[];
            priorWork: number;
        }> = [
            {
                name: 'Item',
                enchantments: [],
                priorWork: 0,
            },
        ];

        enchantmentsCopy.forEach((se, index) => {
            const enc = enchantments.find((e) => e.id === se.id);
            if (!enc) {
                return;
            }

            const bookName = `Book ${index + 1}`;
            const targetItem = items[0];

            const baseCost = calculateAnvilCost(se.level, enc.anvilCost);
            const priorWorkPenalty =
                calculatePriorWorkPenalty(targetItem.priorWork) +
                calculatePriorWorkPenalty(0);
            const stepCost = baseCost + priorWorkPenalty;

            steps.push({
                item1: targetItem.name,
                item2: bookName,
                result: 'Item',
                cost: stepCost,
                priorWork1: targetItem.priorWork,
                priorWork2: 0,
            });

            totalCost += stepCost;
            targetItem.enchantments.push(se);
            targetItem.priorWork += 1;
        });

        const isTooExpensive = steps.some((step) => step.cost > 39);

        return { steps, totalCost, isTooExpensive };
    };

    const { steps, totalCost, isTooExpensive } = calculateOptimalCombining();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enchantment Calculator" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Enchantment Calculator</h1>
                    <p className="text-muted-foreground">
                        Calculate optimal anvil combining order and XP costs for
                        enchantments
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="size-5" />
                                    Select Item
                                </CardTitle>
                                <CardDescription>
                                    Choose the item type to enchant
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="item-select">Item Type</Label>
                                    <Select
                                        value={selectedItem}
                                        onValueChange={(value) =>
                                            handleItemChange(value as ItemType)
                                        }
                                    >
                                        <SelectTrigger id="item-select">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {itemTypes.map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {item
                                                        .split('_')
                                                        .map(
                                                            (word) =>
                                                                word.charAt(0).toUpperCase() +
                                                                word.slice(1),
                                                        )
                                                        .join(' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Book className="size-5" />
                                    Add Enchantment
                                </CardTitle>
                                <CardDescription>
                                    Add enchantments to your item
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="enchantment-select">
                                        Enchantment
                                    </Label>
                                    <Select
                                        value={selectedEnchantment}
                                        onValueChange={setSelectedEnchantment}
                                    >
                                        <SelectTrigger
                                            id="enchantment-select"
                                            disabled={
                                                compatibleEnchantments.length === 0
                                            }
                                        >
                                            <SelectValue
                                                placeholder={
                                                    compatibleEnchantments.length === 0
                                                        ? 'No compatible enchantments'
                                                        : 'Select enchantment'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {compatibleEnchantments.map((enc) => (
                                                <SelectItem key={enc.id} value={enc.id}>
                                                    {enc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedEnchantment && (
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="level-select">Level</Label>
                                        <Select
                                            value={selectedLevel.toString()}
                                            onValueChange={(value) =>
                                                setSelectedLevel(parseInt(value))
                                            }
                                        >
                                            <SelectTrigger id="level-select">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from(
                                                    {
                                                        length:
                                                            enchantments.find(
                                                                (e) =>
                                                                    e.id ===
                                                                    selectedEnchantment,
                                                            )?.maxLevel || 1,
                                                    },
                                                    (_, i) => i + 1,
                                                ).map((level) => (
                                                    <SelectItem
                                                        key={level}
                                                        value={level.toString()}
                                                    >
                                                        {toRoman(level)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <Button
                                    onClick={handleAddEnchantment}
                                    disabled={!selectedEnchantment}
                                    className="w-full"
                                >
                                    <Plus className="size-4" />
                                    Add Enchantment
                                </Button>
                            </CardContent>
                        </Card>

                        {selectedEnchantments.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Selected Enchantments ({selectedEnchantments.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-2">
                                        {selectedEnchantments.map((se, index) => {
                                            const enc = enchantments.find(
                                                (e) => e.id === se.id,
                                            );
                                            if (!enc) {
                                                return null;
                                            }

                                            return (
                                                <div
                                                    key={`${se.id}-${index}`}
                                                    className="flex items-center justify-between rounded-lg border bg-card p-3"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Zap className="size-4 text-purple-500" />
                                                        <span className="font-medium">
                                                            {enc.name} {toRoman(se.level)}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRemoveEnchantment(index)
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

                    <div className="flex flex-col gap-6">
                        {selectedEnchantments.length > 0 ? (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CheckCircle2 className="size-5" />
                                            XP Cost Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <span className="text-lg font-semibold">
                                                Total XP Levels Needed
                                            </span>
                                            <span
                                                className={`text-2xl font-bold ${
                                                    isTooExpensive
                                                        ? 'text-red-600 dark:text-red-400'
                                                        : 'text-green-700 dark:text-green-400'
                                                }`}
                                            >
                                                {totalCost}
                                            </span>
                                        </div>

                                        {isTooExpensive && (
                                            <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                                                <AlertTriangle className="size-5 shrink-0 text-red-700 dark:text-red-400" />
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="font-semibold text-red-700 dark:text-red-400">
                                                        Too Expensive!
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        One or more anvil operations exceed
                                                        39 levels. This combination cannot be
                                                        made in survival Minecraft.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Combining Order</CardTitle>
                                        <CardDescription>
                                            Follow these steps to minimize XP cost
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-3">
                                            {steps.map((step, index) => {
                                                const isTooExpensiveStep = step.cost > 39;

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`flex flex-col gap-2 rounded-lg border p-4 ${
                                                            isTooExpensiveStep
                                                                ? 'border-red-500/20 bg-red-500/5'
                                                                : 'bg-card'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-muted-foreground">
                                                                Step {index + 1}
                                                            </span>
                                                            <span
                                                                className={`text-lg font-bold ${
                                                                    isTooExpensiveStep
                                                                        ? 'text-red-600 dark:text-red-400'
                                                                        : 'text-green-700 dark:text-green-400'
                                                                }`}
                                                            >
                                                                {step.cost} levels
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="font-medium">
                                                                {step.item1}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                +
                                                            </span>
                                                            <span className="font-medium">
                                                                {step.item2}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                →
                                                            </span>
                                                            <span className="font-medium">
                                                                {step.result}
                                                            </span>
                                                        </div>
                                                        {(step.priorWork1 > 0 ||
                                                            step.priorWork2 > 0) && (
                                                            <div className="text-xs text-muted-foreground">
                                                                Prior work penalty:{' '}
                                                                {calculatePriorWorkPenalty(
                                                                    step.priorWork1,
                                                                ) +
                                                                    calculatePriorWorkPenalty(
                                                                        step.priorWork2,
                                                                    )}{' '}
                                                                levels
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
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
                                                How to use this calculator
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Select an item type and add enchantments to
                                                see the optimal combining order and total XP
                                                cost.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-semibold">
                                                Anvil Mechanics
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Each time an item is used in an anvil, it
                                                gains a prior work penalty. This calculator
                                                helps you minimize this penalty by showing
                                                the optimal order to combine enchantments.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-semibold">
                                                Level Limit
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                In survival Minecraft, anvil operations that
                                                cost more than 39 levels will show "Too
                                                Expensive!" and cannot be completed.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-semibold">
                                                Incompatible Enchantments
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Some enchantments cannot be combined (e.g.,
                                                Sharpness and Smite). The calculator will
                                                only show compatible enchantments.
                                            </p>
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
