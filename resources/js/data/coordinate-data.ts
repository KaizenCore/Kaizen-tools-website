export const CHUNK_SIZE = 16;
export const REGION_SIZE = 32; // 32 chunks
export const BLOCKS_PER_REGION = REGION_SIZE * CHUNK_SIZE; // 512 blocks
export const SPAWN_CHUNK_RADIUS = 10; // 10 chunks in each direction from spawn
export const SPAWN_CHUNK_SIZE = (SPAWN_CHUNK_RADIUS * 2 + 1) * CHUNK_SIZE; // 336 blocks

export interface ChunkCoordinates {
    chunkX: number;
    chunkZ: number;
}

export interface RegionCoordinates {
    regionX: number;
    regionZ: number;
    fileName: string;
}

export interface BlockInChunk {
    offsetX: number;
    offsetZ: number;
}

export interface SlimeChunkResult {
    isSlimeChunk: boolean;
    seed: number;
}

export interface StructureGridInfo {
    name: string;
    spacing: number;
    separation: number;
    description: string;
}

export const STRUCTURE_GRIDS: StructureGridInfo[] = [
    {
        name: 'Village',
        spacing: 32,
        separation: 8,
        description: 'Villages generate on a 32-chunk grid with minimum 8-chunk separation',
    },
    {
        name: 'Ocean Monument',
        spacing: 32,
        separation: 5,
        description: 'Ocean monuments generate on a 32-chunk grid with minimum 5-chunk separation',
    },
    {
        name: 'Woodland Mansion',
        spacing: 80,
        separation: 20,
        description: 'Woodland mansions generate on an 80-chunk grid with minimum 20-chunk separation',
    },
    {
        name: 'Stronghold',
        spacing: 0,
        separation: 0,
        description: 'Strongholds use a ring-based generation system, not a grid',
    },
];

export function blockToChunk(blockCoord: number): number {
    return Math.floor(blockCoord / CHUNK_SIZE);
}

export function chunkToBlock(chunkCoord: number): number {
    return chunkCoord * CHUNK_SIZE;
}

export function chunkToRegion(chunkCoord: number): number {
    return Math.floor(chunkCoord / REGION_SIZE);
}

export function blockToRegion(blockCoord: number): number {
    return Math.floor(blockCoord / BLOCKS_PER_REGION);
}

export function getBlockInChunk(blockCoord: number): number {
    const mod = blockCoord % CHUNK_SIZE;
    return mod < 0 ? mod + CHUNK_SIZE : mod;
}

export function getChunkInRegion(chunkCoord: number): number {
    const mod = chunkCoord % REGION_SIZE;
    return mod < 0 ? mod + REGION_SIZE : mod;
}

export function getChunkCoordinates(x: number, z: number): ChunkCoordinates {
    return {
        chunkX: blockToChunk(x),
        chunkZ: blockToChunk(z),
    };
}

export function getRegionCoordinates(x: number, z: number): RegionCoordinates {
    const chunkX = blockToChunk(x);
    const chunkZ = blockToChunk(z);
    const regionX = chunkToRegion(chunkX);
    const regionZ = chunkToRegion(chunkZ);

    return {
        regionX,
        regionZ,
        fileName: `r.${regionX}.${regionZ}.mca`,
    };
}

export function getBlockInChunkCoordinates(x: number, z: number): BlockInChunk {
    return {
        offsetX: getBlockInChunk(x),
        offsetZ: getBlockInChunk(z),
    };
}

export function getChunkBlockRange(chunkX: number, chunkZ: number): {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
} {
    const minX = chunkToBlock(chunkX);
    const minZ = chunkToBlock(chunkZ);
    const maxX = minX + CHUNK_SIZE - 1;
    const maxZ = minZ + CHUNK_SIZE - 1;

    return { minX, maxX, minZ, maxZ };
}

export function isInSpawnChunks(
    blockX: number,
    blockZ: number,
    spawnX: number,
    spawnZ: number
): boolean {
    const chunkX = blockToChunk(blockX);
    const chunkZ = blockToChunk(blockZ);
    const spawnChunkX = blockToChunk(spawnX);
    const spawnChunkZ = blockToChunk(spawnZ);

    const deltaX = Math.abs(chunkX - spawnChunkX);
    const deltaZ = Math.abs(chunkZ - spawnChunkZ);

    return deltaX <= SPAWN_CHUNK_RADIUS && deltaZ <= SPAWN_CHUNK_RADIUS;
}

export function isSlimeChunk(chunkX: number, chunkZ: number, seed: number): boolean {
    // Java Random implementation for slime chunk calculation
    // This matches Minecraft's slime chunk algorithm
    const seedValue =
        seed +
        Number(
            BigInt(chunkX) * BigInt(chunkX) * BigInt(0x4c1906) +
                BigInt(chunkX) * BigInt(0x5ac0db) +
                BigInt(chunkZ) * BigInt(chunkZ) * BigInt(0x4307a7) +
                BigInt(chunkZ) * BigInt(0x5f24f) +
                BigInt(0x3ad8025f)
        );

    // Java-like random
    const random = (seedValue ^ 0x5deece66d) & ((1 << 48) - 1);
    const nextInt = (random * 0x5deece66d + 0xb) & ((1 << 48) - 1);
    const result = Number((nextInt >> 17) % BigInt(10));

    return result === 0;
}

export function formatCoordinates(x: number | string, y: number | string, z: number | string): string {
    return `${x} ${y} ${z}`;
}
