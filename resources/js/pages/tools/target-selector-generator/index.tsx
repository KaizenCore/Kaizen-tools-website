import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { OutputPanel, ToolLayout } from '@/components/tool-layout';
import {
    entityTypes,
    gamemodeOptions,
    presetExamples,
    selectorTypes,
    sortOptions,
    type PresetExample,
} from '@/data/target-selector-data';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Check,
    ChevronDown,
    Copy,
    Crosshair,
    Dices,
    MapPin,
    RotateCcw,
    Settings,
    Target,
    Users,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Target Selector',
        href: '/tools/target-selector',
    },
];

interface ScoreObjective {
    objective: string;
    min: string;
    max: string;
}

export default function TargetSelectorGenerator() {
    const [copied, setCopied] = useState(false);
    const [selectorType, setSelectorType] = useState('@a');

    const [positionX, setPositionX] = useState('');
    const [positionY, setPositionY] = useState('');
    const [positionZ, setPositionZ] = useState('');
    const [positionMode, setPositionMode] = useState<'absolute' | 'relative' | 'local'>('absolute');

    const [dx, setDx] = useState('');
    const [dy, setDy] = useState('');
    const [dz, setDz] = useState('');

    const [distanceMin, setDistanceMin] = useState('');
    const [distanceMax, setDistanceMax] = useState('');

    const [entityType, setEntityType] = useState('');
    const [entityTypeNegate, setEntityTypeNegate] = useState(false);
    const [entitySearch, setEntitySearch] = useState('');

    const [gamemode, setGamemode] = useState('');
    const [gamemodeNegate, setGamemodeNegate] = useState(false);

    const [name, setName] = useState('');
    const [nameExact, setNameExact] = useState(true);

    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const [team, setTeam] = useState('');
    const [teamNegate, setTeamNegate] = useState(false);

    const [levelMin, setLevelMin] = useState('');
    const [levelMax, setLevelMax] = useState('');

    const [xRotationMin, setXRotationMin] = useState('');
    const [xRotationMax, setXRotationMax] = useState('');

    const [yRotationMin, setYRotationMin] = useState('');
    const [yRotationMax, setYRotationMax] = useState('');

    const [limit, setLimit] = useState('');
    const [sort, setSort] = useState('');

    const [scores, setScores] = useState<ScoreObjective[]>([]);

    const [nbt, setNbt] = useState('');
    const [predicate, setPredicate] = useState('');

    const [positionOpen, setPositionOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(true);
    const [limitsOpen, setLimitsOpen] = useState(false);
    const [advancedOpen, setAdvancedOpen] = useState(false);

    const generateSelector = (): string => {
        const args: string[] = [];

        if (positionX || positionY || positionZ) {
            const prefix = positionMode === 'relative' ? '~' : positionMode === 'local' ? '^' : '';
            if (positionX) {
                args.push(`x=${prefix}${positionX}`);
            }
            if (positionY) {
                args.push(`y=${prefix}${positionY}`);
            }
            if (positionZ) {
                args.push(`z=${prefix}${positionZ}`);
            }
        }

        if (dx) {
            args.push(`dx=${dx}`);
        }
        if (dy) {
            args.push(`dy=${dy}`);
        }
        if (dz) {
            args.push(`dz=${dz}`);
        }

        if (distanceMin || distanceMax) {
            const min = distanceMin || '';
            const max = distanceMax || '';
            args.push(`distance=${min}..${max}`);
        }

        if (entityType) {
            const prefix = entityTypeNegate ? '!' : '';
            args.push(`type=${prefix}${entityType}`);
        }

        if (gamemode) {
            const prefix = gamemodeNegate ? '!' : '';
            args.push(`gamemode=${prefix}${gamemode}`);
        }

        if (name) {
            if (nameExact) {
                args.push(`name="${name}"`);
            } else {
                args.push(`name=${name}`);
            }
        }

        if (tags.length > 0) {
            for (const tag of tags) {
                args.push(`tag=${tag}`);
            }
        }

        if (team) {
            const prefix = teamNegate ? '!' : '';
            args.push(`team=${prefix}${team}`);
        }

        if (levelMin || levelMax) {
            const min = levelMin || '';
            const max = levelMax || '';
            args.push(`level=${min}..${max}`);
        }

        if (xRotationMin || xRotationMax) {
            const min = xRotationMin || '';
            const max = xRotationMax || '';
            args.push(`x_rotation=${min}..${max}`);
        }

        if (yRotationMin || yRotationMax) {
            const min = yRotationMin || '';
            const max = yRotationMax || '';
            args.push(`y_rotation=${min}..${max}`);
        }

        if (limit) {
            args.push(`limit=${limit}`);
        }

        if (sort) {
            args.push(`sort=${sort}`);
        }

        if (scores.length > 0) {
            const scoresStr = scores
                .filter((s) => s.objective)
                .map((s) => {
                    const min = s.min || '';
                    const max = s.max || '';
                    return `${s.objective}=${min}..${max}`;
                })
                .join(',');
            if (scoresStr) {
                args.push(`scores={${scoresStr}}`);
            }
        }

        if (nbt) {
            args.push(`nbt=${nbt}`);
        }

        if (predicate) {
            args.push(`predicate=${predicate}`);
        }

        if (args.length === 0) {
            return selectorType;
        }

        return `${selectorType}[${args.join(',')}]`;
    };

    const copySelector = async () => {
        const selector = generateSelector();
        await navigator.clipboard.writeText(selector);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const resetAll = () => {
        setSelectorType('@a');
        setPositionX('');
        setPositionY('');
        setPositionZ('');
        setPositionMode('absolute');
        setDx('');
        setDy('');
        setDz('');
        setDistanceMin('');
        setDistanceMax('');
        setEntityType('');
        setEntityTypeNegate(false);
        setEntitySearch('');
        setGamemode('');
        setGamemodeNegate(false);
        setName('');
        setNameExact(true);
        setTags([]);
        setTagInput('');
        setTeam('');
        setTeamNegate(false);
        setLevelMin('');
        setLevelMax('');
        setXRotationMin('');
        setXRotationMax('');
        setYRotationMin('');
        setYRotationMax('');
        setLimit('');
        setSort('');
        setScores([]);
        setNbt('');
        setPredicate('');
    };

    const loadPreset = (preset: PresetExample) => {
        resetAll();
        setSelectorType(preset.config.selectorType);

        if (preset.config.distanceMin !== undefined) {
            setDistanceMin(preset.config.distanceMin as string);
        }
        if (preset.config.distanceMax !== undefined) {
            setDistanceMax(preset.config.distanceMax as string);
        }
        if (preset.config.entityType !== undefined) {
            setEntityType(preset.config.entityType as string);
        }
        if (preset.config.entityTypeNegate !== undefined) {
            setEntityTypeNegate(preset.config.entityTypeNegate as boolean);
        }
        if (preset.config.limit !== undefined) {
            setLimit(preset.config.limit as string);
        }
        if (preset.config.sort !== undefined) {
            setSort(preset.config.sort as string);
        }
        if (preset.config.gamemode !== undefined) {
            setGamemode(preset.config.gamemode as string);
        }
        if (preset.config.gamemodeNegate !== undefined) {
            setGamemodeNegate(preset.config.gamemodeNegate as boolean);
        }
        if (preset.config.tags !== undefined) {
            setTags(preset.config.tags as string[]);
        }

        setFiltersOpen(true);
    };

    const addTag = () => {
        if (tagInput && !tags.includes(tagInput)) {
            setTags([...tags, tagInput]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const addScore = () => {
        setScores([...scores, { objective: '', min: '', max: '' }]);
    };

    const updateScore = (index: number, field: keyof ScoreObjective, value: string) => {
        const updated = [...scores];
        updated[index][field] = value;
        setScores(updated);
    };

    const removeScore = (index: number) => {
        setScores(scores.filter((_, i) => i !== index));
    };

    const filteredEntities = entityTypes.filter((entity) =>
        entity.name.toLowerCase().includes(entitySearch.toLowerCase()),
    );

    const groupedEntities = filteredEntities.reduce(
        (acc, entity) => {
            if (!acc[entity.category]) {
                acc[entity.category] = [];
            }
            acc[entity.category].push(entity);
            return acc;
        },
        {} as Record<string, typeof entityTypes>,
    );

    const sidebar = (
        <>
            <OutputPanel
                title="Generated Selector"
                actions={
                    <div className="flex gap-2">
                        <Button onClick={copySelector} variant="ghost" size="sm" disabled={copied}>
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
                        <Button onClick={resetAll} variant="ghost" size="sm">
                            <RotateCcw className="mr-1 size-3" />
                            Reset
                        </Button>
                    </div>
                }
            >
                <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                    <code className="block break-all font-mono text-sm text-accent">
                        {generateSelector()}
                    </code>
                </div>
            </OutputPanel>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Dices className="size-5" />
                        Example Presets
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {presetExamples.map((preset, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => loadPreset(preset)}
                            className="group w-full rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
                        >
                            <div className="mb-1 font-medium group-hover:text-accent-foreground">
                                {preset.name}
                            </div>
                            <div className="mb-2 text-sm text-muted-foreground">
                                {preset.description}
                            </div>
                            <code className="block break-all font-mono text-xs text-accent">
                                {preset.selector}
                            </code>
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
                        <strong className="text-foreground">1. Choose selector type</strong>
                        <p>Select @a, @e, @p, @r, or @s based on your needs.</p>
                    </div>
                    <div>
                        <strong className="text-foreground">2. Configure filters</strong>
                        <p>
                            Add position, entity type, gamemode, and other filters to
                            narrow selection.
                        </p>
                    </div>
                    <div>
                        <strong className="text-foreground">3. Copy selector</strong>
                        <p>Click Copy to copy the generated selector to clipboard.</p>
                    </div>
                    <div>
                        <strong className="text-foreground">4. Use in commands</strong>
                        <p>
                            Paste the selector into any Minecraft command that accepts
                            targets.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Target Selector Generator" />
            <ToolLayout
                title="Minecraft Target Selector Generator"
                description="Create complex target selectors for Minecraft commands"
                sidebar={sidebar}
            >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="size-5" />
                                    Selector Type
                                </CardTitle>
                                <CardDescription>
                                    Choose the base selector type
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Select value={selectorType} onValueChange={setSelectorType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectorTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-semibold">
                                                        {type.name}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        - {type.description}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        <Collapsible open={positionOpen} onOpenChange={setPositionOpen}>
                            <Card>
                                <CardHeader>
                                    <CollapsibleTrigger asChild>
                                        <button className="flex w-full items-center justify-between text-left transition-opacity hover:opacity-70">
                                            <CardTitle className="flex items-center gap-2">
                                                <MapPin className="size-5" />
                                                Position & Volume
                                            </CardTitle>
                                            <ChevronDown
                                                className={`size-5 transition-transform ${positionOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                    </CollapsibleTrigger>
                                    <CardDescription>
                                        Filter by location and area
                                    </CardDescription>
                                </CardHeader>
                                <CollapsibleContent>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Position Mode</Label>
                                            <Select
                                                value={positionMode}
                                                onValueChange={(value) => {
                                                    setPositionMode(
                                                        value as 'absolute' | 'relative' | 'local',
                                                    );
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="absolute">
                                                        Absolute
                                                    </SelectItem>
                                                    <SelectItem value="relative">
                                                        Relative (~)
                                                    </SelectItem>
                                                    <SelectItem value="local">Local (^)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="pos-x">X Position</Label>
                                                <Input
                                                    id="pos-x"
                                                    type="text"
                                                    placeholder="0"
                                                    value={positionX}
                                                    onChange={(e) => {
                                                        setPositionX(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pos-y">Y Position</Label>
                                                <Input
                                                    id="pos-y"
                                                    type="text"
                                                    placeholder="64"
                                                    value={positionY}
                                                    onChange={(e) => {
                                                        setPositionY(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pos-z">Z Position</Label>
                                                <Input
                                                    id="pos-z"
                                                    type="text"
                                                    placeholder="0"
                                                    value={positionZ}
                                                    onChange={(e) => {
                                                        setPositionZ(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="dx">DX Volume</Label>
                                                <Input
                                                    id="dx"
                                                    type="number"
                                                    placeholder="0"
                                                    value={dx}
                                                    onChange={(e) => {
                                                        setDx(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dy">DY Volume</Label>
                                                <Input
                                                    id="dy"
                                                    type="number"
                                                    placeholder="0"
                                                    value={dy}
                                                    onChange={(e) => {
                                                        setDy(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dz">DZ Volume</Label>
                                                <Input
                                                    id="dz"
                                                    type="number"
                                                    placeholder="0"
                                                    value={dz}
                                                    onChange={(e) => {
                                                        setDz(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Distance Range</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="text"
                                                    placeholder="Min (e.g., 5)"
                                                    value={distanceMin}
                                                    onChange={(e) => {
                                                        setDistanceMin(e.target.value);
                                                    }}
                                                />
                                                <Input
                                                    type="text"
                                                    placeholder="Max (e.g., 10)"
                                                    value={distanceMax}
                                                    onChange={(e) => {
                                                        setDistanceMax(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Leave blank for unlimited. Examples: ..5 (up to 5),
                                                5.. (5 or more), 3..10 (between 3 and 10)
                                            </p>
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>

                        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                            <Card>
                                <CardHeader>
                                    <CollapsibleTrigger asChild>
                                        <button className="flex w-full items-center justify-between text-left transition-opacity hover:opacity-70">
                                            <CardTitle className="flex items-center gap-2">
                                                <Users className="size-5" />
                                                Filters
                                            </CardTitle>
                                            <ChevronDown
                                                className={`size-5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                    </CollapsibleTrigger>
                                    <CardDescription>
                                        Filter entities by type, gamemode, and more
                                    </CardDescription>
                                </CardHeader>
                                <CollapsibleContent>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="entity-search">Entity Type</Label>
                                            <Input
                                                id="entity-search"
                                                type="text"
                                                placeholder="Search entities..."
                                                value={entitySearch}
                                                onChange={(e) => {
                                                    setEntitySearch(e.target.value);
                                                }}
                                                className="mb-2"
                                            />
                                            <Select value={entityType} onValueChange={setEntityType}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select entity type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">
                                                        None (All entities)
                                                    </SelectItem>
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
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="entity-negate"
                                                    checked={entityTypeNegate}
                                                    onCheckedChange={(checked) => {
                                                        setEntityTypeNegate(Boolean(checked));
                                                    }}
                                                />
                                                <Label
                                                    htmlFor="entity-negate"
                                                    className="cursor-pointer"
                                                >
                                                    Negate (exclude this type)
                                                </Label>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="gamemode">Gamemode</Label>
                                            <Select value={gamemode} onValueChange={setGamemode}>
                                                <SelectTrigger id="gamemode">
                                                    <SelectValue placeholder="Select gamemode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">None</SelectItem>
                                                    {gamemodeOptions.map((mode) => (
                                                        <SelectItem key={mode.id} value={mode.id}>
                                                            {mode.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="gamemode-negate"
                                                    checked={gamemodeNegate}
                                                    onCheckedChange={(checked) => {
                                                        setGamemodeNegate(Boolean(checked));
                                                    }}
                                                />
                                                <Label
                                                    htmlFor="gamemode-negate"
                                                    className="cursor-pointer"
                                                >
                                                    Negate (exclude this gamemode)
                                                </Label>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Entity name"
                                                value={name}
                                                onChange={(e) => {
                                                    setName(e.target.value);
                                                }}
                                            />
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="name-exact"
                                                    checked={nameExact}
                                                    onCheckedChange={(checked) => {
                                                        setNameExact(Boolean(checked));
                                                    }}
                                                />
                                                <Label htmlFor="name-exact" className="cursor-pointer">
                                                    Exact match (use quotes)
                                                </Label>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tag-input">Tags</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="tag-input"
                                                    type="text"
                                                    placeholder="Add tag..."
                                                    value={tagInput}
                                                    onChange={(e) => {
                                                        setTagInput(e.target.value);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addTag();
                                                        }
                                                    }}
                                                />
                                                <Button type="button" onClick={addTag}>
                                                    Add
                                                </Button>
                                            </div>
                                            {tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {tags.map((tag) => (
                                                        <button
                                                            key={tag}
                                                            type="button"
                                                            onClick={() => {
                                                                removeTag(tag);
                                                            }}
                                                            className="flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-sm transition-colors hover:bg-accent/80"
                                                        >
                                                            {tag}
                                                            <span className="text-muted-foreground">
                                                                ×
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="team">Team</Label>
                                            <Input
                                                id="team"
                                                type="text"
                                                placeholder="Team name"
                                                value={team}
                                                onChange={(e) => {
                                                    setTeam(e.target.value);
                                                }}
                                            />
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="team-negate"
                                                    checked={teamNegate}
                                                    onCheckedChange={(checked) => {
                                                        setTeamNegate(Boolean(checked));
                                                    }}
                                                />
                                                <Label
                                                    htmlFor="team-negate"
                                                    className="cursor-pointer"
                                                >
                                                    Negate (exclude this team)
                                                </Label>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Experience Level Range</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="text"
                                                    placeholder="Min"
                                                    value={levelMin}
                                                    onChange={(e) => {
                                                        setLevelMin(e.target.value);
                                                    }}
                                                />
                                                <Input
                                                    type="text"
                                                    placeholder="Max"
                                                    value={levelMax}
                                                    onChange={(e) => {
                                                        setLevelMax(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>X Rotation (Pitch)</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="text"
                                                    placeholder="Min (-90 to 90)"
                                                    value={xRotationMin}
                                                    onChange={(e) => {
                                                        setXRotationMin(e.target.value);
                                                    }}
                                                />
                                                <Input
                                                    type="text"
                                                    placeholder="Max (-90 to 90)"
                                                    value={xRotationMax}
                                                    onChange={(e) => {
                                                        setXRotationMax(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Y Rotation (Yaw)</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="text"
                                                    placeholder="Min (-180 to 180)"
                                                    value={yRotationMin}
                                                    onChange={(e) => {
                                                        setYRotationMin(e.target.value);
                                                    }}
                                                />
                                                <Input
                                                    type="text"
                                                    placeholder="Max (-180 to 180)"
                                                    value={yRotationMax}
                                                    onChange={(e) => {
                                                        setYRotationMax(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>

                        <Collapsible open={limitsOpen} onOpenChange={setLimitsOpen}>
                            <Card>
                                <CardHeader>
                                    <CollapsibleTrigger asChild>
                                        <button className="flex w-full items-center justify-between text-left transition-opacity hover:opacity-70">
                                            <CardTitle className="flex items-center gap-2">
                                                <Crosshair className="size-5" />
                                                Limits & Sorting
                                            </CardTitle>
                                            <ChevronDown
                                                className={`size-5 transition-transform ${limitsOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                    </CollapsibleTrigger>
                                    <CardDescription>
                                        Control selection count and order
                                    </CardDescription>
                                </CardHeader>
                                <CollapsibleContent>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="limit">Limit</Label>
                                            <Input
                                                id="limit"
                                                type="number"
                                                min="1"
                                                placeholder="Maximum entities"
                                                value={limit}
                                                onChange={(e) => {
                                                    setLimit(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="sort">Sort</Label>
                                            <Select value={sort} onValueChange={setSort}>
                                                <SelectTrigger id="sort">
                                                    <SelectValue placeholder="Select sort order" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">None</SelectItem>
                                                    {sortOptions.map((option) => (
                                                        <SelectItem key={option.id} value={option.id}>
                                                            <div className="flex flex-col">
                                                                <span>{option.name}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {option.description}
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>

                        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                            <Card>
                                <CardHeader>
                                    <CollapsibleTrigger asChild>
                                        <button className="flex w-full items-center justify-between text-left transition-opacity hover:opacity-70">
                                            <CardTitle className="flex items-center gap-2">
                                                <Settings className="size-5" />
                                                Advanced
                                            </CardTitle>
                                            <ChevronDown
                                                className={`size-5 transition-transform ${advancedOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                    </CollapsibleTrigger>
                                    <CardDescription>
                                        Scores, NBT data, and predicates
                                    </CardDescription>
                                </CardHeader>
                                <CollapsibleContent>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Scores</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={addScore}
                                                >
                                                    Add Score
                                                </Button>
                                            </div>
                                            {scores.length > 0 && (
                                                <div className="space-y-3">
                                                    {scores.map((score, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex gap-2 rounded-lg border p-3"
                                                        >
                                                            <Input
                                                                type="text"
                                                                placeholder="Objective"
                                                                value={score.objective}
                                                                onChange={(e) => {
                                                                    updateScore(
                                                                        index,
                                                                        'objective',
                                                                        e.target.value,
                                                                    );
                                                                }}
                                                                className="flex-1"
                                                            />
                                                            <Input
                                                                type="text"
                                                                placeholder="Min"
                                                                value={score.min}
                                                                onChange={(e) => {
                                                                    updateScore(
                                                                        index,
                                                                        'min',
                                                                        e.target.value,
                                                                    );
                                                                }}
                                                                className="w-24"
                                                            />
                                                            <Input
                                                                type="text"
                                                                placeholder="Max"
                                                                value={score.max}
                                                                onChange={(e) => {
                                                                    updateScore(
                                                                        index,
                                                                        'max',
                                                                        e.target.value,
                                                                    );
                                                                }}
                                                                className="w-24"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    removeScore(index);
                                                                }}
                                                            >
                                                                ×
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nbt">NBT Data</Label>
                                            <Input
                                                id="nbt"
                                                type="text"
                                                placeholder="{CustomName:'Boss'}"
                                                value={nbt}
                                                onChange={(e) => {
                                                    setNbt(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="predicate">Predicate</Label>
                                            <Input
                                                id="predicate"
                                                type="text"
                                                placeholder="namespace:predicate_name"
                                                value={predicate}
                                                onChange={(e) => {
                                                    setPredicate(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>
            </ToolLayout>
        </AppLayout>
    );
}
