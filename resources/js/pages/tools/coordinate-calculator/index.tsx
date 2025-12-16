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
import { ToolLayout } from '@/components/tool-layout';
import {
    CHUNK_SIZE,
    SPAWN_CHUNK_RADIUS,
    blockToChunk,
    chunkToBlock,
    formatCoordinates,
    getBlockInChunk,
    getBlockInChunkCoordinates,
    getChunkBlockRange,
    getChunkCoordinates,
    getRegionCoordinates,
    isInSpawnChunks,
    isSlimeChunk,
} from '@/data/coordinate-data';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Copy,
    Globe,
    Grid3x3,
    Hash,
    MapPin,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Coordinate Calculator',
        href: '/tools/coordinate-calculator',
    },
];

export default function CoordinateCalculator() {
    const [blockX, setBlockX] = useState<string>('');
    const [blockY, setBlockY] = useState<string>('');
    const [blockZ, setBlockZ] = useState<string>('');
    const [worldSpawnX, setWorldSpawnX] = useState<string>('0');
    const [worldSpawnZ, setWorldSpawnZ] = useState<string>('0');
    const [seed, setSeed] = useState<string>('');
    const [chunkX, setChunkX] = useState<string>('');
    const [chunkZ, setChunkZ] = useState<string>('');
    const [copiedMessage, setCopiedMessage] = useState<string>('');

    const handleBlockChange = (axis: 'x' | 'y' | 'z', value: string) => {
        if (value !== '' && value !== '-' && isNaN(Number(value))) {
            return;
        }

        switch (axis) {
            case 'x':
                setBlockX(value);
                break;
            case 'y':
                setBlockY(value);
                break;
            case 'z':
                setBlockZ(value);
                break;
        }
    };

    const handleSpawnChange = (axis: 'x' | 'z', value: string) => {
        if (value !== '' && value !== '-' && isNaN(Number(value))) {
            return;
        }

        if (axis === 'x') {
            setWorldSpawnX(value);
        } else {
            setWorldSpawnZ(value);
        }
    };

    const handleSeedChange = (value: string) => {
        if (value !== '' && value !== '-' && isNaN(Number(value))) {
            return;
        }
        setSeed(value);
    };

    const handleChunkChange = (axis: 'x' | 'z', value: string) => {
        if (value !== '' && value !== '-' && isNaN(Number(value))) {
            return;
        }

        if (axis === 'x') {
            setChunkX(value);
        } else {
            setChunkZ(value);
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedMessage(`${label} copied!`);
        setTimeout(() => {
            setCopiedMessage('');
        }, 2000);
    };

    const hasBlockCoordinates = blockX !== '' || blockZ !== '';
    const hasChunkCoordinates = chunkX !== '' || chunkZ !== '';

    let chunkCoords = null;
    let regionCoords = null;
    let blockInChunk = null;
    let inSpawnChunks = null;
    let slimeChunkInfo = null;

    if (hasBlockCoordinates && blockX !== '' && blockZ !== '') {
        const x = Number(blockX);
        const z = Number(blockZ);

        chunkCoords = getChunkCoordinates(x, z);
        regionCoords = getRegionCoordinates(x, z);
        blockInChunk = getBlockInChunkCoordinates(x, z);

        if (worldSpawnX !== '' && worldSpawnZ !== '') {
            inSpawnChunks = isInSpawnChunks(
                x,
                z,
                Number(worldSpawnX),
                Number(worldSpawnZ)
            );
        }

        if (seed !== '') {
            slimeChunkInfo = {
                isSlimeChunk: isSlimeChunk(chunkCoords.chunkX, chunkCoords.chunkZ, Number(seed)),
                chunkX: chunkCoords.chunkX,
                chunkZ: chunkCoords.chunkZ,
            };
        }
    }

    let reverseBlockRange = null;
    if (hasChunkCoordinates && chunkX !== '' && chunkZ !== '') {
        const x = Number(chunkX);
        const z = Number(chunkZ);
        reverseBlockRange = getChunkBlockRange(x, z);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Coordinate Calculator" />
            <ToolLayout
                title="Coordinate Calculator"
                description="Calculate chunk boundaries, region files, and spawn chunk locations"
                alerts={
                    copiedMessage && (
                        <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                            <CheckCircle2 className="size-4" />
                            {copiedMessage}
                        </div>
                    )
                }
            >

                <Card className="border-[oklch(0.72_0.14_75)]/20 bg-gradient-to-br from-[oklch(0.72_0.14_75)]/5 to-transparent dark:border-[oklch(0.72_0.14_75)]/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="size-5 text-[oklch(0.72_0.14_75)]" />
                            Block Coordinates
                        </CardTitle>
                        <CardDescription>
                            Enter your current block position
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="block-x">X</Label>
                                <Input
                                    id="block-x"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={blockX}
                                    onChange={(e) => {
                                        handleBlockChange('x', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="block-y">Y</Label>
                                <Input
                                    id="block-y"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="64"
                                    value={blockY}
                                    onChange={(e) => {
                                        handleBlockChange('y', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="block-z">Z</Label>
                                <Input
                                    id="block-z"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={blockZ}
                                    onChange={(e) => {
                                        handleBlockChange('z', e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                copyToClipboard(
                                    formatCoordinates(
                                        blockX || '0',
                                        blockY || '64',
                                        blockZ || '0'
                                    ),
                                    'Block coordinates'
                                );
                            }}
                            className="border-[oklch(0.72_0.14_75)]/30 hover:bg-[oklch(0.72_0.14_75)]/10"
                        >
                            <Copy className="size-4" />
                            Copy Coordinates
                        </Button>
                    </CardContent>
                </Card>

                {chunkCoords && (
                    <>
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Grid3x3 className="size-5" />
                                        Chunk Coordinates
                                    </CardTitle>
                                    <CardDescription>
                                        The chunk containing your position
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <span className="text-sm text-muted-foreground">
                                            Chunk X
                                        </span>
                                        <span className="font-mono text-lg font-semibold">
                                            {chunkCoords.chunkX}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <span className="text-sm text-muted-foreground">
                                            Chunk Z
                                        </span>
                                        <span className="font-mono text-lg font-semibold">
                                            {chunkCoords.chunkZ}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            copyToClipboard(
                                                `${chunkCoords.chunkX} ${chunkCoords.chunkZ}`,
                                                'Chunk coordinates'
                                            );
                                        }}
                                        size="sm"
                                    >
                                        <Copy className="size-4" />
                                        Copy
                                    </Button>
                                </CardContent>
                            </Card>

                            {regionCoords && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Globe className="size-5" />
                                            Region File
                                        </CardTitle>
                                        <CardDescription>
                                            The region file containing this chunk
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between rounded-lg border p-3">
                                            <span className="text-sm text-muted-foreground">
                                                Region X
                                            </span>
                                            <span className="font-mono text-lg font-semibold">
                                                {regionCoords.regionX}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border p-3">
                                            <span className="text-sm text-muted-foreground">
                                                Region Z
                                            </span>
                                            <span className="font-mono text-lg font-semibold">
                                                {regionCoords.regionZ}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border p-3">
                                            <span className="text-sm text-muted-foreground">
                                                File Name
                                            </span>
                                            <span className="font-mono text-sm font-semibold">
                                                {regionCoords.fileName}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                copyToClipboard(
                                                    regionCoords.fileName,
                                                    'Region file name'
                                                );
                                            }}
                                            size="sm"
                                        >
                                            <Copy className="size-4" />
                                            Copy Filename
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {blockInChunk && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Hash className="size-5" />
                                        Position Within Chunk
                                    </CardTitle>
                                    <CardDescription>
                                        Your block position relative to the chunk origin
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="flex items-center justify-between rounded-lg border p-3">
                                            <span className="text-sm text-muted-foreground">
                                                Offset X (0-15)
                                            </span>
                                            <span className="font-mono text-lg font-semibold">
                                                {blockInChunk.offsetX}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border p-3">
                                            <span className="text-sm text-muted-foreground">
                                                Offset Z (0-15)
                                            </span>
                                            <span className="font-mono text-lg font-semibold">
                                                {blockInChunk.offsetZ}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border bg-muted/20 p-4">
                                        <div className="grid grid-cols-16 gap-px">
                                            {Array.from({ length: CHUNK_SIZE }).map((_, z) =>
                                                Array.from({ length: CHUNK_SIZE }).map((_, x) => {
                                                    const isCurrentBlock =
                                                        x === blockInChunk.offsetX &&
                                                        z === blockInChunk.offsetZ;
                                                    return (
                                                        <div
                                                            key={`${x}-${z}`}
                                                            className={`aspect-square rounded-sm ${
                                                                isCurrentBlock
                                                                    ? 'bg-[oklch(0.72_0.14_75)] shadow-lg'
                                                                    : 'bg-muted'
                                                            }`}
                                                            title={`${x}, ${z}`}
                                                        />
                                                    );
                                                })
                                            )}
                                        </div>
                                        <p className="mt-3 text-center text-xs text-muted-foreground">
                                            16x16 chunk grid (highlighted block:{' '}
                                            {blockInChunk.offsetX}, {blockInChunk.offsetZ})
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="size-5" />
                            World Spawn Checker
                        </CardTitle>
                        <CardDescription>
                            Check if coordinates are within spawn chunks
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="spawn-x">World Spawn X</Label>
                                <Input
                                    id="spawn-x"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={worldSpawnX}
                                    onChange={(e) => {
                                        handleSpawnChange('x', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="spawn-z">World Spawn Z</Label>
                                <Input
                                    id="spawn-z"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={worldSpawnZ}
                                    onChange={(e) => {
                                        handleSpawnChange('z', e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        {inSpawnChunks !== null && (
                            <div
                                className={`flex items-start gap-3 rounded-lg border p-4 ${
                                    inSpawnChunks
                                        ? 'border-green-500/20 bg-green-500/10'
                                        : 'border-blue-500/20 bg-blue-500/10'
                                }`}
                            >
                                {inSpawnChunks ? (
                                    <CheckCircle2 className="size-5 shrink-0 text-green-700 dark:text-green-400" />
                                ) : (
                                    <Hash className="size-5 shrink-0 text-blue-700 dark:text-blue-400" />
                                )}
                                <div className="flex flex-col gap-1">
                                    <h3
                                        className={`font-semibold ${
                                            inSpawnChunks
                                                ? 'text-green-700 dark:text-green-400'
                                                : 'text-blue-700 dark:text-blue-400'
                                        }`}
                                    >
                                        {inSpawnChunks
                                            ? 'Within Spawn Chunks'
                                            : 'Outside Spawn Chunks'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {inSpawnChunks
                                            ? `This location is within ${SPAWN_CHUNK_RADIUS} chunks of world spawn. Chunks here are always loaded.`
                                            : `This location is outside the ${SPAWN_CHUNK_RADIUS}-chunk spawn area. These chunks will unload when no players are nearby.`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="size-5 text-green-600 dark:text-green-400" />
                            Slime Chunk Checker
                        </CardTitle>
                        <CardDescription>
                            Determine if a chunk can spawn slimes (requires world seed)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="seed">World Seed</Label>
                            <Input
                                id="seed"
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter world seed"
                                value={seed}
                                onChange={(e) => {
                                    handleSeedChange(e.target.value);
                                }}
                            />
                        </div>

                        {slimeChunkInfo && (
                            <div
                                className={`flex items-start gap-3 rounded-lg border p-4 ${
                                    slimeChunkInfo.isSlimeChunk
                                        ? 'border-green-500/20 bg-green-500/10'
                                        : 'border-gray-500/20 bg-gray-500/10'
                                }`}
                            >
                                {slimeChunkInfo.isSlimeChunk ? (
                                    <CheckCircle2 className="size-5 shrink-0 text-green-700 dark:text-green-400" />
                                ) : (
                                    <Hash className="size-5 shrink-0 text-gray-700 dark:text-gray-400" />
                                )}
                                <div className="flex flex-col gap-1">
                                    <h3
                                        className={`font-semibold ${
                                            slimeChunkInfo.isSlimeChunk
                                                ? 'text-green-700 dark:text-green-400'
                                                : 'text-gray-700 dark:text-gray-400'
                                        }`}
                                    >
                                        {slimeChunkInfo.isSlimeChunk
                                            ? 'This is a Slime Chunk!'
                                            : 'Not a Slime Chunk'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {slimeChunkInfo.isSlimeChunk
                                            ? `Chunk (${slimeChunkInfo.chunkX}, ${slimeChunkInfo.chunkZ}) can spawn slimes below Y=40 in any light level.`
                                            : `Chunk (${slimeChunkInfo.chunkX}, ${slimeChunkInfo.chunkZ}) cannot spawn slimes. Try swamp biomes instead.`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Grid3x3 className="size-5" />
                            Reverse Calculator
                        </CardTitle>
                        <CardDescription>
                            Enter chunk coordinates to find block ranges
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="chunk-x">Chunk X</Label>
                                <Input
                                    id="chunk-x"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={chunkX}
                                    onChange={(e) => {
                                        handleChunkChange('x', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="chunk-z">Chunk Z</Label>
                                <Input
                                    id="chunk-z"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={chunkZ}
                                    onChange={(e) => {
                                        handleChunkChange('z', e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        {reverseBlockRange && (
                            <div className="flex flex-col gap-3 rounded-lg border p-4">
                                <h4 className="font-semibold">Block Range</h4>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                        <span className="text-sm text-muted-foreground">
                                            X Range
                                        </span>
                                        <span className="font-mono text-sm font-semibold">
                                            {reverseBlockRange.minX} to {reverseBlockRange.maxX}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                        <span className="text-sm text-muted-foreground">
                                            Z Range
                                        </span>
                                        <span className="font-mono text-sm font-semibold">
                                            {reverseBlockRange.minZ} to {reverseBlockRange.maxZ}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        copyToClipboard(
                                            `X: ${reverseBlockRange.minX} to ${reverseBlockRange.maxX}, Z: ${reverseBlockRange.minZ} to ${reverseBlockRange.maxZ}`,
                                            'Block range'
                                        );
                                    }}
                                    size="sm"
                                >
                                    <Copy className="size-4" />
                                    Copy Range
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Chunk & Region Information</CardTitle>
                        <CardDescription>
                            Understanding Minecraft coordinate systems
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <h4 className="font-semibold">Chunks</h4>
                            <p className="text-sm text-muted-foreground">
                                Chunks are 16x16 block sections that extend vertically through
                                the entire world. World generation, loading, and most game
                                mechanics work on a per-chunk basis.
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h4 className="font-semibold">Regions</h4>
                            <p className="text-sm text-muted-foreground">
                                Region files (*.mca) store 32x32 chunks (512x512 blocks). They
                                are located in the world/region folder and named using region
                                coordinates.
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h4 className="font-semibold">Spawn Chunks</h4>
                            <p className="text-sm text-muted-foreground">
                                A {SPAWN_CHUNK_RADIUS * 2 + 1}x{SPAWN_CHUNK_RADIUS * 2 + 1}{' '}
                                chunk area centered on world spawn that remains loaded at all
                                times. Perfect for farms and redstone contraptions that need to
                                run constantly.
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h4 className="font-semibold">Slime Chunks</h4>
                            <p className="text-sm text-muted-foreground">
                                Specific chunks where slimes can spawn below Y=40 regardless of
                                light level. Determined by the world seed and chunk coordinates
                                using a pseudo-random algorithm.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </ToolLayout>
        </AppLayout>
    );
}
