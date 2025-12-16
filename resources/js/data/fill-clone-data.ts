export interface MinecraftBlock {
    id: string;
    name: string;
    category: string;
    states?: string[];
}

export interface BlockState {
    name: string;
    values: string[];
}

export const minecraftBlocks: MinecraftBlock[] = [
    // Stone variants
    { id: 'stone', name: 'Stone', category: 'stone' },
    { id: 'granite', name: 'Granite', category: 'stone' },
    { id: 'polished_granite', name: 'Polished Granite', category: 'stone' },
    { id: 'diorite', name: 'Diorite', category: 'stone' },
    { id: 'polished_diorite', name: 'Polished Diorite', category: 'stone' },
    { id: 'andesite', name: 'Andesite', category: 'stone' },
    { id: 'polished_andesite', name: 'Polished Andesite', category: 'stone' },
    { id: 'deepslate', name: 'Deepslate', category: 'stone', states: ['axis'] },
    { id: 'cobbled_deepslate', name: 'Cobbled Deepslate', category: 'stone' },
    { id: 'polished_deepslate', name: 'Polished Deepslate', category: 'stone' },
    { id: 'calcite', name: 'Calcite', category: 'stone' },
    { id: 'tuff', name: 'Tuff', category: 'stone' },
    { id: 'dripstone_block', name: 'Dripstone Block', category: 'stone' },
    { id: 'cobblestone', name: 'Cobblestone', category: 'stone' },
    { id: 'mossy_cobblestone', name: 'Mossy Cobblestone', category: 'stone' },
    { id: 'smooth_stone', name: 'Smooth Stone', category: 'stone' },
    { id: 'stone_bricks', name: 'Stone Bricks', category: 'stone' },
    { id: 'mossy_stone_bricks', name: 'Mossy Stone Bricks', category: 'stone' },
    { id: 'cracked_stone_bricks', name: 'Cracked Stone Bricks', category: 'stone' },
    { id: 'chiseled_stone_bricks', name: 'Chiseled Stone Bricks', category: 'stone' },

    // Wood types - Logs
    { id: 'oak_log', name: 'Oak Log', category: 'wood', states: ['axis'] },
    { id: 'spruce_log', name: 'Spruce Log', category: 'wood', states: ['axis'] },
    { id: 'birch_log', name: 'Birch Log', category: 'wood', states: ['axis'] },
    { id: 'jungle_log', name: 'Jungle Log', category: 'wood', states: ['axis'] },
    { id: 'acacia_log', name: 'Acacia Log', category: 'wood', states: ['axis'] },
    { id: 'dark_oak_log', name: 'Dark Oak Log', category: 'wood', states: ['axis'] },
    { id: 'mangrove_log', name: 'Mangrove Log', category: 'wood', states: ['axis'] },
    { id: 'cherry_log', name: 'Cherry Log', category: 'wood', states: ['axis'] },
    { id: 'bamboo_block', name: 'Bamboo Block', category: 'wood', states: ['axis'] },
    { id: 'crimson_stem', name: 'Crimson Stem', category: 'wood', states: ['axis'] },
    { id: 'warped_stem', name: 'Warped Stem', category: 'wood', states: ['axis'] },

    // Wood - Planks
    { id: 'oak_planks', name: 'Oak Planks', category: 'wood' },
    { id: 'spruce_planks', name: 'Spruce Planks', category: 'wood' },
    { id: 'birch_planks', name: 'Birch Planks', category: 'wood' },
    { id: 'jungle_planks', name: 'Jungle Planks', category: 'wood' },
    { id: 'acacia_planks', name: 'Acacia Planks', category: 'wood' },
    { id: 'dark_oak_planks', name: 'Dark Oak Planks', category: 'wood' },
    { id: 'mangrove_planks', name: 'Mangrove Planks', category: 'wood' },
    { id: 'cherry_planks', name: 'Cherry Planks', category: 'wood' },
    { id: 'bamboo_planks', name: 'Bamboo Planks', category: 'wood' },
    { id: 'crimson_planks', name: 'Crimson Planks', category: 'wood' },
    { id: 'warped_planks', name: 'Warped Planks', category: 'wood' },

    // Building blocks
    { id: 'bricks', name: 'Bricks', category: 'building' },
    { id: 'packed_mud', name: 'Packed Mud', category: 'building' },
    { id: 'mud_bricks', name: 'Mud Bricks', category: 'building' },

    // Terracotta
    { id: 'terracotta', name: 'Terracotta', category: 'building' },
    { id: 'white_terracotta', name: 'White Terracotta', category: 'building' },
    { id: 'orange_terracotta', name: 'Orange Terracotta', category: 'building' },
    { id: 'magenta_terracotta', name: 'Magenta Terracotta', category: 'building' },
    { id: 'light_blue_terracotta', name: 'Light Blue Terracotta', category: 'building' },
    { id: 'yellow_terracotta', name: 'Yellow Terracotta', category: 'building' },
    { id: 'lime_terracotta', name: 'Lime Terracotta', category: 'building' },
    { id: 'pink_terracotta', name: 'Pink Terracotta', category: 'building' },
    { id: 'gray_terracotta', name: 'Gray Terracotta', category: 'building' },
    { id: 'light_gray_terracotta', name: 'Light Gray Terracotta', category: 'building' },
    { id: 'cyan_terracotta', name: 'Cyan Terracotta', category: 'building' },
    { id: 'purple_terracotta', name: 'Purple Terracotta', category: 'building' },
    { id: 'blue_terracotta', name: 'Blue Terracotta', category: 'building' },
    { id: 'brown_terracotta', name: 'Brown Terracotta', category: 'building' },
    { id: 'green_terracotta', name: 'Green Terracotta', category: 'building' },
    { id: 'red_terracotta', name: 'Red Terracotta', category: 'building' },
    { id: 'black_terracotta', name: 'Black Terracotta', category: 'building' },

    // Concrete
    { id: 'white_concrete', name: 'White Concrete', category: 'building' },
    { id: 'orange_concrete', name: 'Orange Concrete', category: 'building' },
    { id: 'magenta_concrete', name: 'Magenta Concrete', category: 'building' },
    { id: 'light_blue_concrete', name: 'Light Blue Concrete', category: 'building' },
    { id: 'yellow_concrete', name: 'Yellow Concrete', category: 'building' },
    { id: 'lime_concrete', name: 'Lime Concrete', category: 'building' },
    { id: 'pink_concrete', name: 'Pink Concrete', category: 'building' },
    { id: 'gray_concrete', name: 'Gray Concrete', category: 'building' },
    { id: 'light_gray_concrete', name: 'Light Gray Concrete', category: 'building' },
    { id: 'cyan_concrete', name: 'Cyan Concrete', category: 'building' },
    { id: 'purple_concrete', name: 'Purple Concrete', category: 'building' },
    { id: 'blue_concrete', name: 'Blue Concrete', category: 'building' },
    { id: 'brown_concrete', name: 'Brown Concrete', category: 'building' },
    { id: 'green_concrete', name: 'Green Concrete', category: 'building' },
    { id: 'red_concrete', name: 'Red Concrete', category: 'building' },
    { id: 'black_concrete', name: 'Black Concrete', category: 'building' },

    // Wool
    { id: 'white_wool', name: 'White Wool', category: 'building' },
    { id: 'orange_wool', name: 'Orange Wool', category: 'building' },
    { id: 'magenta_wool', name: 'Magenta Wool', category: 'building' },
    { id: 'light_blue_wool', name: 'Light Blue Wool', category: 'building' },
    { id: 'yellow_wool', name: 'Yellow Wool', category: 'building' },
    { id: 'lime_wool', name: 'Lime Wool', category: 'building' },
    { id: 'pink_wool', name: 'Pink Wool', category: 'building' },
    { id: 'gray_wool', name: 'Gray Wool', category: 'building' },
    { id: 'light_gray_wool', name: 'Light Gray Wool', category: 'building' },
    { id: 'cyan_wool', name: 'Cyan Wool', category: 'building' },
    { id: 'purple_wool', name: 'Purple Wool', category: 'building' },
    { id: 'blue_wool', name: 'Blue Wool', category: 'building' },
    { id: 'brown_wool', name: 'Brown Wool', category: 'building' },
    { id: 'green_wool', name: 'Green Wool', category: 'building' },
    { id: 'red_wool', name: 'Red Wool', category: 'building' },
    { id: 'black_wool', name: 'Black Wool', category: 'building' },

    // Glass
    { id: 'glass', name: 'Glass', category: 'glass' },
    { id: 'tinted_glass', name: 'Tinted Glass', category: 'glass' },
    { id: 'white_stained_glass', name: 'White Stained Glass', category: 'glass' },
    { id: 'orange_stained_glass', name: 'Orange Stained Glass', category: 'glass' },
    { id: 'magenta_stained_glass', name: 'Magenta Stained Glass', category: 'glass' },
    { id: 'light_blue_stained_glass', name: 'Light Blue Stained Glass', category: 'glass' },
    { id: 'yellow_stained_glass', name: 'Yellow Stained Glass', category: 'glass' },
    { id: 'lime_stained_glass', name: 'Lime Stained Glass', category: 'glass' },
    { id: 'pink_stained_glass', name: 'Pink Stained Glass', category: 'glass' },
    { id: 'gray_stained_glass', name: 'Gray Stained Glass', category: 'glass' },
    { id: 'light_gray_stained_glass', name: 'Light Gray Stained Glass', category: 'glass' },
    { id: 'cyan_stained_glass', name: 'Cyan Stained Glass', category: 'glass' },
    { id: 'purple_stained_glass', name: 'Purple Stained Glass', category: 'glass' },
    { id: 'blue_stained_glass', name: 'Blue Stained Glass', category: 'glass' },
    { id: 'brown_stained_glass', name: 'Brown Stained Glass', category: 'glass' },
    { id: 'green_stained_glass', name: 'Green Stained Glass', category: 'glass' },
    { id: 'red_stained_glass', name: 'Red Stained Glass', category: 'glass' },
    { id: 'black_stained_glass', name: 'Black Stained Glass', category: 'glass' },

    // Ores and minerals
    { id: 'coal_ore', name: 'Coal Ore', category: 'ore' },
    { id: 'deepslate_coal_ore', name: 'Deepslate Coal Ore', category: 'ore' },
    { id: 'iron_ore', name: 'Iron Ore', category: 'ore' },
    { id: 'deepslate_iron_ore', name: 'Deepslate Iron Ore', category: 'ore' },
    { id: 'copper_ore', name: 'Copper Ore', category: 'ore' },
    { id: 'deepslate_copper_ore', name: 'Deepslate Copper Ore', category: 'ore' },
    { id: 'gold_ore', name: 'Gold Ore', category: 'ore' },
    { id: 'deepslate_gold_ore', name: 'Deepslate Gold Ore', category: 'ore' },
    { id: 'redstone_ore', name: 'Redstone Ore', category: 'ore', states: ['lit'] },
    { id: 'deepslate_redstone_ore', name: 'Deepslate Redstone Ore', category: 'ore', states: ['lit'] },
    { id: 'emerald_ore', name: 'Emerald Ore', category: 'ore' },
    { id: 'deepslate_emerald_ore', name: 'Deepslate Emerald Ore', category: 'ore' },
    { id: 'lapis_ore', name: 'Lapis Ore', category: 'ore' },
    { id: 'deepslate_lapis_ore', name: 'Deepslate Lapis Ore', category: 'ore' },
    { id: 'diamond_ore', name: 'Diamond Ore', category: 'ore' },
    { id: 'deepslate_diamond_ore', name: 'Deepslate Diamond Ore', category: 'ore' },
    { id: 'nether_gold_ore', name: 'Nether Gold Ore', category: 'ore' },
    { id: 'nether_quartz_ore', name: 'Nether Quartz Ore', category: 'ore' },
    { id: 'ancient_debris', name: 'Ancient Debris', category: 'ore' },

    // Mineral blocks
    { id: 'coal_block', name: 'Coal Block', category: 'mineral' },
    { id: 'iron_block', name: 'Iron Block', category: 'mineral' },
    { id: 'copper_block', name: 'Copper Block', category: 'mineral' },
    { id: 'gold_block', name: 'Gold Block', category: 'mineral' },
    { id: 'diamond_block', name: 'Diamond Block', category: 'mineral' },
    { id: 'emerald_block', name: 'Emerald Block', category: 'mineral' },
    { id: 'lapis_block', name: 'Lapis Block', category: 'mineral' },
    { id: 'redstone_block', name: 'Redstone Block', category: 'mineral' },
    { id: 'netherite_block', name: 'Netherite Block', category: 'mineral' },
    { id: 'raw_iron_block', name: 'Raw Iron Block', category: 'mineral' },
    { id: 'raw_copper_block', name: 'Raw Copper Block', category: 'mineral' },
    { id: 'raw_gold_block', name: 'Raw Gold Block', category: 'mineral' },
    { id: 'amethyst_block', name: 'Amethyst Block', category: 'mineral' },

    // Nether blocks
    { id: 'netherrack', name: 'Netherrack', category: 'nether' },
    { id: 'nether_bricks', name: 'Nether Bricks', category: 'nether' },
    { id: 'red_nether_bricks', name: 'Red Nether Bricks', category: 'nether' },
    { id: 'chiseled_nether_bricks', name: 'Chiseled Nether Bricks', category: 'nether' },
    { id: 'cracked_nether_bricks', name: 'Cracked Nether Bricks', category: 'nether' },
    { id: 'soul_sand', name: 'Soul Sand', category: 'nether' },
    { id: 'soul_soil', name: 'Soul Soil', category: 'nether' },
    { id: 'basalt', name: 'Basalt', category: 'nether', states: ['axis'] },
    { id: 'smooth_basalt', name: 'Smooth Basalt', category: 'nether' },
    { id: 'polished_basalt', name: 'Polished Basalt', category: 'nether', states: ['axis'] },
    { id: 'blackstone', name: 'Blackstone', category: 'nether' },
    { id: 'gilded_blackstone', name: 'Gilded Blackstone', category: 'nether' },
    { id: 'polished_blackstone', name: 'Polished Blackstone', category: 'nether' },
    { id: 'polished_blackstone_bricks', name: 'Polished Blackstone Bricks', category: 'nether' },
    { id: 'cracked_polished_blackstone_bricks', name: 'Cracked Polished Blackstone Bricks', category: 'nether' },
    { id: 'chiseled_polished_blackstone', name: 'Chiseled Polished Blackstone', category: 'nether' },
    { id: 'glowstone', name: 'Glowstone', category: 'nether' },
    { id: 'shroomlight', name: 'Shroomlight', category: 'nether' },
    { id: 'magma_block', name: 'Magma Block', category: 'nether' },

    // End blocks
    { id: 'end_stone', name: 'End Stone', category: 'end' },
    { id: 'end_stone_bricks', name: 'End Stone Bricks', category: 'end' },
    { id: 'purpur_block', name: 'Purpur Block', category: 'end' },
    { id: 'purpur_pillar', name: 'Purpur Pillar', category: 'end', states: ['axis'] },
    { id: 'chorus_plant', name: 'Chorus Plant', category: 'end' },
    { id: 'chorus_flower', name: 'Chorus Flower', category: 'end' },

    // Redstone
    { id: 'redstone_lamp', name: 'Redstone Lamp', category: 'redstone', states: ['lit'] },
    { id: 'redstone_torch', name: 'Redstone Torch', category: 'redstone', states: ['lit'] },
    { id: 'repeater', name: 'Repeater', category: 'redstone', states: ['facing', 'powered'] },
    { id: 'comparator', name: 'Comparator', category: 'redstone', states: ['facing', 'powered'] },
    { id: 'observer', name: 'Observer', category: 'redstone', states: ['facing', 'powered'] },
    { id: 'piston', name: 'Piston', category: 'redstone', states: ['facing'] },
    { id: 'sticky_piston', name: 'Sticky Piston', category: 'redstone', states: ['facing'] },
    { id: 'dispenser', name: 'Dispenser', category: 'redstone', states: ['facing'] },
    { id: 'dropper', name: 'Dropper', category: 'redstone', states: ['facing'] },
    { id: 'hopper', name: 'Hopper', category: 'redstone', states: ['facing'] },

    // Decoration
    { id: 'bookshelf', name: 'Bookshelf', category: 'decoration' },
    { id: 'sea_lantern', name: 'Sea Lantern', category: 'decoration' },
    { id: 'jack_o_lantern', name: "Jack o'Lantern", category: 'decoration', states: ['facing'] },
    { id: 'lantern', name: 'Lantern', category: 'decoration' },
    { id: 'soul_lantern', name: 'Soul Lantern', category: 'decoration' },
    { id: 'sponge', name: 'Sponge', category: 'decoration' },
    { id: 'wet_sponge', name: 'Wet Sponge', category: 'decoration' },

    // Functional blocks
    { id: 'chest', name: 'Chest', category: 'functional', states: ['facing', 'waterlogged'] },
    { id: 'trapped_chest', name: 'Trapped Chest', category: 'functional', states: ['facing', 'waterlogged'] },
    { id: 'furnace', name: 'Furnace', category: 'functional', states: ['facing', 'lit'] },
    { id: 'blast_furnace', name: 'Blast Furnace', category: 'functional', states: ['facing', 'lit'] },
    { id: 'smoker', name: 'Smoker', category: 'functional', states: ['facing', 'lit'] },
    { id: 'crafting_table', name: 'Crafting Table', category: 'functional' },
    { id: 'enchanting_table', name: 'Enchanting Table', category: 'functional' },
    { id: 'anvil', name: 'Anvil', category: 'functional', states: ['facing'] },
    { id: 'brewing_stand', name: 'Brewing Stand', category: 'functional' },
    { id: 'beacon', name: 'Beacon', category: 'functional' },
    { id: 'tnt', name: 'TNT', category: 'functional' },

    // Natural blocks
    { id: 'dirt', name: 'Dirt', category: 'natural' },
    { id: 'grass_block', name: 'Grass Block', category: 'natural' },
    { id: 'podzol', name: 'Podzol', category: 'natural' },
    { id: 'mycelium', name: 'Mycelium', category: 'natural' },
    { id: 'sand', name: 'Sand', category: 'natural' },
    { id: 'red_sand', name: 'Red Sand', category: 'natural' },
    { id: 'gravel', name: 'Gravel', category: 'natural' },
    { id: 'clay', name: 'Clay', category: 'natural' },
    { id: 'snow_block', name: 'Snow Block', category: 'natural' },
    { id: 'ice', name: 'Ice', category: 'natural' },
    { id: 'packed_ice', name: 'Packed Ice', category: 'natural' },
    { id: 'blue_ice', name: 'Blue Ice', category: 'natural' },
    { id: 'obsidian', name: 'Obsidian', category: 'natural' },
    { id: 'crying_obsidian', name: 'Crying Obsidian', category: 'natural' },
    { id: 'bedrock', name: 'Bedrock', category: 'natural' },
    { id: 'air', name: 'Air', category: 'natural' },
];

export const blockStates: Record<string, BlockState> = {
    axis: {
        name: 'axis',
        values: ['x', 'y', 'z'],
    },
    facing: {
        name: 'facing',
        values: ['north', 'south', 'east', 'west', 'up', 'down'],
    },
    half: {
        name: 'half',
        values: ['top', 'bottom'],
    },
    type: {
        name: 'type',
        values: ['single', 'double'],
    },
    waterlogged: {
        name: 'waterlogged',
        values: ['true', 'false'],
    },
    powered: {
        name: 'powered',
        values: ['true', 'false'],
    },
    lit: {
        name: 'lit',
        values: ['true', 'false'],
    },
    open: {
        name: 'open',
        values: ['true', 'false'],
    },
};

export const fillModes = [
    { id: 'replace', name: 'Replace', description: 'Replace all blocks in the region' },
    { id: 'destroy', name: 'Destroy', description: 'Replace blocks and drop items' },
    { id: 'hollow', name: 'Hollow', description: 'Fill only the outer shell' },
    { id: 'keep', name: 'Keep', description: 'Fill only air blocks' },
    { id: 'outline', name: 'Outline', description: 'Fill only the outer edges' },
];

export const cloneModes = [
    { id: 'replace', name: 'Replace', description: 'Replace all blocks in destination' },
    { id: 'masked', name: 'Masked', description: 'Copy only non-air blocks' },
];

export const cloneTypes = [
    { id: 'force', name: 'Force', description: 'Force clone even if regions overlap' },
    { id: 'move', name: 'Move', description: 'Move blocks (delete from source)' },
    { id: 'normal', name: 'Normal', description: 'Normal clone operation' },
];

export const coordinateTypes = [
    { id: 'absolute', symbol: '', name: 'Absolute', description: 'World coordinates' },
    { id: 'relative', symbol: '~', name: 'Relative', description: 'Relative to executor' },
    { id: 'local', symbol: '^', name: 'Local', description: 'Local to executor rotation' },
];

export interface FillPreset {
    name: string;
    description: string;
    tab: 'fill' | 'clone';
    config: {
        block?: string;
        fillMode?: string;
        cloneMode?: string;
        cloneType?: string;
    };
}

export const presets: FillPreset[] = [
    {
        name: 'Clear Area (Air)',
        description: 'Fill a region with air',
        tab: 'fill',
        config: {
            block: 'air',
            fillMode: 'replace',
        },
    },
    {
        name: 'Fill Floor',
        description: 'Create a solid floor',
        tab: 'fill',
        config: {
            block: 'stone',
            fillMode: 'replace',
        },
    },
    {
        name: 'Hollow Box',
        description: 'Create a hollow structure',
        tab: 'fill',
        config: {
            block: 'glass',
            fillMode: 'hollow',
        },
    },
    {
        name: 'Replace Block Type',
        description: 'Replace specific blocks',
        tab: 'fill',
        config: {
            block: 'stone',
            fillMode: 'replace',
        },
    },
    {
        name: 'Clone Structure',
        description: 'Copy a structure to another location',
        tab: 'clone',
        config: {
            cloneMode: 'replace',
            cloneType: 'normal',
        },
    },
];
