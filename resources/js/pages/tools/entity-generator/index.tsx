import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    OutputPanel,
    ToolLayout,
    ToolSection,
} from '@/components/tool-layout';
import {
    attributes,
    entityCategories,
    entityPresets,
    equipmentSlots,
    generateSummonCommand,
    getEntitiesByCategory,
    getEntityById,
    getNBTTagsForEntity,
    potionEffects,
    type Entity,
} from '@/data/entity-data';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Check,
    ChevronDown,
    Copy,
    Plus,
    RotateCcw,
    Search,
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
        title: 'Entity Generator',
        href: '/tools/entity-generator',
    },
];

interface PotionEffectData {
    id: string;
    amplifier: number;
    duration: number;
    showParticles: boolean;
    ambient: boolean;
}

interface AttributeData {
    id: string;
    value: number;
}

interface EquipmentData {
    slot: string;
    item: string;
    dropChance: number;
}

export default function EntityGenerator() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
    const [nbtData, setNbtData] = useState<Record<string, any>>({});
    const [customName, setCustomName] = useState('');
    const [nameColor, setNameColor] = useState('white');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [potionEffectsList, setPotionEffectsList] = useState<
        PotionEffectData[]
    >([]);
    const [attributesList, setAttributesList] = useState<AttributeData[]>([]);
    const [equipmentList, setEquipmentList] = useState<EquipmentData[]>([]);
    const [copied, setCopied] = useState(false);
    const [expandedSections, setExpandedSections] = useState<
        Record<string, boolean>
    >({
        basic: true,
        position: true,
        universal: false,
        specific: false,
        equipment: false,
        effects: false,
        attributes: false,
        advanced: false,
    });

    const filteredEntities = () => {
        let entities =
            selectedCategory === 'all'
                ? Object.values(
                      entityCategories.flatMap((cat) =>
                          getEntitiesByCategory(cat.id),
                      ),
                  )
                : getEntitiesByCategory(
                      selectedCategory as any,
                  );

        if (searchQuery) {
            entities = entities.filter((entity) =>
                entity.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
            );
        }

        return entities;
    };

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const updateNBT = (key: string, value: any) => {
        setNbtData((prev) => {
            const newData = { ...prev };
            if (value === null || value === undefined || value === '') {
                delete newData[key];
            } else {
                newData[key] = value;
            }
            return newData;
        });
    };

    const addTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            updateNBT('Tags', [...tags, currentTag]);
            setCurrentTag('');
        }
    };

    const removeTag = (tag: string) => {
        const newTags = tags.filter((t) => t !== tag);
        setTags(newTags);
        updateNBT('Tags', newTags.length > 0 ? newTags : null);
    };

    const addPotionEffect = () => {
        setPotionEffectsList([
            ...potionEffectsList,
            {
                id: 'speed',
                amplifier: 0,
                duration: 600,
                showParticles: true,
                ambient: false,
            },
        ]);
    };

    const removePotionEffect = (index: number) => {
        const newEffects = potionEffectsList.filter((_, i) => i !== index);
        setPotionEffectsList(newEffects);
        updateNBT(
            'ActiveEffects',
            newEffects.length > 0
                ? newEffects.map((e) => ({
                      Id: e.id,
                      Amplifier: e.amplifier,
                      Duration: e.duration,
                      ShowParticles: e.showParticles,
                      Ambient: e.ambient,
                  }))
                : null,
        );
    };

    const updatePotionEffect = (
        index: number,
        field: keyof PotionEffectData,
        value: any,
    ) => {
        const newEffects = [...potionEffectsList];
        newEffects[index] = { ...newEffects[index], [field]: value };
        setPotionEffectsList(newEffects);
        updateNBT(
            'ActiveEffects',
            newEffects.map((e) => ({
                Id: e.id,
                Amplifier: e.amplifier,
                Duration: e.duration,
                ShowParticles: e.showParticles,
                Ambient: e.ambient,
            })),
        );
    };

    const addAttribute = () => {
        setAttributesList([
            ...attributesList,
            { id: 'generic.max_health', value: 20 },
        ]);
    };

    const removeAttribute = (index: number) => {
        const newAttrs = attributesList.filter((_, i) => i !== index);
        setAttributesList(newAttrs);
        updateNBT(
            'Attributes',
            newAttrs.length > 0
                ? newAttrs.map((a) => ({ Name: a.id, Base: a.value }))
                : null,
        );
    };

    const updateAttribute = (
        index: number,
        field: keyof AttributeData,
        value: any,
    ) => {
        const newAttrs = [...attributesList];
        newAttrs[index] = { ...newAttrs[index], [field]: value };
        setAttributesList(newAttrs);
        updateNBT(
            'Attributes',
            newAttrs.map((a) => ({ Name: a.id, Base: a.value })),
        );
    };

    const addEquipment = () => {
        setEquipmentList([
            ...equipmentList,
            { slot: 'mainhand', item: 'diamond_sword', dropChance: 0 },
        ]);
    };

    const removeEquipment = (index: number) => {
        setEquipmentList(equipmentList.filter((_, i) => i !== index));
    };

    const updateEquipment = (
        index: number,
        field: keyof EquipmentData,
        value: any,
    ) => {
        const newEquip = [...equipmentList];
        newEquip[index] = { ...newEquip[index], [field]: value };
        setEquipmentList(newEquip);
    };

    const applyPreset = (presetId: string) => {
        const preset = entityPresets.find((p) => p.id === presetId);
        if (!preset) {
            return;
        }

        const entity = getEntityById(preset.entityId);
        if (entity) {
            setSelectedEntity(entity);
            setNbtData(preset.nbt);
            setExpandedSections({
                basic: true,
                position: true,
                universal: true,
                specific: true,
                equipment: true,
                effects: false,
                attributes: false,
                advanced: false,
            });
        }
    };

    const reset = () => {
        setSelectedEntity(null);
        setPosition({ x: 0, y: 0, z: 0 });
        setNbtData({});
        setCustomName('');
        setNameColor('white');
        setTags([]);
        setCurrentTag('');
        setPotionEffectsList([]);
        setAttributesList([]);
        setEquipmentList([]);
    };

    const generateCommand = () => {
        if (!selectedEntity) {
            return '';
        }

        let finalNBT = { ...nbtData };

        if (customName) {
            finalNBT.CustomName = JSON.stringify({
                text: customName,
                color: nameColor,
            });
        }

        if (equipmentList.length > 0) {
            const handItems: any[] = [{}, {}];
            const armorItems: any[] = [{}, {}, {}, {}];
            const handDropChances: number[] = [0, 0];
            const armorDropChances: number[] = [0, 0, 0, 0];

            equipmentList.forEach((equip) => {
                const itemData = { id: `minecraft:${equip.item}`, Count: 1 };

                if (equip.slot === 'mainhand') {
                    handItems[0] = itemData;
                    handDropChances[0] = equip.dropChance;
                } else if (equip.slot === 'offhand') {
                    handItems[1] = itemData;
                    handDropChances[1] = equip.dropChance;
                } else if (equip.slot === 'head') {
                    armorItems[3] = itemData;
                    armorDropChances[3] = equip.dropChance;
                } else if (equip.slot === 'chest') {
                    armorItems[2] = itemData;
                    armorDropChances[2] = equip.dropChance;
                } else if (equip.slot === 'legs') {
                    armorItems[1] = itemData;
                    armorDropChances[1] = equip.dropChance;
                } else if (equip.slot === 'feet') {
                    armorItems[0] = itemData;
                    armorDropChances[0] = equip.dropChance;
                }
            });

            finalNBT.HandItems = handItems;
            finalNBT.ArmorItems = armorItems;
            finalNBT.HandDropChances = handDropChances;
            finalNBT.ArmorDropChances = armorDropChances;
        }

        return generateSummonCommand(selectedEntity.id, position, finalNBT);
    };

    const copyCommand = async () => {
        const command = generateCommand();
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const minecraftColors = [
        'black',
        'dark_blue',
        'dark_green',
        'dark_aqua',
        'dark_red',
        'dark_purple',
        'gold',
        'gray',
        'dark_gray',
        'blue',
        'green',
        'aqua',
        'red',
        'light_purple',
        'yellow',
        'white',
    ];

    const nbtTags = selectedEntity
        ? getNBTTagsForEntity(selectedEntity.id)
        : [];
    const universalTags = nbtTags.filter((tag) => tag.category === 'universal');
    const mobTags = nbtTags.filter((tag) => tag.category === 'mob');
    const specificTags = nbtTags.filter((tag) => tag.category === 'specific');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entity Generator" />

            <ToolLayout
                title="Minecraft Entity Summon Generator"
                description="Generate custom entity summon commands with NBT data"
                output={
                    selectedEntity && (
                        <OutputPanel
                            title="Generated Command"
                            command={generateCommand()}
                            onCopy={copyCommand}
                            copied={copied}
                            additionalActions={
                                <Button
                                    onClick={reset}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <RotateCcw className="size-4" />
                                    Reset
                                </Button>
                            }
                        >
                            <div className="space-y-4">
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">
                                        NBT Preview
                                    </h4>
                                    <div className="max-h-64 overflow-auto rounded-lg border bg-muted/50 p-3">
                                        <pre className="font-mono text-xs">
                                            {JSON.stringify(nbtData, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </OutputPanel>
                    )
                }
                sidebar={
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Presets</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {entityPresets.map((preset) => (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        onClick={() => applyPreset(preset.id)}
                                        className="w-full rounded-lg border p-3 text-left transition-all hover:bg-muted"
                                    >
                                        <div className="font-medium">
                                            {preset.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {preset.description}
                                        </div>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>How to Use</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div>
                                    <strong className="text-foreground">
                                        1. Select an entity
                                    </strong>
                                    <p>
                                        Choose from 100+ summonable entities
                                        organized by category.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <strong className="text-foreground">
                                        2. Configure position
                                    </strong>
                                    <p>
                                        Set the X, Y, Z coordinates where the
                                        entity will spawn.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <strong className="text-foreground">
                                        3. Customize with NBT
                                    </strong>
                                    <p>
                                        Add custom name, equipment, potion
                                        effects, attributes, and more.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <strong className="text-foreground">
                                        4. Copy and use
                                    </strong>
                                    <p>
                                        Copy the command and paste it in
                                        Minecraft to summon your custom entity.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                }
            >
                <ToolSection>
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Entity</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search entities..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="pl-9"
                                        />
                                    </div>
                                    <Select
                                        value={selectedCategory}
                                        onValueChange={setSelectedCategory}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Categories
                                            </SelectItem>
                                            {entityCategories.map((cat) => (
                                                <SelectItem
                                                    key={cat.id}
                                                    value={cat.id}
                                                >
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto rounded-lg border p-2 md:grid-cols-3">
                                    {filteredEntities().map((entity) => (
                                        <button
                                            key={entity.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedEntity(entity)
                                            }
                                            className="rounded-lg border-2 p-3 text-left transition-all hover:bg-muted"
                                            style={{
                                                borderColor:
                                                    selectedEntity?.id ===
                                                    entity.id
                                                        ? 'hsl(var(--primary))'
                                                        : 'transparent',
                                            }}
                                        >
                                            <div className="font-medium">
                                                {entity.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {entity.category}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {selectedEntity && (
                            <>
                                <Card>
                                    <Collapsible
                                        open={expandedSections.position}
                                        onOpenChange={() =>
                                            toggleSection('position')
                                        }
                                    >
                                        <CardHeader className="cursor-pointer">
                                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                                                <CardTitle>
                                                    Position & Coordinates
                                                </CardTitle>
                                                <ChevronDown
                                                    className={`size-5 transition-transform ${expandedSections.position ? 'rotate-180' : ''}`}
                                                />
                                            </CollapsibleTrigger>
                                        </CardHeader>
                                        <CollapsibleContent>
                                            <CardContent>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="pos-x">
                                                            X
                                                        </Label>
                                                        <Input
                                                            id="pos-x"
                                                            type="number"
                                                            value={position.x}
                                                            onChange={(e) =>
                                                                setPosition({
                                                                    ...position,
                                                                    x: parseFloat(
                                                                        e.target
                                                                            .value,
                                                                    ) || 0,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="pos-y">
                                                            Y
                                                        </Label>
                                                        <Input
                                                            id="pos-y"
                                                            type="number"
                                                            value={position.y}
                                                            onChange={(e) =>
                                                                setPosition({
                                                                    ...position,
                                                                    y: parseFloat(
                                                                        e.target
                                                                            .value,
                                                                    ) || 0,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="pos-z">
                                                            Z
                                                        </Label>
                                                        <Input
                                                            id="pos-z"
                                                            type="number"
                                                            value={position.z}
                                                            onChange={(e) =>
                                                                setPosition({
                                                                    ...position,
                                                                    z: parseFloat(
                                                                        e.target
                                                                            .value,
                                                                    ) || 0,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </Card>

                                <Card>
                                    <Collapsible
                                        open={expandedSections.universal}
                                        onOpenChange={() =>
                                            toggleSection('universal')
                                        }
                                    >
                                        <CardHeader className="cursor-pointer">
                                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                                                <CardTitle>
                                                    Universal Options
                                                </CardTitle>
                                                <ChevronDown
                                                    className={`size-5 transition-transform ${expandedSections.universal ? 'rotate-180' : ''}`}
                                                />
                                            </CollapsibleTrigger>
                                        </CardHeader>
                                        <CollapsibleContent>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="custom-name">
                                                        Custom Name
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id="custom-name"
                                                            value={customName}
                                                            onChange={(e) =>
                                                                setCustomName(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Entity name..."
                                                            className="flex-1"
                                                        />
                                                        <Select
                                                            value={nameColor}
                                                            onValueChange={
                                                                setNameColor
                                                            }
                                                        >
                                                            <SelectTrigger className="w-[140px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {minecraftColors.map(
                                                                    (color) => (
                                                                        <SelectItem
                                                                            key={
                                                                                color
                                                                            }
                                                                            value={
                                                                                color
                                                                            }
                                                                        >
                                                                            {color
                                                                                .replace(
                                                                                    '_',
                                                                                    ' ',
                                                                                )
                                                                                .replace(
                                                                                    /\b\w/g,
                                                                                    (
                                                                                        l,
                                                                                    ) =>
                                                                                        l.toUpperCase(),
                                                                                )}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {universalTags
                                                    .filter(
                                                        (tag) =>
                                                            tag.type ===
                                                            'boolean',
                                                    )
                                                    .map((tag) => (
                                                        <div
                                                            key={tag.id}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Checkbox
                                                                id={tag.id}
                                                                checked={
                                                                    nbtData[
                                                                        tag.id
                                                                    ] || false
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    updateNBT(
                                                                        tag.id,
                                                                        checked,
                                                                    )
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor={tag.id}
                                                                className="cursor-pointer"
                                                            >
                                                                {tag.name}
                                                            </Label>
                                                        </div>
                                                    ))}

                                                <div className="space-y-2">
                                                    <Label>Tags</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={currentTag}
                                                            onChange={(e) =>
                                                                setCurrentTag(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                    'Enter'
                                                                ) {
                                                                    addTag();
                                                                }
                                                            }}
                                                            placeholder="Add tag..."
                                                            className="flex-1"
                                                        />
                                                        <Button
                                                            onClick={addTag}
                                                            size="sm"
                                                        >
                                                            <Plus className="size-4" />
                                                        </Button>
                                                    </div>
                                                    {tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {tags.map((tag) => (
                                                                <div
                                                                    key={tag}
                                                                    className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm"
                                                                >
                                                                    {tag}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeTag(
                                                                                tag,
                                                                            )
                                                                        }
                                                                        className="ml-1"
                                                                    >
                                                                        <X className="size-3" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </Card>

                                {(selectedEntity.canBeBaby ||
                                    specificTags.length > 0) && (
                                    <Card>
                                        <Collapsible
                                            open={expandedSections.specific}
                                            onOpenChange={() =>
                                                toggleSection('specific')
                                            }
                                        >
                                            <CardHeader className="cursor-pointer">
                                                <CollapsibleTrigger className="flex w-full items-center justify-between">
                                                    <CardTitle>
                                                        {selectedEntity.name}{' '}
                                                        Specific Options
                                                    </CardTitle>
                                                    <ChevronDown
                                                        className={`size-5 transition-transform ${expandedSections.specific ? 'rotate-180' : ''}`}
                                                    />
                                                </CollapsibleTrigger>
                                            </CardHeader>
                                            <CollapsibleContent>
                                                <CardContent className="space-y-4">
                                                    {selectedEntity.canBeBaby && (
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                id="is-baby"
                                                                checked={
                                                                    nbtData.IsBaby ||
                                                                    false
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    updateNBT(
                                                                        'IsBaby',
                                                                        checked,
                                                                    )
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor="is-baby"
                                                                className="cursor-pointer"
                                                            >
                                                                Is Baby
                                                            </Label>
                                                        </div>
                                                    )}

                                                    {specificTags.map((tag) => {
                                                        if (
                                                            tag.type ===
                                                            'boolean'
                                                        ) {
                                                            return (
                                                                <div
                                                                    key={tag.id}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <Checkbox
                                                                        id={
                                                                            tag.id
                                                                        }
                                                                        checked={
                                                                            nbtData[
                                                                                tag
                                                                                    .id
                                                                            ] ||
                                                                            false
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked,
                                                                        ) =>
                                                                            updateNBT(
                                                                                tag.id,
                                                                                checked,
                                                                            )
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={
                                                                            tag.id
                                                                        }
                                                                        className="cursor-pointer"
                                                                    >
                                                                        {
                                                                            tag.name
                                                                        }
                                                                    </Label>
                                                                </div>
                                                            );
                                                        }

                                                        if (
                                                            tag.type ===
                                                            'slider'
                                                        ) {
                                                            return (
                                                                <div
                                                                    key={tag.id}
                                                                    className="space-y-2"
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <Label>
                                                                            {
                                                                                tag.name
                                                                            }
                                                                        </Label>
                                                                        <span className="text-sm text-muted-foreground">
                                                                            {nbtData[
                                                                                tag
                                                                                    .id
                                                                            ] ??
                                                                                tag.defaultValue}
                                                                        </span>
                                                                    </div>
                                                                    <Slider
                                                                        value={[
                                                                            nbtData[
                                                                                tag
                                                                                    .id
                                                                            ] ??
                                                                                tag.defaultValue,
                                                                        ]}
                                                                        onValueChange={(
                                                                            value,
                                                                        ) =>
                                                                            updateNBT(
                                                                                tag.id,
                                                                                value[0],
                                                                            )
                                                                        }
                                                                        min={
                                                                            tag.min
                                                                        }
                                                                        max={
                                                                            tag.max
                                                                        }
                                                                        step={1}
                                                                    />
                                                                </div>
                                                            );
                                                        }

                                                        if (
                                                            tag.type ===
                                                            'number'
                                                        ) {
                                                            return (
                                                                <div
                                                                    key={tag.id}
                                                                    className="space-y-2"
                                                                >
                                                                    <Label
                                                                        htmlFor={
                                                                            tag.id
                                                                        }
                                                                    >
                                                                        {
                                                                            tag.name
                                                                        }
                                                                    </Label>
                                                                    <Input
                                                                        id={
                                                                            tag.id
                                                                        }
                                                                        type="number"
                                                                        value={
                                                                            nbtData[
                                                                                tag
                                                                                    .id
                                                                            ] ??
                                                                            tag.defaultValue
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateNBT(
                                                                                tag.id,
                                                                                parseInt(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ),
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            );
                                                        }

                                                        return null;
                                                    })}
                                                </CardContent>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </Card>
                                )}

                                {selectedEntity.canHaveEquipment && (
                                    <Card>
                                        <Collapsible
                                            open={expandedSections.equipment}
                                            onOpenChange={() =>
                                                toggleSection('equipment')
                                            }
                                        >
                                            <CardHeader className="cursor-pointer">
                                                <CollapsibleTrigger className="flex w-full items-center justify-between">
                                                    <CardTitle>
                                                        Equipment
                                                    </CardTitle>
                                                    <ChevronDown
                                                        className={`size-5 transition-transform ${expandedSections.equipment ? 'rotate-180' : ''}`}
                                                    />
                                                </CollapsibleTrigger>
                                            </CardHeader>
                                            <CollapsibleContent>
                                                <CardContent className="space-y-4">
                                                    {equipmentList.map(
                                                        (equip, index) => (
                                                            <div
                                                                key={index}
                                                                className="space-y-2 rounded-lg border p-3"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium">
                                                                        Equipment{' '}
                                                                        {index +
                                                                            1}
                                                                    </span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            removeEquipment(
                                                                                index,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="size-4 text-destructive" />
                                                                    </Button>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div className="space-y-2">
                                                                        <Label>
                                                                            Slot
                                                                        </Label>
                                                                        <Select
                                                                            value={
                                                                                equip.slot
                                                                            }
                                                                            onValueChange={(
                                                                                value,
                                                                            ) =>
                                                                                updateEquipment(
                                                                                    index,
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
                                                                    <div className="space-y-2">
                                                                        <Label>
                                                                            Item
                                                                        </Label>
                                                                        <Input
                                                                            value={
                                                                                equip.item
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                updateEquipment(
                                                                                    index,
                                                                                    'item',
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            placeholder="diamond_sword"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <Label>
                                                                            Drop
                                                                            Chance
                                                                        </Label>
                                                                        <span className="text-sm text-muted-foreground">
                                                                            {
                                                                                equip.dropChance
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <Slider
                                                                        value={[
                                                                            equip.dropChance,
                                                                        ]}
                                                                        onValueChange={(
                                                                            value,
                                                                        ) =>
                                                                            updateEquipment(
                                                                                index,
                                                                                'dropChance',
                                                                                value[0],
                                                                            )
                                                                        }
                                                                        min={0}
                                                                        max={1}
                                                                        step={
                                                                            0.05
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                    <Button
                                                        onClick={addEquipment}
                                                        variant="outline"
                                                        className="w-full"
                                                    >
                                                        <Plus className="mr-2 size-4" />
                                                        Add Equipment
                                                    </Button>
                                                </CardContent>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </Card>
                                )}

                                <Card>
                                    <Collapsible
                                        open={expandedSections.effects}
                                        onOpenChange={() =>
                                            toggleSection('effects')
                                        }
                                    >
                                        <CardHeader className="cursor-pointer">
                                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                                                <CardTitle>
                                                    Potion Effects
                                                </CardTitle>
                                                <ChevronDown
                                                    className={`size-5 transition-transform ${expandedSections.effects ? 'rotate-180' : ''}`}
                                                />
                                            </CollapsibleTrigger>
                                        </CardHeader>
                                        <CollapsibleContent>
                                            <CardContent className="space-y-4">
                                                {potionEffectsList.map(
                                                    (effect, index) => (
                                                        <div
                                                            key={index}
                                                            className="space-y-2 rounded-lg border p-3"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-medium">
                                                                    Effect{' '}
                                                                    {index + 1}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        removePotionEffect(
                                                                            index,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="size-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>
                                                                    Effect Type
                                                                </Label>
                                                                <Select
                                                                    value={
                                                                        effect.id
                                                                    }
                                                                    onValueChange={(
                                                                        value,
                                                                    ) =>
                                                                        updatePotionEffect(
                                                                            index,
                                                                            'id',
                                                                            value,
                                                                        )
                                                                    }
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {potionEffects.map(
                                                                            (
                                                                                pe,
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        pe.id
                                                                                    }
                                                                                    value={
                                                                                        pe.id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        pe.name
                                                                                    }
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div className="space-y-2">
                                                                    <Label>
                                                                        Amplifier
                                                                    </Label>
                                                                    <Input
                                                                        type="number"
                                                                        value={
                                                                            effect.amplifier
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updatePotionEffect(
                                                                                index,
                                                                                'amplifier',
                                                                                parseInt(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ),
                                                                            )
                                                                        }
                                                                        min={0}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>
                                                                        Duration
                                                                        (ticks)
                                                                    </Label>
                                                                    <Input
                                                                        type="number"
                                                                        value={
                                                                            effect.duration
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updatePotionEffect(
                                                                                index,
                                                                                'duration',
                                                                                parseInt(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ),
                                                                            )
                                                                        }
                                                                        min={0}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <div className="flex items-center gap-2">
                                                                    <Checkbox
                                                                        id={`particles-${index}`}
                                                                        checked={
                                                                            effect.showParticles
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked,
                                                                        ) =>
                                                                            updatePotionEffect(
                                                                                index,
                                                                                'showParticles',
                                                                                checked,
                                                                            )
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`particles-${index}`}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        Show
                                                                        Particles
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Checkbox
                                                                        id={`ambient-${index}`}
                                                                        checked={
                                                                            effect.ambient
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked,
                                                                        ) =>
                                                                            updatePotionEffect(
                                                                                index,
                                                                                'ambient',
                                                                                checked,
                                                                            )
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`ambient-${index}`}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        Ambient
                                                                    </Label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                                <Button
                                                    onClick={addPotionEffect}
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <Plus className="mr-2 size-4" />
                                                    Add Effect
                                                </Button>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </Card>

                                <Card>
                                    <Collapsible
                                        open={expandedSections.attributes}
                                        onOpenChange={() =>
                                            toggleSection('attributes')
                                        }
                                    >
                                        <CardHeader className="cursor-pointer">
                                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                                                <CardTitle>Attributes</CardTitle>
                                                <ChevronDown
                                                    className={`size-5 transition-transform ${expandedSections.attributes ? 'rotate-180' : ''}`}
                                                />
                                            </CollapsibleTrigger>
                                        </CardHeader>
                                        <CollapsibleContent>
                                            <CardContent className="space-y-4">
                                                {attributesList.map(
                                                    (attr, index) => (
                                                        <div
                                                            key={index}
                                                            className="space-y-2 rounded-lg border p-3"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-medium">
                                                                    Attribute{' '}
                                                                    {index + 1}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        removeAttribute(
                                                                            index,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="size-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div className="space-y-2">
                                                                    <Label>
                                                                        Type
                                                                    </Label>
                                                                    <Select
                                                                        value={
                                                                            attr.id
                                                                        }
                                                                        onValueChange={(
                                                                            value,
                                                                        ) =>
                                                                            updateAttribute(
                                                                                index,
                                                                                'id',
                                                                                value,
                                                                            )
                                                                        }
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {attributes.map(
                                                                                (
                                                                                    a,
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            a.id
                                                                                        }
                                                                                        value={
                                                                                            a.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            a.name
                                                                                        }
                                                                                    </SelectItem>
                                                                                ),
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>
                                                                        Value
                                                                    </Label>
                                                                    <Input
                                                                        type="number"
                                                                        value={
                                                                            attr.value
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateAttribute(
                                                                                index,
                                                                                'value',
                                                                                parseFloat(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ),
                                                                            )
                                                                        }
                                                                        step={
                                                                            0.1
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                                <Button
                                                    onClick={addAttribute}
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <Plus className="mr-2 size-4" />
                                                    Add Attribute
                                                </Button>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </Card>
                            </>
                        )}
                </ToolSection>
            </ToolLayout>
        </AppLayout>
    );
}
