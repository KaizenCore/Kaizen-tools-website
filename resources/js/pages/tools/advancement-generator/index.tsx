import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    advancementPresets,
    frameTypes,
    minecraftItems,
    triggerTypes,
} from '@/data/advancement-data';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Check, Copy, Download, RotateCcw, Sparkles } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Advancement Generator',
        href: '/tools/advancement-generator',
    },
];

export default function AdvancementGenerator() {
    const [title, setTitle] = useState('My Advancement');
    const [description, setDescription] = useState(
        'Complete this advancement to earn rewards'
    );
    const [icon, setIcon] = useState('minecraft:diamond');
    const [frame, setFrame] = useState('task');
    const [parent, setParent] = useState('');
    const [background, setBackground] = useState('');
    const [trigger, setTrigger] = useState('inventory_changed');
    const [showToast, setShowToast] = useState(true);
    const [announceToChat, setAnnounceToChat] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [experience, setExperience] = useState(0);
    const [lootTables, setLootTables] = useState('');
    const [recipes, setRecipes] = useState('');
    const [functionPath, setFunctionPath] = useState('');
    const [copied, setCopied] = useState(false);

    const reset = () => {
        setTitle('My Advancement');
        setDescription('Complete this advancement to earn rewards');
        setIcon('minecraft:diamond');
        setFrame('task');
        setParent('');
        setBackground('');
        setTrigger('inventory_changed');
        setShowToast(true);
        setAnnounceToChat(false);
        setHidden(false);
        setExperience(0);
        setLootTables('');
        setRecipes('');
        setFunctionPath('');
    };

    const loadPreset = (presetId: string) => {
        const preset = advancementPresets.find((p) => p.id === presetId);
        if (!preset) {
            return;
        }

        setTitle(preset.data.title);
        setDescription(preset.data.description);
        setIcon(preset.data.icon);
        setFrame(preset.data.frame);
        setTrigger(preset.data.trigger);
        setShowToast(preset.data.showToast);
        setAnnounceToChat(preset.data.announceToChat);
        setHidden(preset.data.hidden);
    };

    const generateJSON = () => {
        const advancement: Record<string, unknown> = {
            display: {
                icon: {
                    id: icon,
                },
                title: {
                    text: title,
                },
                description: {
                    text: description,
                },
                frame: frame,
                show_toast: showToast,
                announce_to_chat: announceToChat,
                hidden: hidden,
            },
            criteria: {
                requirement: {
                    trigger: `minecraft:${trigger}`,
                },
            },
        };

        if (parent) {
            advancement.parent = parent;
        }

        if (background) {
            advancement.display = {
                ...advancement.display,
                background: background,
            };
        }

        const rewards: Record<string, unknown> = {};
        if (experience > 0) {
            rewards.experience = experience;
        }
        if (lootTables.trim()) {
            rewards.loot = lootTables
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t);
        }
        if (recipes.trim()) {
            rewards.recipes = recipes
                .split(',')
                .map((r) => r.trim())
                .filter((r) => r);
        }
        if (functionPath.trim()) {
            rewards.function = functionPath.trim();
        }

        if (Object.keys(rewards).length > 0) {
            advancement.rewards = rewards;
        }

        return JSON.stringify(advancement, null, 2);
    };

    const copyJSON = async () => {
        const json = generateJSON();
        await navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadJSON = () => {
        const json = generateJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const selectedFrame = frameTypes.find((f) => f.id === frame);
    const selectedTrigger = triggerTypes.find((t) => t.id === trigger);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Advancement Generator" />

            <div className="mx-auto max-w-screen-2xl p-4 sm:p-6">
                <div className="mb-6 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Minecraft Advancement Generator
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Create custom advancements with triggers, rewards, and
                        display options
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Presets</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {advancementPresets.map((preset) => (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => loadPreset(preset.id)}
                                            className="flex items-start gap-3 rounded-lg border p-3 text-left transition-all hover:bg-muted"
                                        >
                                            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                                            <div className="min-w-0 flex-1">
                                                <div className="font-medium">
                                                    {preset.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {preset.description}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        placeholder="Enter advancement title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        placeholder="Enter advancement description"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="icon">Icon</Label>
                                        <Select value={icon} onValueChange={setIcon}>
                                            <SelectTrigger id="icon">
                                                <SelectValue placeholder="Select icon" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['materials', 'tools', 'armor', 'blocks', 'food', 'misc'].map(
                                                    (category) => {
                                                        const items =
                                                            minecraftItems.filter(
                                                                (item) =>
                                                                    item.category ===
                                                                    category
                                                            );
                                                        if (items.length === 0) {
                                                            return null;
                                                        }
                                                        return (
                                                            <div key={category}>
                                                                <div className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground">
                                                                    {category}
                                                                </div>
                                                                {items.map(
                                                                    (item) => (
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
                                                                    )
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="frame">Frame Type</Label>
                                        <Select value={frame} onValueChange={setFrame}>
                                            <SelectTrigger id="frame">
                                                <SelectValue placeholder="Select frame" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {frameTypes.map((f) => (
                                                    <SelectItem
                                                        key={f.id}
                                                        value={f.id}
                                                    >
                                                        {f.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {selectedFrame && (
                                            <p className="text-xs text-muted-foreground">
                                                {selectedFrame.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="parent">
                                            Parent Advancement (Optional)
                                        </Label>
                                        <Input
                                            id="parent"
                                            value={parent}
                                            onChange={(e) =>
                                                setParent(e.target.value)
                                            }
                                            placeholder="e.g., minecraft:story/root"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="background">
                                            Background Texture (Optional)
                                        </Label>
                                        <Input
                                            id="background"
                                            value={background}
                                            onChange={(e) =>
                                                setBackground(e.target.value)
                                            }
                                            placeholder="e.g., minecraft:textures/gui/advancements/backgrounds/stone.png"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Trigger</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="trigger">Trigger Type</Label>
                                    <Select
                                        value={trigger}
                                        onValueChange={setTrigger}
                                    >
                                        <SelectTrigger id="trigger">
                                            <SelectValue placeholder="Select trigger" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['general', 'inventory', 'combat', 'exploration', 'farming', 'building'].map(
                                                (category) => {
                                                    const triggers =
                                                        triggerTypes.filter(
                                                            (t) =>
                                                                t.category ===
                                                                category
                                                        );
                                                    if (triggers.length === 0) {
                                                        return null;
                                                    }
                                                    return (
                                                        <div key={category}>
                                                            <div className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground">
                                                                {category}
                                                            </div>
                                                            {triggers.map(
                                                                (t) => (
                                                                    <SelectItem
                                                                        key={t.id}
                                                                        value={
                                                                            t.id
                                                                        }
                                                                    >
                                                                        {t.name}
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {selectedTrigger && (
                                        <p className="text-xs text-muted-foreground">
                                            {selectedTrigger.description}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Display Options</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3 rounded-lg border p-4">
                                    <Checkbox
                                        id="showToast"
                                        checked={showToast}
                                        onCheckedChange={(checked) =>
                                            setShowToast(checked === true)
                                        }
                                    />
                                    <Label htmlFor="showToast" className="flex-1 cursor-pointer">
                                        <span className="font-medium">
                                            Show Toast Notification
                                        </span>
                                        <span className="block text-xs font-normal text-muted-foreground">
                                            Display a popup notification when
                                            earned
                                        </span>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-3 rounded-lg border p-4">
                                    <Checkbox
                                        id="announceToChat"
                                        checked={announceToChat}
                                        onCheckedChange={(checked) =>
                                            setAnnounceToChat(checked === true)
                                        }
                                    />
                                    <Label
                                        htmlFor="announceToChat"
                                        className="flex-1 cursor-pointer"
                                    >
                                        <span className="font-medium">
                                            Announce to Chat
                                        </span>
                                        <span className="block text-xs font-normal text-muted-foreground">
                                            Send a message to chat when earned
                                        </span>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-3 rounded-lg border p-4">
                                    <Checkbox
                                        id="hidden"
                                        checked={hidden}
                                        onCheckedChange={(checked) =>
                                            setHidden(checked === true)
                                        }
                                    />
                                    <Label htmlFor="hidden" className="flex-1 cursor-pointer">
                                        <span className="font-medium">Hidden</span>
                                        <span className="block text-xs font-normal text-muted-foreground">
                                            Hide until obtained
                                        </span>
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Rewards (Optional)</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="experience">
                                        Experience Points
                                    </Label>
                                    <Input
                                        id="experience"
                                        type="number"
                                        value={experience}
                                        onChange={(e) =>
                                            setExperience(
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lootTables">
                                        Loot Tables (comma-separated)
                                    </Label>
                                    <Input
                                        id="lootTables"
                                        value={lootTables}
                                        onChange={(e) =>
                                            setLootTables(e.target.value)
                                        }
                                        placeholder="e.g., minecraft:chests/simple_dungeon"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="recipes">
                                        Recipes to Unlock (comma-separated)
                                    </Label>
                                    <Input
                                        id="recipes"
                                        value={recipes}
                                        onChange={(e) => setRecipes(e.target.value)}
                                        placeholder="e.g., minecraft:diamond_sword, minecraft:diamond_pickaxe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="function">Function to Run</Label>
                                    <Input
                                        id="function"
                                        value={functionPath}
                                        onChange={(e) =>
                                            setFunctionPath(e.target.value)
                                        }
                                        placeholder="e.g., namespace:path/to/function"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>JSON Output</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="max-h-96 overflow-y-auto rounded-lg border bg-muted/50 p-3">
                                    <pre className="font-mono text-xs">
                                        {generateJSON()}
                                    </pre>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={copyJSON}
                                        className="flex-1"
                                        disabled={copied}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="mr-2 size-4" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="mr-2 size-4" />
                                                Copy JSON
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={downloadJSON}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <Download className="mr-2 size-4" />
                                        Download
                                    </Button>
                                </div>
                                <Button
                                    onClick={reset}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <RotateCcw className="mr-2 size-4" />
                                    Reset All
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>How to Use</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div>
                                    <strong className="text-foreground">
                                        1. Configure your advancement
                                    </strong>
                                    <p>
                                        Set the title, description, icon, frame
                                        type, and trigger conditions.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <strong className="text-foreground">
                                        2. Add rewards (optional)
                                    </strong>
                                    <p>
                                        Grant experience points, loot tables,
                                        recipes, or run functions.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <strong className="text-foreground">
                                        3. Download the JSON
                                    </strong>
                                    <p>
                                        Save the JSON file to your datapack's
                                        advancements folder.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <strong className="text-foreground">
                                        4. File location
                                    </strong>
                                    <p className="font-mono text-xs">
                                        datapacks/[namespace]/data/[namespace]/advancements/
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
