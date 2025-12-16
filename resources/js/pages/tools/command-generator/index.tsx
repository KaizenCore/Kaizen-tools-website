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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
    commandEnchantments,
    effects,
    entityTypes,
    gamemodes,
    items,
} from '@/data/command-data';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Check,
    Clock,
    Copy,
    Database,
    Gift,
    Navigation,
    RotateCcw,
    Sparkles,
    Swords,
    Trash2,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { OutputPanel, ToolLayout } from '@/components/tool-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Command Generator',
        href: '/tools/command-generator',
    },
];

interface CommandHistory {
    id: string;
    command: string;
    type: string;
    timestamp: number;
}

interface SelectedEnchantment {
    id: string;
    level: number;
}

export default function CommandGenerator() {
    const [activeTab, setActiveTab] = useState('give');
    const [copied, setCopied] = useState(false);
    const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
    const [syntaxMode, setSyntaxMode] = useState<'java' | 'bedrock'>('java');

    // Give command state
    const [selectedItem, setSelectedItem] = useState('diamond_sword');
    const [itemCount, setItemCount] = useState('1');
    const [customItemName, setCustomItemName] = useState('');
    const [selectedEnchantments, setSelectedEnchantments] = useState<SelectedEnchantment[]>([]);

    // Summon command state
    const [selectedEntity, setSelectedEntity] = useState('zombie');
    const [posX, setPosX] = useState('~');
    const [posY, setPosY] = useState('~');
    const [posZ, setPosZ] = useState('~');
    const [customEntityName, setCustomEntityName] = useState('');
    const [entityHealth, setEntityHealth] = useState('');
    const [noAI, setNoAI] = useState(false);
    const [invulnerable, setInvulnerable] = useState(false);

    // Effect command state
    const [effectAction, setEffectAction] = useState<'give' | 'clear'>('give');
    const [selectedEffect, setSelectedEffect] = useState('speed');
    const [effectDuration, setEffectDuration] = useState('30');
    const [effectAmplifier, setEffectAmplifier] = useState('0');
    const [hideParticles, setHideParticles] = useState(false);

    // Teleport command state
    const [tpX, setTpX] = useState('0');
    const [tpY, setTpY] = useState('64');
    const [tpZ, setTpZ] = useState('0');
    const [tpRelative, setTpRelative] = useState(false);

    // Gamemode command state
    const [selectedGamemode, setSelectedGamemode] = useState('survival');

    // Load history from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('minecraft-command-history');
        if (stored) {
            try {
                setCommandHistory(JSON.parse(stored));
            } catch {
                // Invalid JSON, ignore
            }
        }
    }, []);

    const saveToHistory = (command: string, type: string) => {
        const newHistory: CommandHistory = {
            id: Date.now().toString(),
            command,
            type,
            timestamp: Date.now(),
        };
        const updated = [newHistory, ...commandHistory].slice(0, 10);
        setCommandHistory(updated);
        localStorage.setItem('minecraft-command-history', JSON.stringify(updated));
    };

    const clearHistory = () => {
        setCommandHistory([]);
        localStorage.removeItem('minecraft-command-history');
    };

    const generateGiveCommand = (): string => {
        if (syntaxMode === 'bedrock') {
            return `/give @p ${selectedItem} ${itemCount}`;
        }

        const item = items.find((i) => i.id === selectedItem);
        let command = `/give @p minecraft:${selectedItem} ${itemCount}`;

        const nbtParts: string[] = [];

        if (customItemName) {
            nbtParts.push(`display:{Name:'{"text":"${customItemName}"}'}`);
        }

        if (selectedEnchantments.length > 0) {
            const enchantmentsList = selectedEnchantments
                .map((e) => `{id:"minecraft:${e.id}",lvl:${e.level}}`)
                .join(',');
            nbtParts.push(`Enchantments:[${enchantmentsList}]`);
        }

        if (nbtParts.length > 0) {
            command += `{${nbtParts.join(',')}}`;
        }

        return command;
    };

    const generateSummonCommand = (): string => {
        if (syntaxMode === 'bedrock') {
            return `/summon ${selectedEntity} ${posX} ${posY} ${posZ}`;
        }

        let command = `/summon minecraft:${selectedEntity} ${posX} ${posY} ${posZ}`;

        const nbtParts: string[] = [];

        if (customEntityName) {
            nbtParts.push(`CustomName:'{"text":"${customEntityName}"}'`);
        }

        if (entityHealth) {
            nbtParts.push(`Health:${entityHealth}f`);
            nbtParts.push(
                `Attributes:[{Name:"generic.max_health",Base:${entityHealth}}]`,
            );
        }

        if (noAI) {
            nbtParts.push('NoAI:1b');
        }

        if (invulnerable) {
            nbtParts.push('Invulnerable:1b');
        }

        if (nbtParts.length > 0) {
            command += ` {${nbtParts.join(',')}}`;
        }

        return command;
    };

    const generateEffectCommand = (): string => {
        if (effectAction === 'clear') {
            return '/effect clear @p';
        }

        const effect = effects.find((e) => e.id === selectedEffect);
        if (!effect) {
            return '/effect give @p';
        }

        if (syntaxMode === 'bedrock') {
            return `/effect @p ${selectedEffect} ${effectDuration} ${effectAmplifier}`;
        }

        const hideParticlesFlag = hideParticles ? ' true' : '';
        return `/effect give @p minecraft:${selectedEffect} ${effectDuration} ${effectAmplifier}${hideParticlesFlag}`;
    };

    const generateTeleportCommand = (): string => {
        const prefix = tpRelative ? '~' : '';
        const x = tpRelative ? (tpX === '0' ? '~' : `~${tpX}`) : tpX;
        const y = tpRelative ? (tpY === '0' ? '~' : `~${tpY}`) : tpY;
        const z = tpRelative ? (tpZ === '0' ? '~' : `~${tpZ}`) : tpZ;

        return `/tp @p ${x} ${y} ${z}`;
    };

    const generateGamemodeCommand = (): string => {
        return `/gamemode ${selectedGamemode}`;
    };

    const getCurrentCommand = (): string => {
        switch (activeTab) {
            case 'give':
                return generateGiveCommand();
            case 'summon':
                return generateSummonCommand();
            case 'effect':
                return generateEffectCommand();
            case 'tp':
                return generateTeleportCommand();
            case 'gamemode':
                return generateGamemodeCommand();
            default:
                return '';
        }
    };

    const copyCommand = async () => {
        const command = getCurrentCommand();
        await navigator.clipboard.writeText(command);
        saveToHistory(command, activeTab);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const toggleEnchantment = (enchId: string) => {
        const exists = selectedEnchantments.find((e) => e.id === enchId);
        if (exists) {
            setSelectedEnchantments(selectedEnchantments.filter((e) => e.id !== enchId));
        } else {
            const enchant = commandEnchantments.find((e) => e.id === enchId);
            if (enchant) {
                setSelectedEnchantments([
                    ...selectedEnchantments,
                    { id: enchId, level: 1 },
                ]);
            }
        }
    };

    const updateEnchantmentLevel = (enchId: string, level: number) => {
        setSelectedEnchantments(
            selectedEnchantments.map((e) => (e.id === enchId ? { ...e, level } : e)),
        );
    };

    const resetCurrentTab = () => {
        switch (activeTab) {
            case 'give':
                setSelectedItem('diamond_sword');
                setItemCount('1');
                setCustomItemName('');
                setSelectedEnchantments([]);
                break;
            case 'summon':
                setSelectedEntity('zombie');
                setPosX('~');
                setPosY('~');
                setPosZ('~');
                setCustomEntityName('');
                setEntityHealth('');
                setNoAI(false);
                setInvulnerable(false);
                break;
            case 'effect':
                setEffectAction('give');
                setSelectedEffect('speed');
                setEffectDuration('30');
                setEffectAmplifier('0');
                setHideParticles(false);
                break;
            case 'tp':
                setTpX('0');
                setTpY('64');
                setTpZ('0');
                setTpRelative(false);
                break;
            case 'gamemode':
                setSelectedGamemode('survival');
                break;
        }
    };

    const groupedEntities = entityTypes.reduce(
        (acc, entity) => {
            if (!acc[entity.category]) {
                acc[entity.category] = [];
            }
            acc[entity.category].push(entity);
            return acc;
        },
        {} as Record<string, typeof entityTypes>,
    );

    const groupedItems = items.reduce(
        (acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        },
        {} as Record<string, typeof items>,
    );

    const sidebar = (
        <>
            <OutputPanel
                title="Generated Command"
                actions={
                    <Select
                        value={syntaxMode}
                        onValueChange={(value) => {
                            setSyntaxMode(value as 'java' | 'bedrock');
                        }}
                    >
                        <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="bedrock">Bedrock</SelectItem>
                        </SelectContent>
                    </Select>
                }
            >
                <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                    <code className="block break-all font-mono text-xs text-[oklch(0.72_0.14_75)] dark:text-[oklch(0.75_0.15_75)]">
                        {getCurrentCommand()}
                    </code>
                </div>

                <div className="flex gap-2">
                    <Button onClick={copyCommand} className="flex-1">
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
                    <Button
                        onClick={resetCurrentTab}
                        variant="outline"
                        className="flex-1"
                    >
                        <RotateCcw className="mr-2 size-4" />
                        Reset
                    </Button>
                </div>
            </OutputPanel>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="size-5" />
                            Command History
                        </CardTitle>
                        {commandHistory.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearHistory}
                            >
                                <Trash2 className="mr-2 size-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {commandHistory.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground">
                            No commands generated yet
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {commandHistory.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative rounded-lg border bg-muted/30 p-3 transition-all hover:bg-muted/50"
                                >
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-xs font-medium uppercase text-muted-foreground">
                                            {item.type}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="size-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                            onClick={async () => {
                                                await navigator.clipboard.writeText(
                                                    item.command,
                                                );
                                                setCopied(true);
                                                setTimeout(() => {
                                                    setCopied(false);
                                                }, 2000);
                                            }}
                                        >
                                            <Copy className="size-4" />
                                        </Button>
                                    </div>
                                    <code className="block break-all font-mono text-xs">
                                        {item.command}
                                    </code>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div>
                        <strong className="text-foreground">1. Select command type</strong>
                        <p>Choose from Give, Summon, Effect, Teleport, or Gamemode.</p>
                    </div>
                    <div>
                        <strong className="text-foreground">2. Configure options</strong>
                        <p>
                            Fill in the parameters specific to your selected command
                            type.
                        </p>
                    </div>
                    <div>
                        <strong className="text-foreground">3. Copy command</strong>
                        <p>
                            Click the Copy button to copy the generated command to your
                            clipboard.
                        </p>
                    </div>
                    <div>
                        <strong className="text-foreground">4. Use in Minecraft</strong>
                        <p>
                            Paste the command in your Minecraft chat (press T or /) and
                            execute it.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Minecraft Command Generator" />
            <ToolLayout
                title="Minecraft Command Generator"
                description="Generate complex Minecraft commands with an easy-to-use interface"
                sidebar={sidebar}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Command Type</CardTitle>
                        <CardDescription>
                            Select the type of command you want to generate
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-5">
                                        <TabsTrigger value="give">
                                            <Gift className="mr-2 size-4" />
                                            Give
                                        </TabsTrigger>
                                        <TabsTrigger value="summon">
                                            <Users className="mr-2 size-4" />
                                            Summon
                                        </TabsTrigger>
                                        <TabsTrigger value="effect">
                                            <Sparkles className="mr-2 size-4" />
                                            Effect
                                        </TabsTrigger>
                                        <TabsTrigger value="tp">
                                            <Navigation className="mr-2 size-4" />
                                            Teleport
                                        </TabsTrigger>
                                        <TabsTrigger value="gamemode">
                                            <Swords className="mr-2 size-4" />
                                            Gamemode
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="give" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="item-select">Item</Label>
                                            <Select
                                                value={selectedItem}
                                                onValueChange={setSelectedItem}
                                            >
                                                <SelectTrigger id="item-select">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(groupedItems).map(
                                                        ([category, categoryItems]) => (
                                                            <div key={category}>
                                                                <div className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground">
                                                                    {category}
                                                                </div>
                                                                {categoryItems.map((item) => (
                                                                    <SelectItem
                                                                        key={item.id}
                                                                        value={item.id}
                                                                    >
                                                                        {item.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </div>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="item-count">Count</Label>
                                            <Input
                                                id="item-count"
                                                type="number"
                                                min="1"
                                                max="64"
                                                value={itemCount}
                                                onChange={(e) => {
                                                    setItemCount(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="custom-item-name">
                                                Custom Name (Optional)
                                            </Label>
                                            <Input
                                                id="custom-item-name"
                                                type="text"
                                                placeholder="Legendary Sword"
                                                value={customItemName}
                                                onChange={(e) => {
                                                    setCustomItemName(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Enchantments (Java Only)</Label>
                                            <div className="grid max-h-64 gap-2 overflow-y-auto rounded-lg border p-3">
                                                {commandEnchantments.map((enchant) => {
                                                    const selected = selectedEnchantments.find(
                                                        (e) => e.id === enchant.id,
                                                    );
                                                    return (
                                                        <div
                                                            key={enchant.id}
                                                            className="flex items-center gap-3"
                                                        >
                                                            <Checkbox
                                                                id={`enchant-${enchant.id}`}
                                                                checked={Boolean(selected)}
                                                                onCheckedChange={() => {
                                                                    toggleEnchantment(enchant.id);
                                                                }}
                                                            />
                                                            <Label
                                                                htmlFor={`enchant-${enchant.id}`}
                                                                className="flex-1 cursor-pointer"
                                                            >
                                                                {enchant.name}
                                                            </Label>
                                                            {selected && (
                                                                <Input
                                                                    type="number"
                                                                    min="1"
                                                                    max={enchant.maxLevel}
                                                                    value={selected.level}
                                                                    onChange={(e) => {
                                                                        updateEnchantmentLevel(
                                                                            enchant.id,
                                                                            Number.parseInt(
                                                                                e.target.value,
                                                                            ),
                                                                        );
                                                                    }}
                                                                    className="w-20"
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="summon" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="entity-select">Entity</Label>
                                            <Select
                                                value={selectedEntity}
                                                onValueChange={setSelectedEntity}
                                            >
                                                <SelectTrigger id="entity-select">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(groupedEntities).map(
                                                        ([category, categoryEntities]) => (
                                                            <div key={category}>
                                                                <div className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground">
                                                                    {category}
                                                                </div>
                                                                {categoryEntities.map((entity) => (
                                                                    <SelectItem
                                                                        key={entity.id}
                                                                        value={entity.id}
                                                                    >
                                                                        {entity.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </div>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="pos-x">X Position</Label>
                                                <Input
                                                    id="pos-x"
                                                    type="text"
                                                    placeholder="~"
                                                    value={posX}
                                                    onChange={(e) => {
                                                        setPosX(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pos-y">Y Position</Label>
                                                <Input
                                                    id="pos-y"
                                                    type="text"
                                                    placeholder="~"
                                                    value={posY}
                                                    onChange={(e) => {
                                                        setPosY(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pos-z">Z Position</Label>
                                                <Input
                                                    id="pos-z"
                                                    type="text"
                                                    placeholder="~"
                                                    value={posZ}
                                                    onChange={(e) => {
                                                        setPosZ(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="custom-entity-name">
                                                Custom Name (Optional, Java Only)
                                            </Label>
                                            <Input
                                                id="custom-entity-name"
                                                type="text"
                                                placeholder="Boss Zombie"
                                                value={customEntityName}
                                                onChange={(e) => {
                                                    setCustomEntityName(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="entity-health">
                                                Health (Optional, Java Only)
                                            </Label>
                                            <Input
                                                id="entity-health"
                                                type="number"
                                                min="1"
                                                placeholder="20"
                                                value={entityHealth}
                                                onChange={(e) => {
                                                    setEntityHealth(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="no-ai"
                                                    checked={noAI}
                                                    onCheckedChange={(checked) => {
                                                        setNoAI(Boolean(checked));
                                                    }}
                                                />
                                                <Label htmlFor="no-ai" className="cursor-pointer">
                                                    No AI (Java Only)
                                                </Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="invulnerable"
                                                    checked={invulnerable}
                                                    onCheckedChange={(checked) => {
                                                        setInvulnerable(Boolean(checked));
                                                    }}
                                                />
                                                <Label
                                                    htmlFor="invulnerable"
                                                    className="cursor-pointer"
                                                >
                                                    Invulnerable (Java Only)
                                                </Label>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="effect" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Action</Label>
                                            <Select
                                                value={effectAction}
                                                onValueChange={(value) => {
                                                    setEffectAction(value as 'give' | 'clear');
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="give">
                                                        Give Effect
                                                    </SelectItem>
                                                    <SelectItem value="clear">
                                                        Clear Effects
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {effectAction === 'give' && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label htmlFor="effect-select">Effect</Label>
                                                    <Select
                                                        value={selectedEffect}
                                                        onValueChange={setSelectedEffect}
                                                    >
                                                        <SelectTrigger id="effect-select">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {effects.map((effect) => (
                                                                <SelectItem
                                                                    key={effect.id}
                                                                    value={effect.id}
                                                                >
                                                                    {effect.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="effect-duration">
                                                        Duration (seconds)
                                                    </Label>
                                                    <Input
                                                        id="effect-duration"
                                                        type="number"
                                                        min="1"
                                                        value={effectDuration}
                                                        onChange={(e) => {
                                                            setEffectDuration(e.target.value);
                                                        }}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="effect-amplifier">
                                                        Amplifier (Level - 1)
                                                    </Label>
                                                    <Input
                                                        id="effect-amplifier"
                                                        type="number"
                                                        min="0"
                                                        max="255"
                                                        value={effectAmplifier}
                                                        onChange={(e) => {
                                                            setEffectAmplifier(e.target.value);
                                                        }}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        For Speed II, use amplifier 1
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="hide-particles"
                                                        checked={hideParticles}
                                                        onCheckedChange={(checked) => {
                                                            setHideParticles(Boolean(checked));
                                                        }}
                                                    />
                                                    <Label
                                                        htmlFor="hide-particles"
                                                        className="cursor-pointer"
                                                    >
                                                        Hide Particles (Java Only)
                                                    </Label>
                                                </div>
                                            </>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="tp" className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="tp-relative"
                                                checked={tpRelative}
                                                onCheckedChange={(checked) => {
                                                    setTpRelative(Boolean(checked));
                                                }}
                                            />
                                            <Label htmlFor="tp-relative" className="cursor-pointer">
                                                Relative to current position
                                            </Label>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="tp-x">
                                                    X {tpRelative ? '(Offset)' : ''}
                                                </Label>
                                                <Input
                                                    id="tp-x"
                                                    type="text"
                                                    value={tpX}
                                                    onChange={(e) => {
                                                        setTpX(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="tp-y">
                                                    Y {tpRelative ? '(Offset)' : ''}
                                                </Label>
                                                <Input
                                                    id="tp-y"
                                                    type="text"
                                                    value={tpY}
                                                    onChange={(e) => {
                                                        setTpY(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="tp-z">
                                                    Z {tpRelative ? '(Offset)' : ''}
                                                </Label>
                                                <Input
                                                    id="tp-z"
                                                    type="text"
                                                    value={tpZ}
                                                    onChange={(e) => {
                                                        setTpZ(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {tpRelative && (
                                            <p className="text-sm text-muted-foreground">
                                                Use 0 to stay at current position, positive to move
                                                forward, negative to move backward
                                            </p>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="gamemode" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Gamemode</Label>
                                            <Select
                                                value={selectedGamemode}
                                                onValueChange={setSelectedGamemode}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {gamemodes.map((mode) => (
                                                        <SelectItem key={mode.id} value={mode.id}>
                                                            {mode.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                    </CardContent>
                </Card>
            </ToolLayout>
        </AppLayout>
    );
}
