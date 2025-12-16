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
import { OutputPanel, ToolLayout } from '@/components/tool-layout';
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
    { title: 'Tools', href: '#' },
    { title: 'Nether Portal Calculator', href: '/tools/nether-calculator' },
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
        if (value !== '' && isNaN(Number(value))) return;

        setOverworldCoords((prev) => ({ ...prev, [axis]: value }));

        if (axis === 'x' || axis === 'z') {
            const numValue = value === '' ? '' : String(Math.floor(Number(value) / 8));
            setNetherCoords((prev) => ({ ...prev, [axis]: numValue }));
        } else {
            setNetherCoords((prev) => ({ ...prev, [axis]: value }));
        }
    };

    const handleNetherChange = (axis: keyof Coordinates, value: string) => {
        if (value !== '' && isNaN(Number(value))) return;

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
        setTimeout(() => setCopiedMessage(''), 2000);
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
            if (xParam) handleOverworldChange('x', xParam);
            if (zParam) handleOverworldChange('z', zParam);
        }
    }, []);

    const portalSyncStatus = checkPortalSync();

    const sidebar = (
        <>
            {/* Results Panel */}
            <OutputPanel
                title="Conversion Results"
                actions={
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyCoordinates(overworldCoords, 'Overworld')}
                            disabled={!overworldCoords.x && !overworldCoords.y && !overworldCoords.z}
                        >
                            <Copy className="mr-1 size-3" />
                            OW
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyCoordinates(netherCoords, 'Nether')}
                            disabled={!netherCoords.x && !netherCoords.y && !netherCoords.z}
                        >
                            <Copy className="mr-1 size-3" />
                            Nether
                        </Button>
                    </div>
                }
            >
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <div className="flex flex-col gap-1 rounded-md border border-green-500/20 bg-green-500/5 p-3">
                        <span className="text-xs font-medium text-green-700 dark:text-green-400">
                            Overworld Distance
                        </span>
                        <span className="text-xl font-bold">{calculateDistance()} blocks</span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-md border border-red-500/20 bg-red-500/5 p-3">
                        <span className="text-xs font-medium text-red-700 dark:text-red-400">
                            Nether Distance
                        </span>
                        <span className="text-xl font-bold">{calculateNetherDistance()} blocks</span>
                    </div>
                </div>

                {portalSyncStatus !== null && (
                    <div
                        className={`flex items-start gap-3 rounded-md border p-3 ${
                            portalSyncStatus
                                ? 'border-green-500/20 bg-green-500/5'
                                : 'border-red-500/20 bg-red-500/5'
                        }`}
                    >
                        {portalSyncStatus ? (
                            <CheckCircle2 className="size-5 shrink-0 text-green-700 dark:text-green-400" />
                        ) : (
                            <XCircle className="size-5 shrink-0 text-red-700 dark:text-red-400" />
                        )}
                        <div className="flex flex-col gap-1">
                            <span
                                className={`text-sm font-semibold ${
                                    portalSyncStatus
                                        ? 'text-green-700 dark:text-green-400'
                                        : 'text-red-700 dark:text-red-400'
                                }`}
                            >
                                {portalSyncStatus ? 'Portals synced' : 'May not link'}
                            </span>
                            <p className="text-xs text-muted-foreground">
                                {portalSyncStatus
                                    ? 'These coordinates should link correctly.'
                                    : 'Adjust for proper synchronization.'}
                            </p>
                        </div>
                    </div>
                )}
            </OutputPanel>

            {/* Tips Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                    <div className="flex gap-2">
                        <AlertCircle className="size-4 shrink-0 text-primary" />
                        <p className="text-muted-foreground">
                            <strong className="text-foreground">8:1 Ratio:</strong> 1 block in Nether = 8 blocks in Overworld
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <AlertCircle className="size-4 shrink-0 text-primary" />
                        <p className="text-muted-foreground">
                            <strong className="text-foreground">Y stays same:</strong> Height is not affected by conversion
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <AlertCircle className="size-4 shrink-0 text-primary" />
                        <p className="text-muted-foreground">
                            <strong className="text-foreground">128 block range:</strong> Portals link within this distance
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nether Portal Calculator" />
            <ToolLayout
                title="Nether Portal Calculator"
                description="Calculate coordinates between Overworld and Nether dimensions"
                sidebar={sidebar}
                alerts={
                    copiedMessage && (
                        <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                            <CheckCircle2 className="size-4" />
                            {copiedMessage}
                        </div>
                    )
                }
            >
                {/* Overworld Card */}
                <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent dark:border-green-500/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            Overworld Coordinates
                        </CardTitle>
                        <CardDescription>Enter coordinates from the Overworld</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="overworld-x">X</Label>
                                <Input
                                    id="overworld-x"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={overworldCoords.x}
                                    onChange={(e) => handleOverworldChange('x', e.target.value)}
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
                                    onChange={(e) => handleOverworldChange('y', e.target.value)}
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
                                    onChange={(e) => handleOverworldChange('z', e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Nether Card */}
                <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent dark:border-red-500/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                            Nether Coordinates
                        </CardTitle>
                        <CardDescription>Enter coordinates from the Nether</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="nether-x">X</Label>
                                <Input
                                    id="nether-x"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={netherCoords.x}
                                    onChange={(e) => handleNetherChange('x', e.target.value)}
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
                                    onChange={(e) => handleNetherChange('y', e.target.value)}
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
                                    onChange={(e) => handleNetherChange('z', e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ArrowLeftRight className="size-5" />
                            Portal Mechanics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-primary" />
                            <div>
                                <h4 className="font-semibold">8:1 Ratio</h4>
                                <p className="text-sm text-muted-foreground">
                                    Horizontal distances in the Nether are 8× shorter than Overworld.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-primary" />
                            <div>
                                <h4 className="font-semibold">Y Coordinate</h4>
                                <p className="text-sm text-muted-foreground">
                                    Height stays the same. Nether ceiling is at Y=128.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-primary" />
                            <div>
                                <h4 className="font-semibold">Portal Linking</h4>
                                <p className="text-sm text-muted-foreground">
                                    Portals link within 128 blocks of calculated position.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-primary" />
                            <div>
                                <h4 className="font-semibold">Fast Travel</h4>
                                <p className="text-sm text-muted-foreground">
                                    Build a Nether hub for efficient long-distance travel.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ToolLayout>
        </AppLayout>
    );
}
