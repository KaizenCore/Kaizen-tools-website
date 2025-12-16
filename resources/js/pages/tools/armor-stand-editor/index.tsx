import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
    armorStandPresets,
    bodyPartLimits,
    bodyPartNames,
    defaultPose,
    type BodyPartKey,
    type BodyPartRotation,
} from '@/data/armor-stand-data';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Check, Copy, RotateCcw, User } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Armor Stand Editor',
        href: '/tools/armor-stand-editor',
    },
];

interface ArmorStandOptions {
    showArms: boolean;
    noBasePlate: boolean;
    invisible: boolean;
    small: boolean;
    noGravity: boolean;
}

export default function ArmorStandEditor() {
    const [rotations, setRotations] = useState(defaultPose.rotations);
    const [options, setOptions] = useState<ArmorStandOptions>({
        showArms: false,
        noBasePlate: false,
        invisible: false,
        small: false,
        noGravity: false,
    });
    const [copied, setCopied] = useState(false);

    const updateRotation = (part: BodyPartKey, axis: 'x' | 'y' | 'z', value: number) => {
        setRotations((prev) => ({
            ...prev,
            [part]: {
                ...prev[part],
                [axis]: value,
            },
        }));
    };

    const applyPreset = (presetId: string) => {
        const preset = armorStandPresets.find((p) => p.id === presetId);
        if (preset) {
            setRotations(preset.rotations);
        }
    };

    const reset = () => {
        setRotations(defaultPose.rotations);
        setOptions({
            showArms: false,
            noBasePlate: false,
            invisible: false,
            small: false,
            noGravity: false,
        });
    };

    const toggleOption = (option: keyof ArmorStandOptions) => {
        setOptions((prev) => ({
            ...prev,
            [option]: !prev[option],
        }));
    };

    const formatRotation = (rotation: BodyPartRotation): string => {
        return `[${rotation.x}f,${rotation.y}f,${rotation.z}f]`;
    };

    const generateCommand = (): string => {
        const poseData = `{Head:${formatRotation(rotations.head)},Body:${formatRotation(rotations.body)},LeftArm:${formatRotation(rotations.leftArm)},RightArm:${formatRotation(rotations.rightArm)},LeftLeg:${formatRotation(rotations.leftLeg)},RightLeg:${formatRotation(rotations.rightLeg)}}`;

        const optionsArray: string[] = [`Pose:${poseData}`];

        if (options.showArms) {
            optionsArray.push('ShowArms:1b');
        }
        if (options.noBasePlate) {
            optionsArray.push('NoBasePlate:1b');
        }
        if (options.invisible) {
            optionsArray.push('Invisible:1b');
        }
        if (options.small) {
            optionsArray.push('Small:1b');
        }
        if (options.noGravity) {
            optionsArray.push('NoGravity:1b');
        }

        return `/summon minecraft:armor_stand ~ ~ ~ {${optionsArray.join(',')}}`;
    };

    const copyCommand = async () => {
        const command = generateCommand();
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderBodyPartControls = (part: BodyPartKey) => {
        const partRotation = rotations[part];

        return (
            <Card key={part}>
                <CardHeader>
                    <CardTitle className="text-base">{bodyPartNames[part]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(['x', 'y', 'z'] as const).map((axis) => (
                        <div key={axis} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm capitalize">{axis}-axis</Label>
                                <span className="text-sm font-medium tabular-nums">
                                    {partRotation[axis]}°
                                </span>
                            </div>
                            <Slider
                                value={[partRotation[axis]]}
                                onValueChange={(value) => updateRotation(part, axis, value[0])}
                                min={bodyPartLimits.min}
                                max={bodyPartLimits.max}
                                step={1}
                                className="w-full"
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Armor Stand Editor" />

            <div className="mx-auto max-w-screen-2xl p-4 sm:p-6">
                <div className="mb-6 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Minecraft Armor Stand Pose Editor
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Design custom armor stand poses and generate NBT commands
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preset Poses</CardTitle>
                                <CardDescription>
                                    Quick-apply pre-configured poses
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Select onValueChange={applyPreset}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a preset pose..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {armorStandPresets.map((preset) => (
                                            <SelectItem key={preset.id} value={preset.id}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {preset.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {preset.description}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {renderBodyPartControls('head')}
                            {renderBodyPartControls('body')}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {renderBodyPartControls('leftArm')}
                            {renderBodyPartControls('rightArm')}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {renderBodyPartControls('leftLeg')}
                            {renderBodyPartControls('rightLeg')}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>
                                    Simplified representation
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex min-h-64 items-center justify-center rounded-lg border bg-gradient-to-br from-slate-100 to-slate-200 p-8 dark:from-slate-800 dark:to-slate-900">
                                    <div className="relative">
                                        <User className="size-32 text-muted-foreground" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="rounded-lg bg-background/80 px-3 py-2 text-center shadow-sm backdrop-blur-sm">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Interactive preview
                                                </p>
                                                <p className="text-xs text-muted-foreground/70">
                                                    coming soon
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Armor Stand Options</CardTitle>
                                <CardDescription>
                                    Additional properties and settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3 rounded-lg border p-4">
                                    <Checkbox
                                        id="show-arms"
                                        checked={options.showArms}
                                        onCheckedChange={() => toggleOption('showArms')}
                                    />
                                    <Label
                                        htmlFor="show-arms"
                                        className="flex-1 cursor-pointer font-medium"
                                    >
                                        Show Arms
                                        <span className="block text-xs font-normal text-muted-foreground">
                                            Display armor stand arms
                                        </span>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-3 rounded-lg border p-4">
                                    <Checkbox
                                        id="no-base-plate"
                                        checked={options.noBasePlate}
                                        onCheckedChange={() => toggleOption('noBasePlate')}
                                    />
                                    <Label
                                        htmlFor="no-base-plate"
                                        className="flex-1 cursor-pointer font-medium"
                                    >
                                        No Base Plate
                                        <span className="block text-xs font-normal text-muted-foreground">
                                            Remove the bottom base plate
                                        </span>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-3 rounded-lg border p-4">
                                    <Checkbox
                                        id="invisible"
                                        checked={options.invisible}
                                        onCheckedChange={() => toggleOption('invisible')}
                                    />
                                    <Label
                                        htmlFor="invisible"
                                        className="flex-1 cursor-pointer font-medium"
                                    >
                                        Invisible
                                        <span className="block text-xs font-normal text-muted-foreground">
                                            Make armor stand invisible
                                        </span>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-3 rounded-lg border p-4">
                                    <Checkbox
                                        id="small"
                                        checked={options.small}
                                        onCheckedChange={() => toggleOption('small')}
                                    />
                                    <Label
                                        htmlFor="small"
                                        className="flex-1 cursor-pointer font-medium"
                                    >
                                        Small
                                        <span className="block text-xs font-normal text-muted-foreground">
                                            Create a small armor stand
                                        </span>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-3 rounded-lg border p-4">
                                    <Checkbox
                                        id="no-gravity"
                                        checked={options.noGravity}
                                        onCheckedChange={() => toggleOption('noGravity')}
                                    />
                                    <Label
                                        htmlFor="no-gravity"
                                        className="flex-1 cursor-pointer font-medium"
                                    >
                                        No Gravity
                                        <span className="block text-xs font-normal text-muted-foreground">
                                            Armor stand floats in place
                                        </span>
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Generated Command</CardTitle>
                                <CardDescription>
                                    Copy and paste into Minecraft
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="overflow-x-auto rounded-lg border bg-muted/50 p-3">
                                    <code className="block break-all font-mono text-xs">
                                        {generateCommand()}
                                    </code>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={copyCommand}
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
                                                Copy Command
                                            </>
                                        )}
                                    </Button>
                                    <Button onClick={reset} variant="outline" className="flex-1">
                                        <RotateCcw className="mr-2 size-4" />
                                        Reset All
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>How to Use</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div>
                                    <strong className="text-foreground">1. Choose a preset</strong>
                                    <p>
                                        Start with a pre-configured pose or use the default position.
                                    </p>
                                </div>
                                <div className="border-t pt-3">
                                    <strong className="text-foreground">
                                        2. Adjust body parts
                                    </strong>
                                    <p>
                                        Use the sliders to rotate each body part on the X, Y, and Z
                                        axes. Each axis accepts values from -180° to 180°.
                                    </p>
                                </div>
                                <div className="border-t pt-3">
                                    <strong className="text-foreground">
                                        3. Configure options
                                    </strong>
                                    <p>
                                        Enable special properties like arms, invisibility, size, and
                                        more.
                                    </p>
                                </div>
                                <div className="border-t pt-3">
                                    <strong className="text-foreground">
                                        4. Copy and summon
                                    </strong>
                                    <p>
                                        Copy the generated command and paste it into your Minecraft
                                        chat. The armor stand will spawn at your location with your
                                        custom pose.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent dark:border-amber-500/30">
                            <CardHeader>
                                <CardTitle className="text-amber-700 dark:text-amber-400">
                                    Understanding Rotation Axes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div>
                                    <strong className="text-foreground">X-axis (Pitch)</strong>
                                    <p>
                                        Rotates the body part forward and backward. Positive values
                                        tilt forward, negative values tilt backward.
                                    </p>
                                </div>
                                <div className="border-t pt-3">
                                    <strong className="text-foreground">Y-axis (Yaw)</strong>
                                    <p>
                                        Rotates the body part left and right. Positive values turn
                                        left, negative values turn right.
                                    </p>
                                </div>
                                <div className="border-t pt-3">
                                    <strong className="text-foreground">Z-axis (Roll)</strong>
                                    <p>
                                        Rotates the body part clockwise and counter-clockwise. Positive
                                        values rotate clockwise, negative counter-clockwise.
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
