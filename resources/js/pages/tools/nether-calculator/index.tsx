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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeftRight,
    CheckCircle2,
    Copy,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Nether Portal Calculator',
        href: '/tools/nether-calculator',
    },
];

interface Coordinates {
    x: string;
    y: string;
    z: string;
}

export default function NetherCalculator() {
    const [overworldCoords, setOverworldCoords] = useState<Coordinates>({
        x: '',
        y: '',
        z: '',
    });
    const [netherCoords, setNetherCoords] = useState<Coordinates>({
        x: '',
        y: '',
        z: '',
    });
    const [copiedMessage, setCopiedMessage] = useState<string>('');

    const handleOverworldChange = (axis: keyof Coordinates, value: string) => {
        if (value !== '' && isNaN(Number(value))) {
            return;
        }

        setOverworldCoords((prev) => ({ ...prev, [axis]: value }));

        if (axis === 'x' || axis === 'z') {
            const numValue = value === '' ? '' : String(Math.floor(Number(value) / 8));
            setNetherCoords((prev) => ({ ...prev, [axis]: numValue }));
        } else {
            setNetherCoords((prev) => ({ ...prev, [axis]: value }));
        }
    };

    const handleNetherChange = (axis: keyof Coordinates, value: string) => {
        if (value !== '' && isNaN(Number(value))) {
            return;
        }

        setNetherCoords((prev) => ({ ...prev, [axis]: value }));

        if (axis === 'x' || axis === 'z') {
            const numValue = value === '' ? '' : String(Number(value) * 8);
            setOverworldCoords((prev) => ({ ...prev, [axis]: numValue }));
        } else {
            setOverworldCoords((prev) => ({ ...prev, [axis]: value }));
        }
    };

    const copyCoordinates = (coords: Coordinates, dimension: string) => {
        const coordString = `${coords.x} ${coords.y} ${coords.z}`;
        navigator.clipboard.writeText(coordString);
        setCopiedMessage(`${dimension} coordinates copied!`);
        setTimeout(() => {
            setCopiedMessage('');
        }, 2000);
    };

    const calculateDistance = () => {
        const x = Number(overworldCoords.x) || 0;
        const z = Number(overworldCoords.z) || 0;
        return Math.sqrt(x * x + z * z).toFixed(2);
    };

    const calculateNetherDistance = () => {
        const x = Number(netherCoords.x) || 0;
        const z = Number(netherCoords.z) || 0;
        return Math.sqrt(x * x + z * z).toFixed(2);
    };

    const checkPortalSync = () => {
        if (!overworldCoords.x || !overworldCoords.z || !netherCoords.x || !netherCoords.z) {
            return null;
        }

        const expectedNetherX = Math.floor(Number(overworldCoords.x) / 8);
        const expectedNetherZ = Math.floor(Number(overworldCoords.z) / 8);
        const actualNetherX = Number(netherCoords.x);
        const actualNetherZ = Number(netherCoords.z);

        const isXSynced = Math.abs(expectedNetherX - actualNetherX) <= 1;
        const isZSynced = Math.abs(expectedNetherZ - actualNetherZ) <= 1;

        return isXSynced && isZSynced;
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const xParam = params.get('x');
        const zParam = params.get('z');

        if (xParam || zParam) {
            if (xParam) {
                handleOverworldChange('x', xParam);
            }
            if (zParam) {
                handleOverworldChange('z', zParam);
            }
        }
    }, []);

    const portalSyncStatus = checkPortalSync();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nether Portal Calculator" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Nether Portal Calculator</h1>
                    <p className="text-muted-foreground">
                        Calculate coordinates between Overworld and Nether dimensions
                    </p>
                </div>

                {copiedMessage && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                        <CheckCircle2 className="size-4" />
                        {copiedMessage}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent dark:border-green-500/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                Overworld Coordinates
                            </CardTitle>
                            <CardDescription>
                                Enter coordinates from the Overworld
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="overworld-x">X</Label>
                                    <Input
                                        id="overworld-x"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="0"
                                        value={overworldCoords.x}
                                        onChange={(e) => {
                                            handleOverworldChange('x', e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="overworld-y">Y</Label>
                                    <Input
                                        id="overworld-y"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="64"
                                        value={overworldCoords.y}
                                        onChange={(e) => {
                                            handleOverworldChange('y', e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="overworld-z">Z</Label>
                                    <Input
                                        id="overworld-z"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="0"
                                        value={overworldCoords.z}
                                        onChange={(e) => {
                                            handleOverworldChange('z', e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    copyCoordinates(overworldCoords, 'Overworld');
                                }}
                                className="border-green-500/30 hover:bg-green-500/10"
                                disabled={!overworldCoords.x && !overworldCoords.y && !overworldCoords.z}
                            >
                                <Copy className="size-4" />
                                Copy Coordinates
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent dark:border-red-500/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                Nether Coordinates
                            </CardTitle>
                            <CardDescription>
                                Enter coordinates from the Nether
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="nether-x">X</Label>
                                    <Input
                                        id="nether-x"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="0"
                                        value={netherCoords.x}
                                        onChange={(e) => {
                                            handleNetherChange('x', e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="nether-y">Y</Label>
                                    <Input
                                        id="nether-y"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="64"
                                        value={netherCoords.y}
                                        onChange={(e) => {
                                            handleNetherChange('y', e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="nether-z">Z</Label>
                                    <Input
                                        id="nether-z"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="0"
                                        value={netherCoords.z}
                                        onChange={(e) => {
                                            handleNetherChange('z', e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    copyCoordinates(netherCoords, 'Nether');
                                }}
                                className="border-red-500/30 hover:bg-red-500/10"
                                disabled={!netherCoords.x && !netherCoords.y && !netherCoords.z}
                            >
                                <Copy className="size-4" />
                                Copy Coordinates
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ArrowLeftRight className="size-5" />
                            Conversion Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2 rounded-lg border p-4">
                                <h3 className="font-semibold text-green-700 dark:text-green-400">
                                    Overworld Distance from Spawn
                                </h3>
                                <p className="text-2xl font-bold">
                                    {calculateDistance()} blocks
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 rounded-lg border p-4">
                                <h3 className="font-semibold text-red-700 dark:text-red-400">
                                    Nether Distance from Spawn
                                </h3>
                                <p className="text-2xl font-bold">
                                    {calculateNetherDistance()} blocks
                                </p>
                            </div>
                        </div>

                        {portalSyncStatus !== null && (
                            <div
                                className={`flex items-start gap-3 rounded-lg border p-4 ${
                                    portalSyncStatus
                                        ? 'border-green-500/20 bg-green-500/10'
                                        : 'border-red-500/20 bg-red-500/10'
                                }`}
                            >
                                {portalSyncStatus ? (
                                    <CheckCircle2 className="size-5 shrink-0 text-green-700 dark:text-green-400" />
                                ) : (
                                    <XCircle className="size-5 shrink-0 text-red-700 dark:text-red-400" />
                                )}
                                <div className="flex flex-col gap-1">
                                    <h3
                                        className={`font-semibold ${
                                            portalSyncStatus
                                                ? 'text-green-700 dark:text-green-400'
                                                : 'text-red-700 dark:text-red-400'
                                        }`}
                                    >
                                        {portalSyncStatus
                                            ? 'Portals are synced'
                                            : 'Portals may not link correctly'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {portalSyncStatus
                                            ? 'These coordinates should create linked portals between dimensions.'
                                            : 'The portals at these coordinates may not link. Adjust coordinates for proper synchronization.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Nether Portal Mechanics</CardTitle>
                        <CardDescription>
                            Understanding how Nether portals work
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">8:1 Ratio</h4>
                                <p className="text-sm text-muted-foreground">
                                    Horizontal distances in the Nether are 8 times shorter
                                    than in the Overworld. X and Z coordinates are divided
                                    by 8 when traveling to the Nether, and multiplied by 8
                                    when returning.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Y Coordinate</h4>
                                <p className="text-sm text-muted-foreground">
                                    The Y coordinate (height) stays the same between
                                    dimensions. However, the Nether has a bedrock ceiling at
                                    Y=128, so portals above this level will spawn at safe
                                    heights below.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Portal Linking</h4>
                                <p className="text-sm text-muted-foreground">
                                    For portals to link correctly, the Nether portal should
                                    be within 128 blocks of the calculated position.
                                    Otherwise, a new portal may be created automatically.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Fast Travel</h4>
                                <p className="text-sm text-muted-foreground">
                                    Building a Nether hub allows you to travel 8 blocks in
                                    the Overworld for every 1 block in the Nether, making it
                                    perfect for long-distance transportation.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
