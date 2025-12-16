export interface MobData {
    id: string;
    name: string;
    category: 'hostile' | 'passive' | 'neutral' | 'water' | 'ambient';
    maxLightLevel: number | null;
    minLightLevel: number | null;
    biomes: string[];
    dimensions: ('overworld' | 'nether' | 'end')[];
    spawnBlocks: string[];
    additionalConditions: string[];
    spawnWeight?: number;
}

export interface LightSource {
    name: string;
    lightLevel: number;
    category: string;
}

export interface MobCapConstants {
    hostile: number;
    passive: number;
    water: number;
    ambient: number;
}

export const mobCapConstants: MobCapConstants = {
    hostile: 70,
    passive: 10,
    water: 5,
    ambient: 15,
};

export const mobs: MobData[] = [
    // Hostile Mobs
    {
        id: 'zombie',
        name: 'Zombie',
        category: 'hostile',
        maxLightLevel: 7,
        minLightLevel: 0,
        biomes: ['All Overworld Biomes'],
        dimensions: ['overworld'],
        spawnBlocks: ['Solid blocks'],
        additionalConditions: ['Sky access not required', 'Can spawn in any biome'],
    },
    {
        id: 'skeleton',
        name: 'Skeleton',
        category: 'hostile',
        maxLightLevel: 7,
        minLightLevel: 0,
        biomes: ['All Overworld Biomes'],
        dimensions: ['overworld'],
        spawnBlocks: ['Solid blocks'],
        additionalConditions: ['Sky access not required'],
    },
    {
        id: 'creeper',
        name: 'Creeper',
        category: 'hostile',
        maxLightLevel: 7,
        minLightLevel: 0,
        biomes: ['All Overworld Biomes'],
        dimensions: ['overworld'],
        spawnBlocks: ['Solid blocks'],
        additionalConditions: ['Sky access not required'],
    },
    {
        id: 'spider',
        name: 'Spider',
        category: 'hostile',
        maxLightLevel: 7,
        minLightLevel: 0,
        biomes: ['All Overworld Biomes'],
        dimensions: ['overworld'],
        spawnBlocks: ['Solid blocks'],
        additionalConditions: ['Needs 3x3x2 space to spawn'],
    },
    {
        id: 'enderman',
        name: 'Enderman',
        category: 'neutral',
        maxLightLevel: 7,
        minLightLevel: 0,
        biomes: ['All Overworld Biomes', 'Nether Wastes', 'Warped Forest'],
        dimensions: ['overworld', 'nether', 'end'],
        spawnBlocks: ['Solid blocks'],
        additionalConditions: ['Light level 0 in Overworld', 'Any light in Nether/End'],
    },
    {
        id: 'witch',
        name: 'Witch',
        category: 'hostile',
        maxLightLevel: 7,
        minLightLevel: 0,
        biomes: ['Swamp', 'Witch Huts'],
        dimensions: ['overworld'],
        spawnBlocks: ['Solid blocks', 'Grass blocks in swamps'],
        additionalConditions: ['Higher spawn rate in swamps', 'Spawns in witch huts'],
    },
    {
        id: 'slime',
        name: 'Slime',
        category: 'hostile',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['Swamp', 'Slime Chunks'],
        dimensions: ['overworld'],
        spawnBlocks: ['Solid blocks'],
        additionalConditions: [
            'Swamp: Light level ≤7, Y: 51-69, full moon increases rate',
            'Slime Chunks: Y < 40, any light level',
        ],
    },
    {
        id: 'phantom',
        name: 'Phantom',
        category: 'hostile',
        maxLightLevel: 7,
        minLightLevel: 0,
        biomes: ['All Overworld Biomes'],
        dimensions: ['overworld'],
        spawnBlocks: ['Air'],
        additionalConditions: [
            'Player must not have slept for 3+ days',
            'Spawns in sky above players',
            'Requires sky access',
        ],
    },
    {
        id: 'drowned',
        name: 'Drowned',
        category: 'hostile',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['Ocean', 'River'],
        dimensions: ['overworld'],
        spawnBlocks: ['Water'],
        additionalConditions: [
            'Spawns in water',
            'Can spawn at any light level underwater',
            'Zombies convert in water',
        ],
    },
    {
        id: 'blaze',
        name: 'Blaze',
        category: 'hostile',
        maxLightLevel: 11,
        minLightLevel: 0,
        biomes: ['Nether Fortress'],
        dimensions: ['nether'],
        spawnBlocks: ['Nether Bricks'],
        additionalConditions: ['Only spawns in Nether Fortresses', 'Needs spawner or natural spawn'],
    },
    {
        id: 'ghast',
        name: 'Ghast',
        category: 'hostile',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['Nether Wastes', 'Basalt Deltas', 'Soul Sand Valley'],
        dimensions: ['nether'],
        spawnBlocks: ['Air'],
        additionalConditions: ['Needs 5x5x5 space', 'Spawns in open areas'],
    },
    {
        id: 'zombified_piglin',
        name: 'Zombified Piglin',
        category: 'neutral',
        maxLightLevel: 11,
        minLightLevel: 0,
        biomes: ['Nether Wastes', 'Crimson Forest'],
        dimensions: ['nether'],
        spawnBlocks: ['Nether blocks'],
        additionalConditions: ['Can spawn in groups', 'Neutral until provoked'],
    },
    {
        id: 'piglin',
        name: 'Piglin',
        category: 'neutral',
        maxLightLevel: 11,
        minLightLevel: 0,
        biomes: ['Crimson Forest', 'Nether Wastes', 'Bastion Remnant'],
        dimensions: ['nether'],
        spawnBlocks: ['Crimson Nylium', 'Nether Wastes blocks'],
        additionalConditions: ['Hostile without gold armor', 'Zombifies in Overworld'],
    },
    {
        id: 'hoglin',
        name: 'Hoglin',
        category: 'hostile',
        maxLightLevel: 11,
        minLightLevel: 0,
        biomes: ['Crimson Forest'],
        dimensions: ['nether'],
        spawnBlocks: ['Crimson Nylium'],
        additionalConditions: ['Avoids warped fungi', 'Zombifies in Overworld'],
    },
    {
        id: 'magma_cube',
        name: 'Magma Cube',
        category: 'hostile',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['Basalt Deltas', 'Nether Fortresses'],
        dimensions: ['nether'],
        spawnBlocks: ['Nether blocks'],
        additionalConditions: ['Spawns in all light levels', 'More common in Basalt Deltas'],
    },
    {
        id: 'shulker',
        name: 'Shulker',
        category: 'hostile',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['End City'],
        dimensions: ['end'],
        spawnBlocks: ['End Stone'],
        additionalConditions: ['Only in End Cities', 'Does not naturally spawn', 'Can teleport'],
    },
    {
        id: 'endermite',
        name: 'Endermite',
        category: 'hostile',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['Any'],
        dimensions: ['overworld', 'nether', 'end'],
        spawnBlocks: ['Any'],
        additionalConditions: ['5% chance when Ender Pearl used', 'Does not naturally spawn'],
    },

    // Passive Mobs
    {
        id: 'cow',
        name: 'Cow',
        category: 'passive',
        maxLightLevel: null,
        minLightLevel: 9,
        biomes: ['Plains', 'Sunflower Plains', 'Forest', 'Flower Forest', 'Birch Forest', 'Dark Forest', 'Taiga', 'Meadow'],
        dimensions: ['overworld'],
        spawnBlocks: ['Grass Block'],
        additionalConditions: ['Requires light level ≥9', 'Spawns during world generation mostly'],
    },
    {
        id: 'pig',
        name: 'Pig',
        category: 'passive',
        maxLightLevel: null,
        minLightLevel: 9,
        biomes: ['Plains', 'Sunflower Plains', 'Forest', 'Flower Forest', 'Birch Forest', 'Dark Forest', 'Taiga', 'Meadow'],
        dimensions: ['overworld'],
        spawnBlocks: ['Grass Block'],
        additionalConditions: ['Requires light level ≥9', 'Spawns during world generation mostly'],
    },
    {
        id: 'sheep',
        name: 'Sheep',
        category: 'passive',
        maxLightLevel: null,
        minLightLevel: 9,
        biomes: ['Plains', 'Sunflower Plains', 'Forest', 'Flower Forest', 'Birch Forest', 'Dark Forest', 'Taiga', 'Meadow'],
        dimensions: ['overworld'],
        spawnBlocks: ['Grass Block'],
        additionalConditions: ['Requires light level ≥9', 'Color varies by biome'],
    },
    {
        id: 'chicken',
        name: 'Chicken',
        category: 'passive',
        maxLightLevel: null,
        minLightLevel: 9,
        biomes: ['Plains', 'Sunflower Plains', 'Forest', 'Flower Forest', 'Birch Forest', 'Dark Forest', 'Jungle'],
        dimensions: ['overworld'],
        spawnBlocks: ['Grass Block'],
        additionalConditions: ['Requires light level ≥9', 'Spawns during world generation mostly'],
    },
    {
        id: 'rabbit',
        name: 'Rabbit',
        category: 'passive',
        maxLightLevel: null,
        minLightLevel: 9,
        biomes: ['Desert', 'Flower Forest', 'Taiga', 'Tundra', 'Snowy Plains', 'Grove'],
        dimensions: ['overworld'],
        spawnBlocks: ['Grass Block', 'Sand', 'Snow'],
        additionalConditions: ['Requires light level ≥9', 'Color varies by biome'],
    },
    {
        id: 'horse',
        name: 'Horse',
        category: 'passive',
        maxLightLevel: null,
        minLightLevel: 9,
        biomes: ['Plains', 'Sunflower Plains', 'Savanna'],
        dimensions: ['overworld'],
        spawnBlocks: ['Grass Block'],
        additionalConditions: ['Requires light level ≥9', 'Spawns in herds'],
    },
    {
        id: 'donkey',
        name: 'Donkey',
        category: 'passive',
        maxLightLevel: null,
        minLightLevel: 9,
        biomes: ['Plains', 'Sunflower Plains', 'Meadow'],
        dimensions: ['overworld'],
        spawnBlocks: ['Grass Block'],
        additionalConditions: ['Requires light level ≥9', 'Spawns in groups of 1-3'],
    },
    {
        id: 'strider',
        name: 'Strider',
        category: 'passive',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['All Nether Biomes'],
        dimensions: ['nether'],
        spawnBlocks: ['Lava'],
        additionalConditions: ['Spawns on lava', 'Can spawn with baby and saddle'],
    },

    // Neutral Mobs
    {
        id: 'wolf',
        name: 'Wolf',
        category: 'neutral',
        maxLightLevel: null,
        minLightLevel: 9,
        biomes: ['Forest', 'Taiga', 'Grove'],
        dimensions: ['overworld'],
        spawnBlocks: ['Grass Block'],
        additionalConditions: ['Requires light level ≥9', 'Spawns in packs'],
    },
    {
        id: 'polar_bear',
        name: 'Polar Bear',
        category: 'neutral',
        maxLightLevel: null,
        minLightLevel: 9,
        biomes: ['Snowy Plains', 'Ice Spikes', 'Frozen Ocean'],
        dimensions: ['overworld'],
        spawnBlocks: ['Ice', 'Snow Block', 'Packed Ice'],
        additionalConditions: ['Requires light level ≥9', 'Aggressive if cub nearby'],
    },
    {
        id: 'bee',
        name: 'Bee',
        category: 'neutral',
        maxLightLevel: null,
        minLightLevel: 9,
        biomes: ['Plains', 'Sunflower Plains', 'Flower Forest'],
        dimensions: ['overworld'],
        spawnBlocks: ['Near bee nests'],
        additionalConditions: ['Spawns with nests', 'Aggressive when attacked or nest destroyed'],
    },
    {
        id: 'spider_jockey',
        name: 'Spider Jockey',
        category: 'hostile',
        maxLightLevel: 7,
        minLightLevel: 0,
        biomes: ['All Overworld Biomes'],
        dimensions: ['overworld'],
        spawnBlocks: ['Solid blocks'],
        additionalConditions: ['1% chance when spider spawns', 'Skeleton riding spider'],
    },
    {
        id: 'iron_golem',
        name: 'Iron Golem',
        category: 'neutral',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['Village'],
        dimensions: ['overworld'],
        spawnBlocks: ['Any'],
        additionalConditions: ['Spawns in villages', 'Requires 10 villagers and 21 beds'],
    },

    // Water Mobs
    {
        id: 'squid',
        name: 'Squid',
        category: 'water',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['Ocean', 'River'],
        dimensions: ['overworld'],
        spawnBlocks: ['Water'],
        additionalConditions: ['Spawns in water', 'Y: 46-sea level'],
    },
    {
        id: 'glow_squid',
        name: 'Glow Squid',
        category: 'water',
        maxLightLevel: 0,
        minLightLevel: 0,
        biomes: ['Underground water sources'],
        dimensions: ['overworld'],
        spawnBlocks: ['Water'],
        additionalConditions: ['Spawns in total darkness', 'Y < 30', 'Underground lakes'],
    },
    {
        id: 'cod',
        name: 'Cod',
        category: 'water',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['Ocean', 'Lukewarm Ocean', 'Cold Ocean'],
        dimensions: ['overworld'],
        spawnBlocks: ['Water'],
        additionalConditions: ['Spawns in schools', 'Excludes warm oceans'],
    },
    {
        id: 'salmon',
        name: 'Salmon',
        category: 'water',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['Ocean', 'Cold Ocean', 'Frozen Ocean', 'River'],
        dimensions: ['overworld'],
        spawnBlocks: ['Water'],
        additionalConditions: ['Spawns in schools', 'Prefers cold water'],
    },
    {
        id: 'tropical_fish',
        name: 'Tropical Fish',
        category: 'water',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['Warm Ocean', 'Lukewarm Ocean'],
        dimensions: ['overworld'],
        spawnBlocks: ['Water'],
        additionalConditions: ['Spawns in schools', 'Multiple varieties'],
    },
    {
        id: 'pufferfish',
        name: 'Pufferfish',
        category: 'water',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['Warm Ocean', 'Lukewarm Ocean'],
        dimensions: ['overworld'],
        spawnBlocks: ['Water'],
        additionalConditions: ['Spawns individually', 'Inflates when threatened'],
    },
    {
        id: 'dolphin',
        name: 'Dolphin',
        category: 'neutral',
        maxLightLevel: null,
        minLightLevel: 0,
        biomes: ['Ocean (except frozen)'],
        dimensions: ['overworld'],
        spawnBlocks: ['Water'],
        additionalConditions: ['Spawns in groups', 'Needs air to breathe'],
    },
    {
        id: 'turtle',
        name: 'Turtle',
        category: 'passive',
        maxLightLevel: null,
        minLightLevel: 9,
        biomes: ['Beach'],
        dimensions: ['overworld'],
        spawnBlocks: ['Sand'],
        additionalConditions: ['Spawns on beaches', 'Lays eggs on sand'],
    },

    // Ambient Mobs
    {
        id: 'bat',
        name: 'Bat',
        category: 'ambient',
        maxLightLevel: 3,
        minLightLevel: 0,
        biomes: ['Underground'],
        dimensions: ['overworld'],
        spawnBlocks: ['Solid blocks'],
        additionalConditions: ['Y < 63', 'October 20-November 3: Light ≤6, any Y'],
    },
];

export const lightSources: LightSource[] = [
    { name: 'Sunlight', lightLevel: 15, category: 'Natural' },
    { name: 'Moonlight (Full)', lightLevel: 4, category: 'Natural' },
    { name: 'Torch', lightLevel: 14, category: 'Crafted' },
    { name: 'Soul Torch', lightLevel: 10, category: 'Crafted' },
    { name: 'Lantern', lightLevel: 15, category: 'Crafted' },
    { name: 'Soul Lantern', lightLevel: 10, category: 'Crafted' },
    { name: 'Glowstone', lightLevel: 15, category: 'Natural' },
    { name: 'Sea Lantern', lightLevel: 15, category: 'Crafted' },
    { name: 'Jack o\'Lantern', lightLevel: 15, category: 'Crafted' },
    { name: 'Redstone Torch', lightLevel: 7, category: 'Crafted' },
    { name: 'Campfire', lightLevel: 15, category: 'Crafted' },
    { name: 'Soul Campfire', lightLevel: 10, category: 'Crafted' },
    { name: 'End Rod', lightLevel: 14, category: 'Natural' },
    { name: 'Beacon', lightLevel: 15, category: 'Crafted' },
    { name: 'Conduit', lightLevel: 15, category: 'Crafted' },
    { name: 'Lava', lightLevel: 15, category: 'Natural' },
    { name: 'Fire', lightLevel: 15, category: 'Natural' },
    { name: 'Redstone Lamp (On)', lightLevel: 15, category: 'Crafted' },
    { name: 'Shroomlight', lightLevel: 15, category: 'Natural' },
    { name: 'Froglight', lightLevel: 15, category: 'Natural' },
    { name: 'Glow Lichen', lightLevel: 7, category: 'Natural' },
    { name: 'Amethyst Cluster', lightLevel: 5, category: 'Natural' },
    { name: 'Magma Block', lightLevel: 3, category: 'Natural' },
    { name: 'Brown Mushroom', lightLevel: 1, category: 'Natural' },
    { name: 'Crying Obsidian', lightLevel: 10, category: 'Natural' },
    { name: 'Respawn Anchor (Charged)', lightLevel: 15, category: 'Crafted' },
    { name: 'Candle (1)', lightLevel: 3, category: 'Crafted' },
    { name: 'Candle (2)', lightLevel: 6, category: 'Crafted' },
    { name: 'Candle (3)', lightLevel: 9, category: 'Crafted' },
    { name: 'Candle (4)', lightLevel: 12, category: 'Crafted' },
];

export const spawnProofBlocks = [
    { name: 'Slabs (Bottom Half)', description: 'Prevents spawning on top' },
    { name: 'Stairs', description: 'Prevents spawning in certain positions' },
    { name: 'Carpets', description: 'Prevents spawning on the block' },
    { name: 'Buttons', description: 'Prevents spawning on the block' },
    { name: 'Pressure Plates', description: 'Prevents spawning on the block' },
    { name: 'Torches', description: 'Prevents spawning (light level)' },
    { name: 'Redstone Components', description: 'Prevents spawning on the block' },
    { name: 'Rails', description: 'Prevents spawning on the block' },
    { name: 'Glass', description: 'Prevents spawning (not solid to mobs)' },
    { name: 'Leaves', description: 'Prevents spawning (not solid to mobs)' },
    { name: 'Ice/Packed Ice', description: 'Prevents most mob spawning' },
    { name: 'Soul Sand', description: 'Prevents spawning (not a full block)' },
    { name: 'Honey Block', description: 'Prevents spawning (not a full block)' },
    { name: 'Slime Block', description: 'Allows spawning (is a full block)' },
];

export function getMobsByCategory(category: MobData['category']): MobData[] {
    return mobs.filter((mob) => mob.category === category);
}

export function getMobsByDimension(dimension: 'overworld' | 'nether' | 'end'): MobData[] {
    return mobs.filter((mob) => mob.dimensions.includes(dimension));
}

export function canMobSpawnAtLight(mob: MobData, lightLevel: number): boolean {
    if (mob.maxLightLevel === null && mob.minLightLevel === null) {
        return true;
    }
    if (mob.maxLightLevel !== null && lightLevel > mob.maxLightLevel) {
        return false;
    }
    if (mob.minLightLevel !== null && lightLevel < mob.minLightLevel) {
        return false;
    }
    return true;
}

export function calculateMobCap(chunksInRange: number, category: keyof MobCapConstants): number {
    return Math.floor((mobCapConstants[category] * chunksInRange) / 289);
}

export function calculateEffectiveLightLevel(blockLight: number, skyLight: number, timeOfDay: number): number {
    const skylightAtTime = Math.max(skyLight - (15 - Math.floor(timeOfDay / 1000)), 0);
    return Math.max(blockLight, skylightAtTime);
}
