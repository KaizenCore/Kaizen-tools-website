import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    OutputPanel,
    ToolLayout,
    ToolSection,
} from '@/components/tool-layout';
import {
    formattingCodes,
    teamColors,
    teamOptions,
    teamPresets,
    type TeamPreset,
} from '@/data/team-data';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Team Generator',
        href: '/tools/team-generator',
    },
];

interface TeamConfig {
    name: string;
    displayName: string;
    color: string;
    prefix: string;
    suffix: string;
    friendlyFire: boolean;
    seeFriendlyInvisibles: boolean;
    nametagVisibility: string;
    deathMessageVisibility: string;
    collisionRule: string;
}

export default function TeamGenerator() {
    const [activeTab, setActiveTab] = useState('create');
    const [copied, setCopied] = useState(false);

    const [teamConfig, setTeamConfig] = useState<TeamConfig>({
        name: '',
        displayName: '',
        color: 'red',
        prefix: '',
        suffix: '',
        friendlyFire: false,
        seeFriendlyInvisibles: true,
        nametagVisibility: 'always',
        deathMessageVisibility: 'always',
        collisionRule: 'always',
    });

    const [manageMembersTeam, setManageMembersTeam] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [memberAction, setMemberAction] = useState<
        'add' | 'remove' | 'empty' | 'list'
    >('add');

    const [modifyTeam, setModifyTeam] = useState('');
    const [modifyProperty, setModifyProperty] = useState('color');
    const [modifyValue, setModifyValue] = useState('');

    const [removeTeam, setRemoveTeam] = useState('');

    const updateConfig = (key: keyof TeamConfig, value: string | boolean) => {
        setTeamConfig((prev) => ({ ...prev, [key]: value }));
    };

    const reset = () => {
        setTeamConfig({
            name: '',
            displayName: '',
            color: 'red',
            prefix: '',
            suffix: '',
            friendlyFire: false,
            seeFriendlyInvisibles: true,
            nametagVisibility: 'always',
            deathMessageVisibility: 'always',
            collisionRule: 'always',
        });
    };

    const applyPreset = (preset: TeamPreset) => {
        if (preset.teams.length === 1) {
            const team = preset.teams[0];
            setTeamConfig({
                name: team.name,
                displayName: team.displayName,
                color: team.color,
                prefix: team.prefix || '',
                suffix: team.suffix || '',
                friendlyFire: team.friendlyFire,
                seeFriendlyInvisibles: team.seeFriendlyInvisibles,
                nametagVisibility: team.nametagVisibility,
                deathMessageVisibility: team.deathMessageVisibility,
                collisionRule: team.collisionRule,
            });
        }
    };

    const generateCreateCommands = () => {
        const commands: string[] = [];

        if (!teamConfig.name) {
            return ['# Enter a team name to generate commands'];
        }

        commands.push(`/team add ${teamConfig.name}`);

        if (teamConfig.displayName) {
            commands.push(
                `/team modify ${teamConfig.name} displayName "${teamConfig.displayName}"`,
            );
        }

        commands.push(`/team modify ${teamConfig.name} color ${teamConfig.color}`);

        if (teamConfig.prefix) {
            commands.push(
                `/team modify ${teamConfig.name} prefix "${teamConfig.prefix}"`,
            );
        }

        if (teamConfig.suffix) {
            commands.push(
                `/team modify ${teamConfig.name} suffix "${teamConfig.suffix}"`,
            );
        }

        commands.push(
            `/team modify ${teamConfig.name} friendlyFire ${teamConfig.friendlyFire}`,
        );
        commands.push(
            `/team modify ${teamConfig.name} seeFriendlyInvisibles ${teamConfig.seeFriendlyInvisibles}`,
        );
        commands.push(
            `/team modify ${teamConfig.name} nametagVisibility ${teamConfig.nametagVisibility}`,
        );
        commands.push(
            `/team modify ${teamConfig.name} deathMessageVisibility ${teamConfig.deathMessageVisibility}`,
        );
        commands.push(
            `/team modify ${teamConfig.name} collisionRule ${teamConfig.collisionRule}`,
        );

        return commands;
    };

    const generateManageMembersCommand = () => {
        if (!manageMembersTeam) {
            return '# Enter a team name';
        }

        switch (memberAction) {
            case 'add':
                return playerName
                    ? `/team join ${manageMembersTeam} ${playerName}`
                    : '# Enter a player name or selector';
            case 'remove':
                return playerName
                    ? `/team leave ${playerName}`
                    : '# Enter a player name or selector';
            case 'empty':
                return `/team empty ${manageMembersTeam}`;
            case 'list':
                return `/team list ${manageMembersTeam}`;
            default:
                return '';
        }
    };

    const generateModifyCommand = () => {
        if (!modifyTeam) {
            return '# Enter a team name';
        }

        if (!modifyValue) {
            return `# Enter a value for ${modifyProperty}`;
        }

        if (
            modifyProperty === 'displayName' ||
            modifyProperty === 'prefix' ||
            modifyProperty === 'suffix'
        ) {
            return `/team modify ${modifyTeam} ${modifyProperty} "${modifyValue}"`;
        }

        return `/team modify ${modifyTeam} ${modifyProperty} ${modifyValue}`;
    };

    const generateRemoveCommand = () => {
        if (!removeTeam) {
            return '# Enter a team name to remove';
        }

        return `/team remove ${removeTeam}`;
    };

    const generatePresetCommands = (preset: TeamPreset) => {
        const commands: string[] = [];

        for (const team of preset.teams) {
            commands.push(`/team add ${team.name}`);

            if (team.displayName) {
                commands.push(
                    `/team modify ${team.name} displayName "${team.displayName}"`,
                );
            }

            commands.push(`/team modify ${team.name} color ${team.color}`);

            if (team.prefix) {
                commands.push(
                    `/team modify ${team.name} prefix "${team.prefix}"`,
                );
            }

            if (team.suffix) {
                commands.push(
                    `/team modify ${team.name} suffix "${team.suffix}"`,
                );
            }

            commands.push(
                `/team modify ${team.name} friendlyFire ${team.friendlyFire}`,
            );
            commands.push(
                `/team modify ${team.name} seeFriendlyInvisibles ${team.seeFriendlyInvisibles}`,
            );
            commands.push(
                `/team modify ${team.name} nametagVisibility ${team.nametagVisibility}`,
            );
            commands.push(
                `/team modify ${team.name} deathMessageVisibility ${team.deathMessageVisibility}`,
            );
            commands.push(
                `/team modify ${team.name} collisionRule ${team.collisionRule}`,
            );

            commands.push('');
        }

        return commands;
    };

    const copyCommands = async (commands: string[]) => {
        await navigator.clipboard.writeText(commands.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getColorByName = (colorId: string) => {
        return teamColors.find((c) => c.id === colorId);
    };

    const renderColorPreview = (text: string, colorId: string) => {
        const color = getColorByName(colorId);
        return (
            <span style={{ color: color?.hex || '#FFFFFF' }}>{text}</span>
        );
    };

    const parseFormattedText = (text: string) => {
        const parts: JSX.Element[] = [];
        let currentText = '';
        let currentColor = '#FFFFFF';
        let bold = false;
        let italic = false;
        let underline = false;
        let strikethrough = false;

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '&' && i + 1 < text.length) {
                if (currentText) {
                    parts.push(
                        <span
                            key={parts.length}
                            style={{
                                color: currentColor,
                                fontWeight: bold ? 'bold' : 'normal',
                                fontStyle: italic ? 'italic' : 'normal',
                                textDecoration: [
                                    underline ? 'underline' : '',
                                    strikethrough ? 'line-through' : '',
                                ]
                                    .filter(Boolean)
                                    .join(' '),
                            }}
                        >
                            {currentText}
                        </span>,
                    );
                    currentText = '';
                }

                const code = `&${text[i + 1]}`;
                const format = formattingCodes.find((f) => f.code === code);

                if (format) {
                    if (code === '&r') {
                        currentColor = '#FFFFFF';
                        bold = false;
                        italic = false;
                        underline = false;
                        strikethrough = false;
                    } else if (code === '&l') {
                        bold = true;
                    } else if (code === '&o') {
                        italic = true;
                    } else if (code === '&n') {
                        underline = true;
                    } else if (code === '&m') {
                        strikethrough = true;
                    } else if (!['&k'].includes(code)) {
                        currentColor = format.color;
                    }

                    i++;
                    continue;
                }
            }

            currentText += text[i];
        }

        if (currentText) {
            parts.push(
                <span
                    key={parts.length}
                    style={{
                        color: currentColor,
                        fontWeight: bold ? 'bold' : 'normal',
                        fontStyle: italic ? 'italic' : 'normal',
                        textDecoration: [
                            underline ? 'underline' : '',
                            strikethrough ? 'line-through' : '',
                        ]
                            .filter(Boolean)
                            .join(' '),
                    }}
                >
                    {currentText}
                </span>,
            );
        }

        return <>{parts}</>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team Generator" />

            <div className="mx-auto max-w-screen-2xl p-4 sm:p-6">
                <div className="mb-6 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Minecraft Team Generator
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Create and manage Minecraft teams with custom settings
                    </p>
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="create">Create Team</TabsTrigger>
                        <TabsTrigger value="members">
                            Manage Members
                        </TabsTrigger>
                        <TabsTrigger value="modify">Modify Team</TabsTrigger>
                        <TabsTrigger value="remove">Remove Team</TabsTrigger>
                    </TabsList>

                    <TabsContent value="create" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Team Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="team-name">
                                                Team Name (Internal)
                                            </Label>
                                            <Input
                                                id="team-name"
                                                placeholder="myteam"
                                                value={teamConfig.name}
                                                onChange={(e) =>
                                                    updateConfig(
                                                        'name',
                                                        e.target.value.replace(
                                                            /\s/g,
                                                            '',
                                                        ),
                                                    )
                                                }
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                No spaces allowed. Used in
                                                commands.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="display-name">
                                                Display Name (Optional)
                                            </Label>
                                            <Input
                                                id="display-name"
                                                placeholder="My Awesome Team"
                                                value={teamConfig.displayName}
                                                onChange={(e) =>
                                                    updateConfig(
                                                        'displayName',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Team Color</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-8 gap-2">
                                            {teamColors.map((color) => (
                                                <button
                                                    key={color.id}
                                                    type="button"
                                                    onClick={() =>
                                                        updateConfig(
                                                            'color',
                                                            color.id,
                                                        )
                                                    }
                                                    className="group relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105"
                                                    style={{
                                                        backgroundColor:
                                                            color.hex,
                                                        borderColor:
                                                            teamConfig.color ===
                                                            color.id
                                                                ? 'hsl(var(--primary))'
                                                                : 'transparent',
                                                    }}
                                                    title={color.name}
                                                >
                                                    {teamConfig.color ===
                                                        color.id && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                            <Check className="size-5 text-white drop-shadow" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Prefix and Suffix
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="prefix">
                                                Prefix
                                            </Label>
                                            <Input
                                                id="prefix"
                                                placeholder="&c[TEAM] "
                                                value={teamConfig.prefix}
                                                onChange={(e) =>
                                                    updateConfig(
                                                        'prefix',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {teamConfig.prefix.length > 16 && (
                                                <p className="text-sm text-destructive">
                                                    Warning: Prefix is longer
                                                    than 16 characters
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="suffix">
                                                Suffix
                                            </Label>
                                            <Input
                                                id="suffix"
                                                placeholder=""
                                                value={teamConfig.suffix}
                                                onChange={(e) =>
                                                    updateConfig(
                                                        'suffix',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {teamConfig.suffix.length > 16 && (
                                                <p className="text-sm text-destructive">
                                                    Warning: Suffix is longer
                                                    than 16 characters
                                                </p>
                                            )}
                                        </div>

                                        <div className="rounded-lg border bg-muted/50 p-3">
                                            <p className="mb-2 text-sm font-medium">
                                                Formatting Codes
                                            </p>
                                            <div className="grid grid-cols-4 gap-2 text-xs">
                                                {formattingCodes
                                                    .slice(0, 16)
                                                    .map((code) => (
                                                        <div
                                                            key={code.code}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <code className="font-mono">
                                                                {code.code}
                                                            </code>
                                                            <span
                                                                style={{
                                                                    color: code.color,
                                                                }}
                                                            >
                                                                {code.name}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Team Options</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="friendly-fire">
                                                    Friendly Fire
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Allow team members to damage
                                                    each other
                                                </p>
                                            </div>
                                            <Button
                                                id="friendly-fire"
                                                variant={
                                                    teamConfig.friendlyFire
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    updateConfig(
                                                        'friendlyFire',
                                                        !teamConfig.friendlyFire,
                                                    )
                                                }
                                            >
                                                {teamConfig.friendlyFire
                                                    ? 'On'
                                                    : 'Off'}
                                            </Button>
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="see-invisibles">
                                                    See Friendly Invisibles
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Team members can see
                                                    invisible teammates
                                                </p>
                                            </div>
                                            <Button
                                                id="see-invisibles"
                                                variant={
                                                    teamConfig.seeFriendlyInvisibles
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    updateConfig(
                                                        'seeFriendlyInvisibles',
                                                        !teamConfig.seeFriendlyInvisibles,
                                                    )
                                                }
                                            >
                                                {teamConfig.seeFriendlyInvisibles
                                                    ? 'On'
                                                    : 'Off'}
                                            </Button>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <Label htmlFor="nametag-visibility">
                                                Nametag Visibility
                                            </Label>
                                            <Select
                                                value={
                                                    teamConfig.nametagVisibility
                                                }
                                                onValueChange={(value) =>
                                                    updateConfig(
                                                        'nametagVisibility',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger id="nametag-visibility">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="always">
                                                        Always
                                                    </SelectItem>
                                                    <SelectItem value="never">
                                                        Never
                                                    </SelectItem>
                                                    <SelectItem value="hideForOtherTeams">
                                                        Hide for Other Teams
                                                    </SelectItem>
                                                    <SelectItem value="hideForOwnTeam">
                                                        Hide for Own Team
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="death-visibility">
                                                Death Message Visibility
                                            </Label>
                                            <Select
                                                value={
                                                    teamConfig.deathMessageVisibility
                                                }
                                                onValueChange={(value) =>
                                                    updateConfig(
                                                        'deathMessageVisibility',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger id="death-visibility">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="always">
                                                        Always
                                                    </SelectItem>
                                                    <SelectItem value="never">
                                                        Never
                                                    </SelectItem>
                                                    <SelectItem value="hideForOtherTeams">
                                                        Hide for Other Teams
                                                    </SelectItem>
                                                    <SelectItem value="hideForOwnTeam">
                                                        Hide for Own Team
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="collision-rule">
                                                Collision Rule
                                            </Label>
                                            <Select
                                                value={teamConfig.collisionRule}
                                                onValueChange={(value) =>
                                                    updateConfig(
                                                        'collisionRule',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger id="collision-rule">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="always">
                                                        Always
                                                    </SelectItem>
                                                    <SelectItem value="never">
                                                        Never
                                                    </SelectItem>
                                                    <SelectItem value="pushOtherTeams">
                                                        Push Other Teams
                                                    </SelectItem>
                                                    <SelectItem value="pushOwnTeam">
                                                        Push Own Team
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Preview</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="rounded-lg border bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-900 dark:to-slate-800">
                                            <div className="font-mono text-lg">
                                                {teamConfig.prefix &&
                                                    parseFormattedText(
                                                        teamConfig.prefix,
                                                    )}
                                                {renderColorPreview(
                                                    teamConfig.displayName ||
                                                        teamConfig.name ||
                                                        'TeamName',
                                                    teamConfig.color,
                                                )}
                                                {teamConfig.suffix &&
                                                    parseFormattedText(
                                                        teamConfig.suffix,
                                                    )}
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <p className="text-muted-foreground">
                                                Team Settings:
                                            </p>
                                            <ul className="space-y-1 text-muted-foreground">
                                                <li>
                                                    Friendly Fire:{' '}
                                                    {teamConfig.friendlyFire
                                                        ? 'On'
                                                        : 'Off'}
                                                </li>
                                                <li>
                                                    See Invisibles:{' '}
                                                    {teamConfig.seeFriendlyInvisibles
                                                        ? 'On'
                                                        : 'Off'}
                                                </li>
                                                <li>
                                                    Collision:{' '}
                                                    {teamConfig.collisionRule}
                                                </li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Commands</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="max-h-64 overflow-y-auto rounded-lg border bg-muted/50 p-3">
                                            <code className="block whitespace-pre-wrap break-all font-mono text-xs">
                                                {generateCreateCommands().join(
                                                    '\n',
                                                )}
                                            </code>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() =>
                                                    copyCommands(
                                                        generateCreateCommands(),
                                                    )
                                                }
                                                className="flex-1"
                                                disabled={
                                                    copied ||
                                                    !teamConfig.name
                                                }
                                            >
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
                                                onClick={reset}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                <RotateCcw className="mr-2 size-4" />
                                                Reset
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Presets</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {teamPresets.map((preset) => (
                                            <div key={preset.id}>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start"
                                                    onClick={() =>
                                                        applyPreset(preset)
                                                    }
                                                >
                                                    <div className="text-left">
                                                        <div className="font-medium">
                                                            {preset.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {preset.description}
                                                        </div>
                                                    </div>
                                                </Button>
                                                {preset.teams.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="mt-1 w-full"
                                                        onClick={() =>
                                                            copyCommands(
                                                                generatePresetCommands(
                                                                    preset,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <Copy className="mr-2 size-3" />
                                                        Copy All Commands
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="members" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Team Members</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="members-team">
                                        Team Name
                                    </Label>
                                    <Input
                                        id="members-team"
                                        placeholder="myteam"
                                        value={manageMembersTeam}
                                        onChange={(e) =>
                                            setManageMembersTeam(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="member-action">
                                        Action
                                    </Label>
                                    <Select
                                        value={memberAction}
                                        onValueChange={(value) =>
                                            setMemberAction(
                                                value as
                                                    | 'add'
                                                    | 'remove'
                                                    | 'empty'
                                                    | 'list',
                                            )
                                        }
                                    >
                                        <SelectTrigger id="member-action">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="add">
                                                Add Player to Team
                                            </SelectItem>
                                            <SelectItem value="remove">
                                                Remove Player from Team
                                            </SelectItem>
                                            <SelectItem value="empty">
                                                Empty Team (Remove All)
                                            </SelectItem>
                                            <SelectItem value="list">
                                                List Team Members
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {(memberAction === 'add' ||
                                    memberAction === 'remove') && (
                                    <div className="space-y-2">
                                        <Label htmlFor="player-name">
                                            Player Name or Selector
                                        </Label>
                                        <Input
                                            id="player-name"
                                            placeholder="Player or @a, @p, @r, @e"
                                            value={playerName}
                                            onChange={(e) =>
                                                setPlayerName(e.target.value)
                                            }
                                        />
                                    </div>
                                )}

                                <div className="rounded-lg border bg-muted/50 p-3">
                                    <code className="block break-all font-mono text-xs">
                                        {generateManageMembersCommand()}
                                    </code>
                                </div>

                                <Button
                                    onClick={() =>
                                        copyCommands([
                                            generateManageMembersCommand(),
                                        ])
                                    }
                                    className="w-full"
                                    disabled={copied || !manageMembersTeam}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-2 size-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 size-4" />
                                            Copy Command
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="modify" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Modify Team Properties</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="modify-team">
                                        Team Name
                                    </Label>
                                    <Input
                                        id="modify-team"
                                        placeholder="myteam"
                                        value={modifyTeam}
                                        onChange={(e) =>
                                            setModifyTeam(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="modify-property">
                                        Property
                                    </Label>
                                    <Select
                                        value={modifyProperty}
                                        onValueChange={setModifyProperty}
                                    >
                                        <SelectTrigger id="modify-property">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="color">
                                                Color
                                            </SelectItem>
                                            <SelectItem value="displayName">
                                                Display Name
                                            </SelectItem>
                                            <SelectItem value="prefix">
                                                Prefix
                                            </SelectItem>
                                            <SelectItem value="suffix">
                                                Suffix
                                            </SelectItem>
                                            <SelectItem value="friendlyFire">
                                                Friendly Fire
                                            </SelectItem>
                                            <SelectItem value="seeFriendlyInvisibles">
                                                See Friendly Invisibles
                                            </SelectItem>
                                            <SelectItem value="nametagVisibility">
                                                Nametag Visibility
                                            </SelectItem>
                                            <SelectItem value="deathMessageVisibility">
                                                Death Message Visibility
                                            </SelectItem>
                                            <SelectItem value="collisionRule">
                                                Collision Rule
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="modify-value">
                                        New Value
                                    </Label>
                                    <Input
                                        id="modify-value"
                                        placeholder={
                                            modifyProperty === 'color'
                                                ? 'red, blue, green, etc.'
                                                : modifyProperty ===
                                                      'friendlyFire' ||
                                                    modifyProperty ===
                                                      'seeFriendlyInvisibles'
                                                  ? 'true or false'
                                                  : 'Enter value'
                                        }
                                        value={modifyValue}
                                        onChange={(e) =>
                                            setModifyValue(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="rounded-lg border bg-muted/50 p-3">
                                    <code className="block break-all font-mono text-xs">
                                        {generateModifyCommand()}
                                    </code>
                                </div>

                                <Button
                                    onClick={() =>
                                        copyCommands([generateModifyCommand()])
                                    }
                                    className="w-full"
                                    disabled={
                                        copied || !modifyTeam || !modifyValue
                                    }
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-2 size-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 size-4" />
                                            Copy Command
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="remove" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Remove Team</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="remove-team">
                                        Team Name
                                    </Label>
                                    <Input
                                        id="remove-team"
                                        placeholder="myteam"
                                        value={removeTeam}
                                        onChange={(e) =>
                                            setRemoveTeam(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="rounded-lg border bg-muted/50 p-3">
                                    <code className="block break-all font-mono text-xs">
                                        {generateRemoveCommand()}
                                    </code>
                                </div>

                                <Button
                                    onClick={() =>
                                        copyCommands([generateRemoveCommand()])
                                    }
                                    className="w-full"
                                    disabled={copied || !removeTeam}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-2 size-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 size-4" />
                                            Copy Command
                                        </>
                                    )}
                                </Button>

                                <div className="rounded-lg border border-muted bg-muted/30 p-4">
                                    <p className="text-sm font-medium">
                                        List All Teams
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Use this command to see all teams:
                                    </p>
                                    <code className="mt-2 block font-mono text-sm">
                                        /team list
                                    </code>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
