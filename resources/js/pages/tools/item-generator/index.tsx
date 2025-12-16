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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    attributeModifiers,
    attributeOperations,
    categoryNames,
    enchantments,
    equipmentSlots,
    hideFlags,
    minecraftItems,
    rarityLevels,
    type AttributeModifierOperation,
    type EquipmentSlot,
    type HideFlag,
    type ItemCategory,
    type MinecraftItem,
    type Rarity,
} from '@/data/item-generator-data';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
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
        title: 'Item Generator',
        href: '/item-generator',
    },
];

interface SelectedEnchantment {
    id: string;
    level: number;
}

interface AttributeModifierItem {
    id: string;
    attribute: string;
    amount: number;
    operation: AttributeModifierOperation;
    slot: EquipmentSlot;
    uuid?: string;
}

export default function ItemGenerator() {
    const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>(
        'all',
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<MinecraftItem | null>(null);
    const [itemCount, setItemCount] = useState(1);
    const [customName, setCustomName] = useState('');
    const [loreLines, setLoreLines] = useState<string[]>(['']);
    const [isUnbreakable, setIsUnbreakable] = useState(false);
    const [customModelData, setCustomModelData] = useState('');
    const [selectedEnchantments, setSelectedEnchantments] = useState<
        SelectedEnchantment[]
    >([]);
    const [attributeModifiersList, setAttributeModifiersList] = useState<
        AttributeModifierItem[]
    >([]);
    const [selectedHideFlags, setSelectedHideFlags] = useState<HideFlag[]>([]);
    const [selectedRarity, setSelectedRarity] = useState<Rarity | ''>('');
    const [durabilityValue, setDurabilityValue] = useState<number | ''>('');
    const [targetSelector, setTargetSelector] = useState('@p');
    const [copiedMessage, setCopiedMessage] = useState(false);

    const filteredItems = minecraftItems.filter((item) => {
        const matchesCategory =
            selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch =
            searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            (c) => {
                const r = (Math.random() * 16) | 0;
                const v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            },
        );
    };

    const addEnchantment = () => {
        setSelectedEnchantments([
            ...selectedEnchantments,
            { id: '', level: 1 },
        ]);
    };

    const removeEnchantment = (index: number) => {
        setSelectedEnchantments(
            selectedEnchantments.filter((_, i) => i !== index),
        );
    };

    const updateEnchantment = (
        index: number,
        field: 'id' | 'level',
        value: string | number,
    ) => {
        const updated = [...selectedEnchantments];
        if (field === 'id') {
            updated[index].id = value as string;
        } else {
            updated[index].level = Number(value);
        }
        setSelectedEnchantments(updated);
    };

    const addAttributeModifier = () => {
        setAttributeModifiersList([
            ...attributeModifiersList,
            {
                id: generateUUID(),
                attribute: '',
                amount: 0,
                operation: 'add_value',
                slot: 'any',
            },
        ]);
    };

    const removeAttributeModifier = (id: string) => {
        setAttributeModifiersList(
            attributeModifiersList.filter((mod) => mod.id !== id),
        );
    };

    const updateAttributeModifier = (
        id: string,
        field: keyof AttributeModifierItem,
        value: string | number,
    ) => {
        const updated = attributeModifiersList.map((mod) => {
            if (mod.id === id) {
                return { ...mod, [field]: value };
            }
            return mod;
        });
        setAttributeModifiersList(updated);
    };

    const addLoreLine = () => {
        setLoreLines([...loreLines, '']);
    };

    const updateLoreLine = (index: number, value: string) => {
        const updated = [...loreLines];
        updated[index] = value;
        setLoreLines(updated);
    };

    const removeLoreLine = (index: number) => {
        setLoreLines(loreLines.filter((_, i) => i !== index));
    };

    const toggleHideFlag = (flag: HideFlag) => {
        if (selectedHideFlags.includes(flag)) {
            setSelectedHideFlags(selectedHideFlags.filter((f) => f !== flag));
        } else {
            setSelectedHideFlags([...selectedHideFlags, flag]);
        }
    };

    const applyPreset = (preset: string) => {
        if (!selectedItem) {
            return;
        }

        switch (preset) {
            case 'super_sword':
                if (selectedItem.id.includes('sword')) {
                    setSelectedEnchantments([
                        { id: 'sharpness', level: 5 },
                        { id: 'looting', level: 3 },
                        { id: 'sweeping_edge', level: 3 },
                        { id: 'fire_aspect', level: 2 },
                        { id: 'knockback', level: 2 },
                        { id: 'unbreaking', level: 3 },
                        { id: 'mending', level: 1 },
                    ]);
                    setCustomName('§6§lSuper Sword');
                    setIsUnbreakable(false);
                }
                break;
            case 'speed_boots':
                if (selectedItem.id.includes('boots')) {
                    setAttributeModifiersList([
                        {
                            id: generateUUID(),
                            attribute: 'generic.movement_speed',
                            amount: 0.1,
                            operation: 'add_multiplied_base',
                            slot: 'feet',
                        },
                    ]);
                    setSelectedEnchantments([
                        { id: 'protection', level: 4 },
                        { id: 'feather_falling', level: 4 },
                        { id: 'depth_strider', level: 3 },
                        { id: 'soul_speed', level: 3 },
                        { id: 'unbreaking', level: 3 },
                        { id: 'mending', level: 1 },
                    ]);
                    setCustomName('§b§lSpeed Boots');
                }
                break;
            case 'unbreakable_pickaxe':
                if (selectedItem.id.includes('pickaxe')) {
                    setIsUnbreakable(true);
                    setSelectedEnchantments([
                        { id: 'efficiency', level: 5 },
                        { id: 'fortune', level: 3 },
                    ]);
                    setCustomName('§e§lUnbreakable Pickaxe');
                }
                break;
            case 'custom_named':
                setCustomName('§d§lCustom Item');
                setLoreLines(['§7A special item', '§7with custom properties']);
                break;
        }
    };

    const generateCommand = (): string => {
        if (!selectedItem) {
            return '';
        }

        let nbtData = '';
        const nbtParts: string[] = [];

        if (customName) {
            nbtParts.push(`display:{Name:'{"text":"${customName}"}'}`);
        }

        if (loreLines.some((line) => line.trim() !== '')) {
            const loreArray = loreLines
                .filter((line) => line.trim() !== '')
                .map((line) => `'{"text":"${line}"}'`)
                .join(',');
            if (nbtParts.some((part) => part.startsWith('display:'))) {
                nbtParts[nbtParts.findIndex((p) => p.startsWith('display:'))] =
                    nbtParts[nbtParts.findIndex((p) => p.startsWith('display:'))].replace('}', `,Lore:[${loreArray}]}`);
            } else {
                nbtParts.push(`display:{Lore:[${loreArray}]}`);
            }
        }

        if (isUnbreakable) {
            nbtParts.push('Unbreakable:1b');
        }

        if (customModelData) {
            nbtParts.push(`CustomModelData:${customModelData}`);
        }

        if (selectedEnchantments.length > 0) {
            const enchArray = selectedEnchantments
                .filter((e) => e.id)
                .map((e) => `{id:"${e.id}",lvl:${e.level}s}`)
                .join(',');
            if (enchArray) {
                nbtParts.push(`Enchantments:[${enchArray}]`);
            }
        }

        if (attributeModifiersList.length > 0) {
            const attrArray = attributeModifiersList
                .filter((mod) => mod.attribute)
                .map(
                    (mod) =>
                        `{AttributeName:"${mod.attribute}",Name:"${mod.attribute}",Amount:${mod.amount},Operation:${attributeOperations.findIndex((op) => op.id === mod.operation)},UUID:[I;${Math.floor(Math.random() * 1000000000)},${Math.floor(Math.random() * 1000000000)},${Math.floor(Math.random() * 1000000000)},${Math.floor(Math.random() * 1000000000)}],Slot:"${mod.slot}"}`,
                )
                .join(',');
            if (attrArray) {
                nbtParts.push(`AttributeModifiers:[${attrArray}]`);
            }
        }

        if (selectedHideFlags.length > 0) {
            const hideValue = selectedHideFlags.reduce((acc, flag) => {
                const flagValues: Record<HideFlag, number> = {
                    enchantments: 1,
                    modifiers: 2,
                    unbreakable: 4,
                    can_destroy: 8,
                    can_place: 16,
                    other: 32,
                    dyed: 64,
                    armor_trim: 128,
                };
                return acc + (flagValues[flag] || 0);
            }, 0);
            nbtParts.push(`HideFlags:${hideValue}`);
        }

        if (selectedRarity) {
            nbtParts.push(`Rarity:"${selectedRarity}"`);
        }

        if (durabilityValue !== '' && selectedItem.hasDurability) {
            nbtParts.push(`Damage:${durabilityValue}`);
        }

        if (nbtParts.length > 0) {
            nbtData = `{${nbtParts.join(',')}}`;
        }

        return `/give ${targetSelector} ${selectedItem.id}${nbtData ? `${nbtData}` : ''} ${itemCount}`;
    };

    const copyCommand = () => {
        const command = generateCommand();
        navigator.clipboard.writeText(command);
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2000);
    };

    const getApplicableEnchantments = () => {
        if (!selectedItem) {
            return enchantments;
        }

        return enchantments.filter((ench) => {
            if (ench.applicableItems.includes('all')) {
                return true;
            }

            const itemType = selectedItem.id.split('_').pop() || '';
            const itemMaterial = selectedItem.id.split('_')[0] || '';

            return (
                ench.applicableItems.includes(itemType) ||
                ench.applicableItems.some((applicable) =>
                    selectedItem.id.includes(applicable),
                )
            );
        });
    };

    const getEnchantmentWarnings = (enchId: string): string[] => {
        const warnings: string[] = [];
        const ench = enchantments.find((e) => e.id === enchId);

        if (!ench) {
            return warnings;
        }

        selectedEnchantments.forEach((selected) => {
            if (selected.id !== enchId && ench.incompatibleWith.includes(selected.id)) {
                const incompatibleEnch = enchantments.find(
                    (e) => e.id === selected.id,
                );
                if (incompatibleEnch) {
                    warnings.push(
                        `Incompatible with ${incompatibleEnch.name}`,
                    );
                }
            }
        });

        return warnings;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Minecraft Item Generator" />

            <div className="mx-auto max-w-screen-2xl p-4 sm:p-6">
                <div className="mb-6 space-y-2">
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                        <Sparkles className="size-8 text-accent" />
                        Minecraft Item Generator
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Create custom Minecraft items with enchantments,
                        attributes, and NBT data
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Item</CardTitle>
                                <CardDescription>
                                    Choose a Minecraft item to customize
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search items..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="pl-9"
                                        />
                                    </div>
                                    <Select
                                        value={selectedCategory}
                                        onValueChange={(value) =>
                                            setSelectedCategory(
                                                value as ItemCategory | 'all',
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Items
                                            </SelectItem>
                                            {Object.entries(categoryNames).map(
                                                ([key, name]) => (
                                                    <SelectItem
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {name}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="max-h-[300px] space-y-1 overflow-y-auto rounded-md border p-2">
                                    {filteredItems.map((item) => (
                                        <button
                                            type="button"
                                            key={item.id}
                                            onClick={() => setSelectedItem(item)}
                                            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                                                selectedItem?.id === item.id
                                                    ? 'bg-accent text-accent-foreground'
                                                    : ''
                                            }`}
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                    {filteredItems.length === 0 && (
                                        <p className="py-8 text-center text-sm text-muted-foreground">
                                            No items found
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {selectedItem && (
                            <>
                                <Tabs defaultValue="basic" className="w-full">
                                    <TabsList className="w-full">
                                        <TabsTrigger
                                            value="basic"
                                            className="flex-1"
                                        >
                                            Basic
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="enchantments"
                                            className="flex-1"
                                        >
                                            Enchantments
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="attributes"
                                            className="flex-1"
                                        >
                                            Attributes
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="display"
                                            className="flex-1"
                                        >
                                            Display
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="basic">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>
                                                    Basic Properties
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="count">
                                                        Count
                                                    </Label>
                                                    <Input
                                                        id="count"
                                                        type="number"
                                                        min="1"
                                                        max={selectedItem.maxStack}
                                                        value={itemCount}
                                                        onChange={(e) =>
                                                            setItemCount(
                                                                Math.min(
                                                                    Math.max(
                                                                        1,
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    ),
                                                                    selectedItem.maxStack,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Max stack:{' '}
                                                        {selectedItem.maxStack}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="customName">
                                                        Custom Name
                                                    </Label>
                                                    <Input
                                                        id="customName"
                                                        placeholder="§6Epic Item"
                                                        value={customName}
                                                        onChange={(e) =>
                                                            setCustomName(
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Use § for color codes
                                                        (e.g., §6 for gold)
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label>Lore</Label>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={addLoreLine}
                                                        >
                                                            <Plus className="size-4" />
                                                        </Button>
                                                    </div>
                                                    {loreLines.map(
                                                        (line, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex gap-2"
                                                            >
                                                                <Input
                                                                    placeholder="§7Lore line"
                                                                    value={line}
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateLoreLine(
                                                                            index,
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() =>
                                                                        removeLoreLine(
                                                                            index,
                                                                        )
                                                                    }
                                                                >
                                                                    <X className="size-4" />
                                                                </Button>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="unbreakable"
                                                        checked={isUnbreakable}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            setIsUnbreakable(
                                                                checked as boolean,
                                                            )
                                                        }
                                                    />
                                                    <Label htmlFor="unbreakable">
                                                        Unbreakable
                                                    </Label>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="customModelData">
                                                        Custom Model Data
                                                    </Label>
                                                    <Input
                                                        id="customModelData"
                                                        type="number"
                                                        placeholder="1"
                                                        value={customModelData}
                                                        onChange={(e) =>
                                                            setCustomModelData(
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {selectedItem.hasDurability && (
                                                    <div className="space-y-2">
                                                        <Label htmlFor="durability">
                                                            Durability Damage
                                                        </Label>
                                                        <Input
                                                            id="durability"
                                                            type="number"
                                                            min="0"
                                                            max={
                                                                selectedItem.maxDurability
                                                            }
                                                            placeholder="0"
                                                            value={
                                                                durabilityValue
                                                            }
                                                            onChange={(e) =>
                                                                setDurabilityValue(
                                                                    e.target
                                                                        .value
                                                                        ? Number(
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                          )
                                                                        : '',
                                                                )
                                                            }
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Max durability:{' '}
                                                            {
                                                                selectedItem.maxDurability
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="enchantments">
                                        <Card>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle>
                                                            Enchantments
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Add enchantments to
                                                            your item
                                                        </CardDescription>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={
                                                            addEnchantment
                                                        }
                                                    >
                                                        <Plus className="size-4" />
                                                        Add
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {selectedEnchantments.length ===
                                                    0 && (
                                                    <p className="py-8 text-center text-sm text-muted-foreground">
                                                        No enchantments added
                                                    </p>
                                                )}
                                                {selectedEnchantments.map(
                                                    (ench, index) => {
                                                        const warnings =
                                                            getEnchantmentWarnings(
                                                                ench.id,
                                                            );
                                                        const enchData =
                                                            enchantments.find(
                                                                (e) =>
                                                                    e.id ===
                                                                    ench.id,
                                                            );

                                                        return (
                                                            <div
                                                                key={index}
                                                                className="space-y-2 rounded-md border p-3"
                                                            >
                                                                <div className="flex gap-2">
                                                                    <Select
                                                                        value={
                                                                            ench.id
                                                                        }
                                                                        onValueChange={(
                                                                            value,
                                                                        ) =>
                                                                            updateEnchantment(
                                                                                index,
                                                                                'id',
                                                                                value,
                                                                            )
                                                                        }
                                                                    >
                                                                        <SelectTrigger className="flex-1">
                                                                            <SelectValue placeholder="Select enchantment" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {getApplicableEnchantments().map(
                                                                                (
                                                                                    e,
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            e.id
                                                                                        }
                                                                                        value={
                                                                                            e.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            e.name
                                                                                        }
                                                                                    </SelectItem>
                                                                                ),
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <Input
                                                                        type="number"
                                                                        min="1"
                                                                        max={
                                                                            enchData?.maxLevel ||
                                                                            10
                                                                        }
                                                                        value={
                                                                            ench.level
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateEnchantment(
                                                                                index,
                                                                                'level',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        className="w-20"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        onClick={() =>
                                                                            removeEnchantment(
                                                                                index,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </Button>
                                                                </div>
                                                                {warnings.length >
                                                                    0 && (
                                                                    <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                                                                        <AlertCircle className="size-4 shrink-0" />
                                                                        <span>
                                                                            {warnings.join(
                                                                                ', ',
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {enchData && (
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Max
                                                                        level:{' '}
                                                                        {
                                                                            enchData.maxLevel
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="attributes">
                                        <Card>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle>
                                                            Attribute Modifiers
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Modify item
                                                            attributes
                                                        </CardDescription>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={
                                                            addAttributeModifier
                                                        }
                                                    >
                                                        <Plus className="size-4" />
                                                        Add
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {attributeModifiersList.length ===
                                                    0 && (
                                                    <p className="py-8 text-center text-sm text-muted-foreground">
                                                        No attribute modifiers
                                                        added
                                                    </p>
                                                )}
                                                {attributeModifiersList.map(
                                                    (mod) => (
                                                        <div
                                                            key={mod.id}
                                                            className="space-y-3 rounded-md border p-3"
                                                        >
                                                            <div className="flex items-end gap-2">
                                                                <div className="flex-1 space-y-1">
                                                                    <Label>
                                                                        Attribute
                                                                    </Label>
                                                                    <Select
                                                                        value={
                                                                            mod.attribute
                                                                        }
                                                                        onValueChange={(
                                                                            value,
                                                                        ) =>
                                                                            updateAttributeModifier(
                                                                                mod.id,
                                                                                'attribute',
                                                                                value,
                                                                            )
                                                                        }
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select attribute" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {attributeModifiers.map(
                                                                                (
                                                                                    attr,
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            attr.id
                                                                                        }
                                                                                        value={
                                                                                            attr.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            attr.name
                                                                                        }
                                                                                    </SelectItem>
                                                                                ),
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() =>
                                                                        removeAttributeModifier(
                                                                            mod.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </Button>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div className="space-y-1">
                                                                    <Label>
                                                                        Amount
                                                                    </Label>
                                                                    <Input
                                                                        type="number"
                                                                        step="0.1"
                                                                        value={
                                                                            mod.amount
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateAttributeModifier(
                                                                                mod.id,
                                                                                'amount',
                                                                                Number(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ),
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label>
                                                                        Operation
                                                                    </Label>
                                                                    <Select
                                                                        value={
                                                                            mod.operation
                                                                        }
                                                                        onValueChange={(
                                                                            value,
                                                                        ) =>
                                                                            updateAttributeModifier(
                                                                                mod.id,
                                                                                'operation',
                                                                                value,
                                                                            )
                                                                        }
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {attributeOperations.map(
                                                                                (
                                                                                    op,
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            op.id
                                                                                        }
                                                                                        value={
                                                                                            op.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            op.name
                                                                                        }
                                                                                    </SelectItem>
                                                                                ),
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label>
                                                                    Equipment
                                                                    Slot
                                                                </Label>
                                                                <Select
                                                                    value={
                                                                        mod.slot
                                                                    }
                                                                    onValueChange={(
                                                                        value,
                                                                    ) =>
                                                                        updateAttributeModifier(
                                                                            mod.id,
                                                                            'slot',
                                                                            value,
                                                                        )
                                                                    }
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {equipmentSlots.map(
                                                                            (
                                                                                slot,
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        slot.id
                                                                                    }
                                                                                    value={
                                                                                        slot.id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        slot.name
                                                                                    }
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="display">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>
                                                    Display Settings
                                                </CardTitle>
                                                <CardDescription>
                                                    Control what information is
                                                    visible
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    <Label>Hide Flags</Label>
                                                    <div className="space-y-2">
                                                        {hideFlags.map((flag) => (
                                                            <div
                                                                key={flag.id}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Checkbox
                                                                    id={flag.id}
                                                                    checked={selectedHideFlags.includes(
                                                                        flag.id,
                                                                    )}
                                                                    onCheckedChange={() =>
                                                                        toggleHideFlag(
                                                                            flag.id,
                                                                        )
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor={
                                                                        flag.id
                                                                    }
                                                                >
                                                                    {flag.name}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="rarity">
                                                        Rarity Override
                                                    </Label>
                                                    <Select
                                                        value={selectedRarity}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setSelectedRarity(
                                                                value as Rarity,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Default" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="">
                                                                Default
                                                            </SelectItem>
                                                            {rarityLevels.map(
                                                                (rarity) => (
                                                                    <SelectItem
                                                                        key={
                                                                            rarity.id
                                                                        }
                                                                        value={
                                                                            rarity.id
                                                                        }
                                                                    >
                                                                        {
                                                                            rarity.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Presets</CardTitle>
                                        <CardDescription>
                                            Quick apply common item
                                            configurations
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                applyPreset('super_sword')
                                            }
                                            disabled={
                                                !selectedItem?.id.includes(
                                                    'sword',
                                                )
                                            }
                                        >
                                            Super Sword
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                applyPreset('speed_boots')
                                            }
                                            disabled={
                                                !selectedItem?.id.includes(
                                                    'boots',
                                                )
                                            }
                                        >
                                            Speed Boots
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                applyPreset(
                                                    'unbreakable_pickaxe',
                                                )
                                            }
                                            disabled={
                                                !selectedItem?.id.includes(
                                                    'pickaxe',
                                                )
                                            }
                                        >
                                            Unbreakable Pickaxe
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                applyPreset('custom_named')
                                            }
                                        >
                                            Custom Named Item
                                        </Button>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>

                    {selectedItem && (
                        <div className="lg:sticky lg:top-6 lg:h-fit">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Command Output</CardTitle>
                                    <CardDescription>
                                        Copy this command to use in Minecraft
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="target">
                                            Target Selector
                                        </Label>
                                        <Select
                                            value={targetSelector}
                                            onValueChange={setTargetSelector}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="@p">
                                                    @p (Nearest Player)
                                                </SelectItem>
                                                <SelectItem value="@s">
                                                    @s (Self)
                                                </SelectItem>
                                                <SelectItem value="@a">
                                                    @a (All Players)
                                                </SelectItem>
                                                <SelectItem value="@r">
                                                    @r (Random Player)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Command</Label>
                                        <Textarea
                                            value={generateCommand()}
                                            readOnly
                                            className="font-mono text-sm"
                                            rows={8}
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        className="w-full"
                                        onClick={copyCommand}
                                    >
                                        {copiedMessage ? (
                                            <>
                                                <Check className="size-4" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="size-4" />
                                                Copy Command
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
