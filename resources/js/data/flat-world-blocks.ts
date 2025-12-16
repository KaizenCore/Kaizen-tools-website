export interface MinecraftBlock {
    id: string;
    name: string;
    category: string;
    color: string;
}

export interface WorldLayer {
    block: string;
    height: number;
}

export interface FlatWorldPreset {
    id: string;
    name: string;
    description: string;
    layers: WorldLayer[];
    biome: string;
    structures: string[];
}

export const blockCategories = [
    'Natural',
    'Stone',
    'Ores',
    'Building',
    'Decoration',
    'Utility',
] as const;

export const minecraftBlocks: MinecraftBlock[] = [
    // Natural blocks
    { id: 'minecraft:air', name: 'Air', category: 'Natural', color: 'oklch(0.87 0 0)' },
    { id: 'minecraft:grass_block', name: 'Grass Block', category: 'Natural', color: 'oklch(0.55 0.12 145)' },
    { id: 'minecraft:dirt', name: 'Dirt', category: 'Natural', color: 'oklch(0.45 0.08 55)' },
    { id: 'minecraft:coarse_dirt', name: 'Coarse Dirt', category: 'Natural', color: 'oklch(0.40 0.08 55)' },
    { id: 'minecraft:podzol', name: 'Podzol', category: 'Natural', color: 'oklch(0.35 0.06 50)' },
    { id: 'minecraft:sand', name: 'Sand', category: 'Natural', color: 'oklch(0.85 0.08 85)' },
    { id: 'minecraft:red_sand', name: 'Red Sand', category: 'Natural', color: 'oklch(0.65 0.15 35)' },
    { id: 'minecraft:gravel', name: 'Gravel', category: 'Natural', color: 'oklch(0.50 0.02 280)' },
    { id: 'minecraft:clay', name: 'Clay', category: 'Natural', color: 'oklch(0.65 0.04 250)' },
    { id: 'minecraft:snow_block', name: 'Snow Block', category: 'Natural', color: 'oklch(0.95 0 0)' },
    { id: 'minecraft:ice', name: 'Ice', category: 'Natural', color: 'oklch(0.85 0.05 240)' },
    { id: 'minecraft:packed_ice', name: 'Packed Ice', category: 'Natural', color: 'oklch(0.80 0.08 240)' },
    { id: 'minecraft:mycelium', name: 'Mycelium', category: 'Natural', color: 'oklch(0.55 0.08 290)' },
    { id: 'minecraft:water', name: 'Water', category: 'Natural', color: 'oklch(0.60 0.12 240)' },
    { id: 'minecraft:lava', name: 'Lava', category: 'Natural', color: 'oklch(0.60 0.25 30)' },

    // Stone blocks
    { id: 'minecraft:bedrock', name: 'Bedrock', category: 'Stone', color: 'oklch(0.25 0.02 280)' },
    { id: 'minecraft:stone', name: 'Stone', category: 'Stone', color: 'oklch(0.55 0.02 280)' },
    { id: 'minecraft:cobblestone', name: 'Cobblestone', category: 'Stone', color: 'oklch(0.50 0.02 280)' },
    { id: 'minecraft:mossy_cobblestone', name: 'Mossy Cobblestone', category: 'Stone', color: 'oklch(0.48 0.08 145)' },
    { id: 'minecraft:granite', name: 'Granite', category: 'Stone', color: 'oklch(0.60 0.12 35)' },
    { id: 'minecraft:diorite', name: 'Diorite', category: 'Stone', color: 'oklch(0.75 0.02 280)' },
    { id: 'minecraft:andesite', name: 'Andesite', category: 'Stone', color: 'oklch(0.50 0.02 280)' },
    { id: 'minecraft:deepslate', name: 'Deepslate', category: 'Stone', color: 'oklch(0.35 0.02 280)' },
    { id: 'minecraft:tuff', name: 'Tuff', category: 'Stone', color: 'oklch(0.45 0.02 140)' },
    { id: 'minecraft:calcite', name: 'Calcite', category: 'Stone', color: 'oklch(0.90 0.02 280)' },
    { id: 'minecraft:sandstone', name: 'Sandstone', category: 'Stone', color: 'oklch(0.80 0.08 85)' },
    { id: 'minecraft:red_sandstone', name: 'Red Sandstone', category: 'Stone', color: 'oklch(0.60 0.15 35)' },
    { id: 'minecraft:obsidian', name: 'Obsidian', category: 'Stone', color: 'oklch(0.20 0.02 290)' },
    { id: 'minecraft:netherrack', name: 'Netherrack', category: 'Stone', color: 'oklch(0.45 0.15 20)' },
    { id: 'minecraft:soul_sand', name: 'Soul Sand', category: 'Stone', color: 'oklch(0.35 0.08 35)' },
    { id: 'minecraft:soul_soil', name: 'Soul Soil', category: 'Stone', color: 'oklch(0.30 0.05 35)' },
    { id: 'minecraft:basalt', name: 'Basalt', category: 'Stone', color: 'oklch(0.35 0.02 280)' },
    { id: 'minecraft:blackstone', name: 'Blackstone', category: 'Stone', color: 'oklch(0.30 0.02 280)' },
    { id: 'minecraft:end_stone', name: 'End Stone', category: 'Stone', color: 'oklch(0.85 0.08 85)' },

    // Ore blocks
    { id: 'minecraft:coal_ore', name: 'Coal Ore', category: 'Ores', color: 'oklch(0.45 0.02 280)' },
    { id: 'minecraft:iron_ore', name: 'Iron Ore', category: 'Ores', color: 'oklch(0.60 0.05 35)' },
    { id: 'minecraft:copper_ore', name: 'Copper Ore', category: 'Ores', color: 'oklch(0.55 0.10 35)' },
    { id: 'minecraft:gold_ore', name: 'Gold Ore', category: 'Ores', color: 'oklch(0.65 0.15 85)' },
    { id: 'minecraft:redstone_ore', name: 'Redstone Ore', category: 'Ores', color: 'oklch(0.50 0.20 20)' },
    { id: 'minecraft:emerald_ore', name: 'Emerald Ore', category: 'Ores', color: 'oklch(0.55 0.15 160)' },
    { id: 'minecraft:lapis_ore', name: 'Lapis Ore', category: 'Ores', color: 'oklch(0.45 0.15 250)' },
    { id: 'minecraft:diamond_ore', name: 'Diamond Ore', category: 'Ores', color: 'oklch(0.65 0.15 210)' },
    { id: 'minecraft:coal_block', name: 'Block of Coal', category: 'Ores', color: 'oklch(0.25 0.02 280)' },
    { id: 'minecraft:iron_block', name: 'Block of Iron', category: 'Ores', color: 'oklch(0.80 0.02 280)' },
    { id: 'minecraft:copper_block', name: 'Block of Copper', category: 'Ores', color: 'oklch(0.60 0.15 35)' },
    { id: 'minecraft:gold_block', name: 'Block of Gold', category: 'Ores', color: 'oklch(0.75 0.20 85)' },
    { id: 'minecraft:diamond_block', name: 'Block of Diamond', category: 'Ores', color: 'oklch(0.70 0.20 210)' },
    { id: 'minecraft:emerald_block', name: 'Block of Emerald', category: 'Ores', color: 'oklch(0.60 0.20 160)' },

    // Building blocks
    { id: 'minecraft:oak_planks', name: 'Oak Planks', category: 'Building', color: 'oklch(0.65 0.08 75)' },
    { id: 'minecraft:spruce_planks', name: 'Spruce Planks', category: 'Building', color: 'oklch(0.45 0.06 65)' },
    { id: 'minecraft:birch_planks', name: 'Birch Planks', category: 'Building', color: 'oklch(0.80 0.06 75)' },
    { id: 'minecraft:jungle_planks', name: 'Jungle Planks', category: 'Building', color: 'oklch(0.55 0.08 65)' },
    { id: 'minecraft:acacia_planks', name: 'Acacia Planks', category: 'Building', color: 'oklch(0.60 0.12 35)' },
    { id: 'minecraft:dark_oak_planks', name: 'Dark Oak Planks', category: 'Building', color: 'oklch(0.40 0.06 55)' },
    { id: 'minecraft:white_wool', name: 'White Wool', category: 'Building', color: 'oklch(0.95 0.02 280)' },
    { id: 'minecraft:orange_wool', name: 'Orange Wool', category: 'Building', color: 'oklch(0.70 0.15 50)' },
    { id: 'minecraft:magenta_wool', name: 'Magenta Wool', category: 'Building', color: 'oklch(0.65 0.20 330)' },
    { id: 'minecraft:light_blue_wool', name: 'Light Blue Wool', category: 'Building', color: 'oklch(0.75 0.12 240)' },
    { id: 'minecraft:yellow_wool', name: 'Yellow Wool', category: 'Building', color: 'oklch(0.85 0.15 95)' },
    { id: 'minecraft:lime_wool', name: 'Lime Wool', category: 'Building', color: 'oklch(0.75 0.18 135)' },
    { id: 'minecraft:pink_wool', name: 'Pink Wool', category: 'Building', color: 'oklch(0.80 0.12 0)' },
    { id: 'minecraft:gray_wool', name: 'Gray Wool', category: 'Building', color: 'oklch(0.50 0.02 280)' },
    { id: 'minecraft:light_gray_wool', name: 'Light Gray Wool', category: 'Building', color: 'oklch(0.70 0.02 280)' },
    { id: 'minecraft:cyan_wool', name: 'Cyan Wool', category: 'Building', color: 'oklch(0.60 0.15 215)' },
    { id: 'minecraft:purple_wool', name: 'Purple Wool', category: 'Building', color: 'oklch(0.50 0.18 300)' },
    { id: 'minecraft:blue_wool', name: 'Blue Wool', category: 'Building', color: 'oklch(0.45 0.20 260)' },
    { id: 'minecraft:brown_wool', name: 'Brown Wool', category: 'Building', color: 'oklch(0.45 0.08 55)' },
    { id: 'minecraft:green_wool', name: 'Green Wool', category: 'Building', color: 'oklch(0.45 0.15 145)' },
    { id: 'minecraft:red_wool', name: 'Red Wool', category: 'Building', color: 'oklch(0.55 0.22 20)' },
    { id: 'minecraft:black_wool', name: 'Black Wool', category: 'Building', color: 'oklch(0.20 0.02 280)' },
    { id: 'minecraft:white_concrete', name: 'White Concrete', category: 'Building', color: 'oklch(0.95 0.02 280)' },
    { id: 'minecraft:glass', name: 'Glass', category: 'Building', color: 'oklch(0.90 0.02 240)' },
    { id: 'minecraft:glowstone', name: 'Glowstone', category: 'Building', color: 'oklch(0.85 0.15 85)' },

    // Decoration
    { id: 'minecraft:oak_log', name: 'Oak Log', category: 'Decoration', color: 'oklch(0.55 0.08 65)' },
    { id: 'minecraft:oak_leaves', name: 'Oak Leaves', category: 'Decoration', color: 'oklch(0.45 0.12 145)' },
    { id: 'minecraft:spruce_log', name: 'Spruce Log', category: 'Decoration', color: 'oklch(0.40 0.06 55)' },
    { id: 'minecraft:birch_log', name: 'Birch Log', category: 'Decoration', color: 'oklch(0.85 0.02 280)' },
    { id: 'minecraft:mushroom_stem', name: 'Mushroom Stem', category: 'Decoration', color: 'oklch(0.90 0.02 280)' },
    { id: 'minecraft:brown_mushroom_block', name: 'Brown Mushroom Block', category: 'Decoration', color: 'oklch(0.55 0.10 55)' },
    { id: 'minecraft:red_mushroom_block', name: 'Red Mushroom Block', category: 'Decoration', color: 'oklch(0.65 0.22 20)' },

    // Utility
    { id: 'minecraft:tnt', name: 'TNT', category: 'Utility', color: 'oklch(0.60 0.22 20)' },
    { id: 'minecraft:redstone_block', name: 'Block of Redstone', category: 'Utility', color: 'oklch(0.50 0.25 20)' },
    { id: 'minecraft:barrier', name: 'Barrier', category: 'Utility', color: 'oklch(0.90 0.02 280 / 0.3)' },
];

export const biomes = [
    { id: 'minecraft:plains', name: 'Plains' },
    { id: 'minecraft:sunflower_plains', name: 'Sunflower Plains' },
    { id: 'minecraft:desert', name: 'Desert' },
    { id: 'minecraft:forest', name: 'Forest' },
    { id: 'minecraft:flower_forest', name: 'Flower Forest' },
    { id: 'minecraft:birch_forest', name: 'Birch Forest' },
    { id: 'minecraft:dark_forest', name: 'Dark Forest' },
    { id: 'minecraft:taiga', name: 'Taiga' },
    { id: 'minecraft:snowy_taiga', name: 'Snowy Taiga' },
    { id: 'minecraft:snowy_plains', name: 'Snowy Plains' },
    { id: 'minecraft:ice_spikes', name: 'Ice Spikes' },
    { id: 'minecraft:jungle', name: 'Jungle' },
    { id: 'minecraft:bamboo_jungle', name: 'Bamboo Jungle' },
    { id: 'minecraft:savanna', name: 'Savanna' },
    { id: 'minecraft:badlands', name: 'Badlands' },
    { id: 'minecraft:mushroom_fields', name: 'Mushroom Fields' },
    { id: 'minecraft:swamp', name: 'Swamp' },
    { id: 'minecraft:mangrove_swamp', name: 'Mangrove Swamp' },
    { id: 'minecraft:cherry_grove', name: 'Cherry Grove' },
    { id: 'minecraft:ocean', name: 'Ocean' },
    { id: 'minecraft:the_void', name: 'The Void' },
];

export const structures = [
    { id: 'village', name: 'Villages', description: 'Generate villages with villagers' },
    { id: 'stronghold', name: 'Strongholds', description: 'Generate strongholds with End portals' },
    { id: 'mineshaft', name: 'Mineshafts', description: 'Generate abandoned mineshafts' },
    { id: 'monument', name: 'Ocean Monuments', description: 'Generate ocean monuments' },
    { id: 'mansion', name: 'Woodland Mansions', description: 'Generate woodland mansions' },
    { id: 'temple', name: 'Temples', description: 'Generate desert/jungle temples' },
    { id: 'pillager_outpost', name: 'Pillager Outposts', description: 'Generate pillager outposts' },
    { id: 'ruined_portal', name: 'Ruined Portals', description: 'Generate ruined nether portals' },
    { id: 'shipwreck', name: 'Shipwrecks', description: 'Generate shipwrecks' },
    { id: 'ocean_ruin', name: 'Ocean Ruins', description: 'Generate ocean ruins' },
    { id: 'ancient_city', name: 'Ancient Cities', description: 'Generate deep dark ancient cities' },
    { id: 'trail_ruins', name: 'Trail Ruins', description: 'Generate trail ruins' },
];

export const presets: FlatWorldPreset[] = [
    {
        id: 'classic_flat',
        name: 'Classic Flat',
        description: 'The default superflat world',
        layers: [
            { block: 'minecraft:bedrock', height: 1 },
            { block: 'minecraft:dirt', height: 2 },
            { block: 'minecraft:grass_block', height: 1 },
        ],
        biome: 'minecraft:plains',
        structures: ['village'],
    },
    {
        id: 'tunnelers_dream',
        name: "Tunneler's Dream",
        description: 'Great for mining and tunnel building',
        layers: [
            { block: 'minecraft:bedrock', height: 1 },
            { block: 'minecraft:stone', height: 230 },
            { block: 'minecraft:grass_block', height: 1 },
        ],
        biome: 'minecraft:plains',
        structures: ['stronghold', 'mineshaft', 'village'],
    },
    {
        id: 'water_world',
        name: 'Water World',
        description: 'An ocean-covered world',
        layers: [
            { block: 'minecraft:bedrock', height: 1 },
            { block: 'minecraft:stone', height: 5 },
            { block: 'minecraft:dirt', height: 5 },
            { block: 'minecraft:sand', height: 5 },
            { block: 'minecraft:water', height: 90 },
        ],
        biome: 'minecraft:ocean',
        structures: ['monument', 'ocean_ruin', 'shipwreck'],
    },
    {
        id: 'overworld',
        name: 'Overworld',
        description: 'Similar to default world generation',
        layers: [
            { block: 'minecraft:bedrock', height: 1 },
            { block: 'minecraft:stone', height: 59 },
            { block: 'minecraft:dirt', height: 3 },
            { block: 'minecraft:grass_block', height: 1 },
        ],
        biome: 'minecraft:plains',
        structures: ['village', 'stronghold', 'mineshaft', 'temple', 'pillager_outpost'],
    },
    {
        id: 'snowy_kingdom',
        name: 'Snowy Kingdom',
        description: 'A snowy flat world',
        layers: [
            { block: 'minecraft:bedrock', height: 1 },
            { block: 'minecraft:stone', height: 59 },
            { block: 'minecraft:dirt', height: 3 },
            { block: 'minecraft:grass_block', height: 1 },
            { block: 'minecraft:snow_block', height: 1 },
        ],
        biome: 'minecraft:snowy_plains',
        structures: ['village', 'pillager_outpost'],
    },
    {
        id: 'bottomless_pit',
        name: 'Bottomless Pit',
        description: 'A thin layer over the void',
        layers: [
            { block: 'minecraft:grass_block', height: 1 },
        ],
        biome: 'minecraft:plains',
        structures: [],
    },
    {
        id: 'desert_world',
        name: 'Desert World',
        description: 'Sandy and dry',
        layers: [
            { block: 'minecraft:bedrock', height: 1 },
            { block: 'minecraft:stone', height: 59 },
            { block: 'minecraft:sandstone', height: 3 },
            { block: 'minecraft:sand', height: 5 },
        ],
        biome: 'minecraft:desert',
        structures: ['village', 'temple'],
    },
    {
        id: 'redstone_ready',
        name: 'Redstone Ready',
        description: 'Perfect for redstone contraptions',
        layers: [
            { block: 'minecraft:bedrock', height: 1 },
            { block: 'minecraft:sandstone', height: 52 },
            { block: 'minecraft:stone', height: 10 },
            { block: 'minecraft:grass_block', height: 1 },
        ],
        biome: 'minecraft:plains',
        structures: [],
    },
    {
        id: 'the_void',
        name: 'The Void',
        description: 'Completely empty void world',
        layers: [
            { block: 'minecraft:air', height: 1 },
        ],
        biome: 'minecraft:the_void',
        structures: [],
    },
];
