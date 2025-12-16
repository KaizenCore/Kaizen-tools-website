import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { OutputPanel, ToolLayout } from '@/components/tool-layout';
import { CheckIcon, CopyIcon, TrashIcon } from 'lucide-react';
import {
    criteriaCategories,
    displaySlots,
    renderTypes,
    numberFormats,
    minecraftColors,
    operations,
} from '@/data/scoreboard-data';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '/tools',
    },
    {
        title: 'Scoreboard Generator',
        href: '/scoreboard-generator',
    },
];

type CommandType = 'objective' | 'player' | 'display';
type ObjectiveAction = 'add' | 'remove' | 'modify' | 'list' | 'setdisplay';
type PlayerAction = 'set' | 'add' | 'remove' | 'reset' | 'get' | 'enable' | 'operation';
type DisplayAction = 'setdisplay' | 'numberformat';

export default function ScoreboardGenerator() {
    const [activeTab, setActiveTab] = useState<CommandType>('objective');
    const [generatedCommand, setGeneratedCommand] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const [objectiveName, setObjectiveName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [selectedCriteria, setSelectedCriteria] = useState('');
    const [criteriaSearch, setCriteriaSearch] = useState('');
    const [objectiveAction, setObjectiveAction] = useState<ObjectiveAction>('add');
    const [selectedRenderType, setSelectedRenderType] = useState('integer');
    const [selectedDisplaySlot, setSelectedDisplaySlot] = useState('sidebar');

    const [playerName, setPlayerName] = useState('');
    const [playerObjective, setPlayerObjective] = useState('');
    const [scoreValue, setScoreValue] = useState('');
    const [playerAction, setPlayerAction] = useState<PlayerAction>('set');
    const [selectedOperation, setSelectedOperation] = useState('+=');
    const [sourcePlayer, setSourcePlayer] = useState('');
    const [sourceObjective, setSourceObjective] = useState('');

    const [numberFormatType, setNumberFormatType] = useState('blank');
    const [numberFormatColor, setNumberFormatColor] = useState('white');
    const [numberFormatText, setNumberFormatText] = useState('');

    const filteredCriteria = Object.entries(criteriaCategories).reduce(
        (acc, [key, category]) => {
            const filtered = category.criteria.filter(
                (c) =>
                    c.label.toLowerCase().includes(criteriaSearch.toLowerCase()) ||
                    c.value.toLowerCase().includes(criteriaSearch.toLowerCase()) ||
                    c.description.toLowerCase().includes(criteriaSearch.toLowerCase())
            );
            if (filtered.length > 0) {
                acc[key] = { ...category, criteria: filtered };
            }
            return acc;
        },
        {} as typeof criteriaCategories
    );

    const generateCommand = () => {
        let command = '/scoreboard ';

        if (activeTab === 'objective') {
            command += 'objectives ';
            switch (objectiveAction) {
                case 'add':
                    if (!objectiveName || !selectedCriteria) {
                        setGeneratedCommand('Please provide objective name and criteria');
                        return;
                    }
                    command += `add ${objectiveName} ${selectedCriteria}`;
                    if (displayName) {
                        command += ` "${displayName}"`;
                    }
                    break;
                case 'remove':
                    if (!objectiveName) {
                        setGeneratedCommand('Please provide objective name');
                        return;
                    }
                    command += `remove ${objectiveName}`;
                    break;
                case 'modify':
                    if (!objectiveName) {
                        setGeneratedCommand('Please provide objective name');
                        return;
                    }
                    command += `modify ${objectiveName} `;
                    if (displayName) {
                        command += `displayname "${displayName}"`;
                    } else {
                        command += `rendertype ${selectedRenderType}`;
                    }
                    break;
                case 'list':
                    command += 'list';
                    break;
                case 'setdisplay':
                    if (!objectiveName) {
                        setGeneratedCommand('Please provide objective name');
                        return;
                    }
                    command += `setdisplay ${selectedDisplaySlot} ${objectiveName}`;
                    break;
            }
        } else if (activeTab === 'player') {
            command += 'players ';
            switch (playerAction) {
                case 'set':
                    if (!playerName || !playerObjective || !scoreValue) {
                        setGeneratedCommand('Please provide player, objective, and value');
                        return;
                    }
                    command += `set ${playerName} ${playerObjective} ${scoreValue}`;
                    break;
                case 'add':
                    if (!playerName || !playerObjective || !scoreValue) {
                        setGeneratedCommand('Please provide player, objective, and value');
                        return;
                    }
                    command += `add ${playerName} ${playerObjective} ${scoreValue}`;
                    break;
                case 'remove':
                    if (!playerName || !playerObjective || !scoreValue) {
                        setGeneratedCommand('Please provide player, objective, and value');
                        return;
                    }
                    command += `remove ${playerName} ${playerObjective} ${scoreValue}`;
                    break;
                case 'reset':
                    if (!playerName) {
                        setGeneratedCommand('Please provide player name');
                        return;
                    }
                    command += `reset ${playerName}`;
                    if (playerObjective) {
                        command += ` ${playerObjective}`;
                    }
                    break;
                case 'get':
                    if (!playerName || !playerObjective) {
                        setGeneratedCommand('Please provide player and objective');
                        return;
                    }
                    command += `get ${playerName} ${playerObjective}`;
                    break;
                case 'enable':
                    if (!playerName || !playerObjective) {
                        setGeneratedCommand('Please provide player and objective');
                        return;
                    }
                    command += `enable ${playerName} ${playerObjective}`;
                    break;
                case 'operation':
                    if (!playerName || !playerObjective || !sourcePlayer || !sourceObjective) {
                        setGeneratedCommand('Please provide all operation parameters');
                        return;
                    }
                    command += `operation ${playerName} ${playerObjective} ${selectedOperation} ${sourcePlayer} ${sourceObjective}`;
                    break;
            }
        } else if (activeTab === 'display') {
            command += 'objectives ';
            if (!objectiveName) {
                setGeneratedCommand('Please provide objective name');
                return;
            }
            if (numberFormatType === 'blank') {
                command += `modify ${objectiveName} numberformat blank`;
            } else if (numberFormatType === 'fixed') {
                if (!numberFormatText) {
                    setGeneratedCommand('Please provide fixed text');
                    return;
                }
                command += `modify ${objectiveName} numberformat fixed "${numberFormatText}"`;
            } else if (numberFormatType === 'styled') {
                command += `modify ${objectiveName} numberformat styled {"color":"${numberFormatColor}"}`;
            }
        }

        setGeneratedCommand(command);
    };

    const copyCommand = async () => {
        try {
            await navigator.clipboard.writeText(generatedCommand);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const addToHistory = () => {
        if (generatedCommand && !generatedCommand.startsWith('Please provide')) {
            setCommandHistory([...commandHistory, generatedCommand]);
        }
    };

    const clearHistory = () => {
        setCommandHistory([]);
    };

    const removeFromHistory = (index: number) => {
        setCommandHistory(commandHistory.filter((_, i) => i !== index));
    };

    const copyAllCommands = async () => {
        try {
            await navigator.clipboard.writeText(commandHistory.join('\n'));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const sidebar = (
        <>
            <OutputPanel
                title="Generated Command"
                actions={
                    <Button onClick={copyCommand} variant="ghost" size="sm" disabled={copied}>
                        {copied ? (
                            <>
                                <CheckIcon className="mr-1 size-3" />
                                Copied
                            </>
                        ) : (
                            <>
                                <CopyIcon className="mr-1 size-3" />
                                Copy
                            </>
                        )}
                    </Button>
                }
            >
                <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                    <code className="block break-all font-mono text-xs">
                        {generatedCommand || 'Configure command above to generate...'}
                    </code>
                </div>
                {generatedCommand && (
                    <Button onClick={addToHistory} variant="outline" className="w-full">
                        Add to History
                    </Button>
                )}
            </OutputPanel>

            {commandHistory.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Command History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="max-h-64 space-y-2 overflow-y-auto">
                            {commandHistory.map((cmd, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border bg-muted/30 p-2 font-mono text-xs break-all"
                                >
                                    {cmd}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={copyAllCommands} variant="outline" className="flex-1">
                                <CopyIcon className="mr-2 size-4" />
                                Copy All
                            </Button>
                            <Button onClick={clearHistory} variant="outline" className="flex-1">
                                <TrashIcon className="mr-2 size-4" />
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scoreboard Generator" />
            <ToolLayout
                title="Minecraft Scoreboard Generator"
                description="Generate scoreboard commands for Minecraft with an easy-to-use interface"
                sidebar={sidebar}
            >
                    <Card>
                        <CardHeader>
                            <CardTitle>Command Builder</CardTitle>
                            <CardDescription>Configure your scoreboard command</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6">
                            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CommandType)}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="objective">Objectives</TabsTrigger>
                                    <TabsTrigger value="player">Players</TabsTrigger>
                                    <TabsTrigger value="display">Display</TabsTrigger>
                                </TabsList>

                                <TabsContent value="objective" className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="objective-action">Action</Label>
                                        <Select value={objectiveAction} onValueChange={(v) => setObjectiveAction(v as ObjectiveAction)}>
                                            <SelectTrigger id="objective-action">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="add">Create Objective</SelectItem>
                                                <SelectItem value="remove">Remove Objective</SelectItem>
                                                <SelectItem value="modify">Modify Objective</SelectItem>
                                                <SelectItem value="list">List Objectives</SelectItem>
                                                <SelectItem value="setdisplay">Set Display Slot</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {objectiveAction !== 'list' && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="objective-name">Objective Name</Label>
                                            <Input
                                                id="objective-name"
                                                placeholder="myObjective"
                                                value={objectiveName}
                                                onChange={(e) => setObjectiveName(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {objectiveAction === 'add' && (
                                        <>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="criteria-search">Search Criteria</Label>
                                                <Input
                                                    id="criteria-search"
                                                    placeholder="Search..."
                                                    value={criteriaSearch}
                                                    onChange={(e) => setCriteriaSearch(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="criteria">Criteria</Label>
                                                <Select value={selectedCriteria} onValueChange={setSelectedCriteria}>
                                                    <SelectTrigger id="criteria">
                                                        <SelectValue placeholder="Select criteria..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(filteredCriteria).map(([key, category]) => (
                                                            <SelectGroup key={key}>
                                                                <SelectLabel>{category.name}</SelectLabel>
                                                                {category.criteria.map((criterion) => (
                                                                    <SelectItem key={criterion.value} value={criterion.value}>
                                                                        {criterion.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    )}

                                    {(objectiveAction === 'add' || objectiveAction === 'modify') && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="display-name">Display Name (Optional)</Label>
                                            <Input
                                                id="display-name"
                                                placeholder="My Objective"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {objectiveAction === 'modify' && !displayName && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="render-type">Render Type</Label>
                                            <Select value={selectedRenderType} onValueChange={setSelectedRenderType}>
                                                <SelectTrigger id="render-type">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {renderTypes.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {objectiveAction === 'setdisplay' && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="display-slot">Display Slot</Label>
                                            <Select value={selectedDisplaySlot} onValueChange={setSelectedDisplaySlot}>
                                                <SelectTrigger id="display-slot">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {displaySlots.map((slot) => (
                                                        <SelectItem key={slot.value} value={slot.value}>
                                                            {slot.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="player" className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="player-action">Action</Label>
                                        <Select value={playerAction} onValueChange={(v) => setPlayerAction(v as PlayerAction)}>
                                            <SelectTrigger id="player-action">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="set">Set Score</SelectItem>
                                                <SelectItem value="add">Add to Score</SelectItem>
                                                <SelectItem value="remove">Remove from Score</SelectItem>
                                                <SelectItem value="reset">Reset Score</SelectItem>
                                                <SelectItem value="get">Get Score</SelectItem>
                                                <SelectItem value="enable">Enable Trigger</SelectItem>
                                                <SelectItem value="operation">Operation</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="player-name">Player/Selector</Label>
                                        <Input
                                            id="player-name"
                                            placeholder="@p, @a, or player name"
                                            value={playerName}
                                            onChange={(e) => setPlayerName(e.target.value)}
                                        />
                                    </div>

                                    {playerAction !== 'reset' && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="player-objective">Objective</Label>
                                            <Input
                                                id="player-objective"
                                                placeholder="myObjective"
                                                value={playerObjective}
                                                onChange={(e) => setPlayerObjective(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {(playerAction === 'set' || playerAction === 'add' || playerAction === 'remove') && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="score-value">Value</Label>
                                            <Input
                                                id="score-value"
                                                type="number"
                                                placeholder="0"
                                                value={scoreValue}
                                                onChange={(e) => setScoreValue(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {playerAction === 'operation' && (
                                        <>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="operation">Operation</Label>
                                                <Select value={selectedOperation} onValueChange={setSelectedOperation}>
                                                    <SelectTrigger id="operation">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {operations.map((op) => (
                                                            <SelectItem key={op.value} value={op.value}>
                                                                {op.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="source-player">Source Player/Selector</Label>
                                                <Input
                                                    id="source-player"
                                                    placeholder="@p, @a, or player name"
                                                    value={sourcePlayer}
                                                    onChange={(e) => setSourcePlayer(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="source-objective">Source Objective</Label>
                                                <Input
                                                    id="source-objective"
                                                    placeholder="sourceObjective"
                                                    value={sourceObjective}
                                                    onChange={(e) => setSourceObjective(e.target.value)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {playerAction === 'reset' && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="reset-objective">Objective (Optional)</Label>
                                            <Input
                                                id="reset-objective"
                                                placeholder="Leave empty to reset all"
                                                value={playerObjective}
                                                onChange={(e) => setPlayerObjective(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="display" className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="display-objective">Objective Name</Label>
                                        <Input
                                            id="display-objective"
                                            placeholder="myObjective"
                                            value={objectiveName}
                                            onChange={(e) => setObjectiveName(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="number-format">Number Format</Label>
                                        <Select value={numberFormatType} onValueChange={setNumberFormatType}>
                                            <SelectTrigger id="number-format">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {numberFormats.map((format) => (
                                                    <SelectItem key={format.value} value={format.value}>
                                                        {format.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {numberFormatType === 'styled' && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="format-color">Color</Label>
                                            <Select value={numberFormatColor} onValueChange={setNumberFormatColor}>
                                                <SelectTrigger id="format-color">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {minecraftColors.map((color) => (
                                                        <SelectItem key={color.value} value={color.value}>
                                                            <span className="flex items-center gap-2">
                                                                <span
                                                                    className="size-4 rounded border"
                                                                    style={{ backgroundColor: color.hex }}
                                                                />
                                                                {color.label}
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {numberFormatType === 'fixed' && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="format-text">Fixed Text</Label>
                                            <Input
                                                id="format-text"
                                                placeholder="Enter text..."
                                                value={numberFormatText}
                                                onChange={(e) => setNumberFormatText(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>

                            <Button onClick={generateCommand} className="w-full">
                                Generate Command
                            </Button>
                        </CardContent>
                    </Card>
            </ToolLayout>
        </AppLayout>
    );
}
