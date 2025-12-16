export interface LootTableType {
    id: string;
    name: string;
    description: string;
}

export interface MinecraftItem {
    id: string;
    name: string;
    category: string;
}

export interface LootFunction {
    id: string;
    name: string;
    description: string;
    parameters: {
        name: string;
        type: 'number' | 'string' | 'boolean' | 'range';
        default?: any;
    }[];
}

export interface LootCondition {
    id: string;
    name: string;
    description: string;
    parameters: {
        name: string;
        type: 'number' | 'string' | 'boolean';
        default?: any;
    }[];
}

export interface LootTablePreset {
    id: string;
    name: string;
    description: string;
    tableType: string;
    pools: any[];
}

export const lootTableTypes: LootTableType[] = [
    { id: 'block', name: 'Block', description: 'Drops from breaking blocks' },
    { id: 'chest', name: 'Chest', description: 'Chest loot (dungeons, temples, etc.)' },
    { id: 'entity', name: 'Entity', description: 'Drops from killing mobs' },
    { id: 'fishing', name: 'Fishing', description: 'Items caught while fishing' },
    { id: 'gameplay', name: 'Gameplay', description: 'Special gameplay loot' },
];

export const minecraftItems: MinecraftItem[] = [
    // Common items
    { id: 'minecraft:diamond', name: 'Diamond', category: 'materials' },
    { id: 'minecraft:iron_ingot', name: 'Iron Ingot', category: 'materials' },
    { id: 'minecraft:gold_ingot', name: 'Gold Ingot', category: 'materials' },
    { id: 'minecraft:emerald', name: 'Emerald', category: 'materials' },
    { id: 'minecraft:coal', name: 'Coal', category: 'materials' },
    { id: 'minecraft:redstone', name: 'Redstone', category: 'materials' },
    { id: 'minecraft:lapis_lazuli', name: 'Lapis Lazuli', category: 'materials' },
    { id: 'minecraft:copper_ingot', name: 'Copper Ingot', category: 'materials' },
    { id: 'minecraft:netherite_ingot', name: 'Netherite Ingot', category: 'materials' },

    // Tools
    { id: 'minecraft:diamond_sword', name: 'Diamond Sword', category: 'tools' },
    { id: 'minecraft:diamond_pickaxe', name: 'Diamond Pickaxe', category: 'tools' },
    { id: 'minecraft:diamond_axe', name: 'Diamond Axe', category: 'tools' },
    { id: 'minecraft:diamond_shovel', name: 'Diamond Shovel', category: 'tools' },
    { id: 'minecraft:diamond_hoe', name: 'Diamond Hoe', category: 'tools' },
    { id: 'minecraft:iron_sword', name: 'Iron Sword', category: 'tools' },
    { id: 'minecraft:bow', name: 'Bow', category: 'tools' },
    { id: 'minecraft:fishing_rod', name: 'Fishing Rod', category: 'tools' },

    // Armor
    { id: 'minecraft:diamond_helmet', name: 'Diamond Helmet', category: 'armor' },
    { id: 'minecraft:diamond_chestplate', name: 'Diamond Chestplate', category: 'armor' },
    { id: 'minecraft:diamond_leggings', name: 'Diamond Leggings', category: 'armor' },
    { id: 'minecraft:diamond_boots', name: 'Diamond Boots', category: 'armor' },
    { id: 'minecraft:iron_helmet', name: 'Iron Helmet', category: 'armor' },
    { id: 'minecraft:chainmail_helmet', name: 'Chainmail Helmet', category: 'armor' },

    // Food
    { id: 'minecraft:apple', name: 'Apple', category: 'food' },
    { id: 'minecraft:golden_apple', name: 'Golden Apple', category: 'food' },
    { id: 'minecraft:enchanted_golden_apple', name: 'Enchanted Golden Apple', category: 'food' },
    { id: 'minecraft:bread', name: 'Bread', category: 'food' },
    { id: 'minecraft:cooked_beef', name: 'Cooked Beef', category: 'food' },

    // Blocks
    { id: 'minecraft:dirt', name: 'Dirt', category: 'blocks' },
    { id: 'minecraft:stone', name: 'Stone', category: 'blocks' },
    { id: 'minecraft:cobblestone', name: 'Cobblestone', category: 'blocks' },
    { id: 'minecraft:oak_log', name: 'Oak Log', category: 'blocks' },
    { id: 'minecraft:diamond_ore', name: 'Diamond Ore', category: 'blocks' },
    { id: 'minecraft:iron_ore', name: 'Iron Ore', category: 'blocks' },
    { id: 'minecraft:gold_ore', name: 'Gold Ore', category: 'blocks' },
    { id: 'minecraft:deepslate_diamond_ore', name: 'Deepslate Diamond Ore', category: 'blocks' },

    // Special items
    { id: 'minecraft:saddle', name: 'Saddle', category: 'special' },
    { id: 'minecraft:name_tag', name: 'Name Tag', category: 'special' },
    { id: 'minecraft:music_disc_13', name: 'Music Disc (13)', category: 'special' },
    { id: 'minecraft:book', name: 'Book', category: 'special' },
    { id: 'minecraft:enchanted_book', name: 'Enchanted Book', category: 'special' },
    { id: 'minecraft:ender_pearl', name: 'Ender Pearl', category: 'special' },
    { id: 'minecraft:blaze_rod', name: 'Blaze Rod', category: 'special' },
    { id: 'minecraft:nether_star', name: 'Nether Star', category: 'special' },
    { id: 'minecraft:totem_of_undying', name: 'Totem of Undying', category: 'special' },
    { id: 'minecraft:elytra', name: 'Elytra', category: 'special' },
];

export const lootFunctions: LootFunction[] = [
    {
        id: 'set_count',
        name: 'Set Count',
        description: 'Sets the stack size',
        parameters: [
            {
                name: 'count',
                type: 'range',
                default: { min: 1, max: 1 },
            },
        ],
    },
    {
        id: 'set_damage',
        name: 'Set Damage',
        description: 'Sets item damage/durability',
        parameters: [
            {
                name: 'damage',
                type: 'range',
                default: { min: 0, max: 0.5 },
            },
        ],
    },
    {
        id: 'enchant_randomly',
        name: 'Enchant Randomly',
        description: 'Adds random enchantments',
        parameters: [],
    },
    {
        id: 'enchant_with_levels',
        name: 'Enchant with Levels',
        description: 'Enchants with specified level range',
        parameters: [
            {
                name: 'levels',
                type: 'range',
                default: { min: 1, max: 30 },
            },
            {
                name: 'treasure',
                type: 'boolean',
                default: false,
            },
        ],
    },
    {
        id: 'set_nbt',
        name: 'Set NBT',
        description: 'Sets custom NBT data',
        parameters: [
            {
                name: 'tag',
                type: 'string',
                default: '{}',
            },
        ],
    },
    {
        id: 'set_name',
        name: 'Set Name',
        description: 'Sets custom item name',
        parameters: [
            {
                name: 'name',
                type: 'string',
                default: '',
            },
        ],
    },
    {
        id: 'set_lore',
        name: 'Set Lore',
        description: 'Sets item lore text',
        parameters: [
            {
                name: 'lore',
                type: 'string',
                default: '',
            },
        ],
    },
    {
        id: 'looting_enchant',
        name: 'Looting Enchant',
        description: 'Increases count based on looting level',
        parameters: [
            {
                name: 'count',
                type: 'number',
                default: 1,
            },
        ],
    },
    {
        id: 'fortune_bonus',
        name: 'Fortune Bonus',
        description: 'Increases count based on fortune level',
        parameters: [
            {
                name: 'multiplier',
                type: 'number',
                default: 1,
            },
        ],
    },
];

export const lootConditions: LootCondition[] = [
    {
        id: 'random_chance',
        name: 'Random Chance',
        description: 'Drops with a percentage chance',
        parameters: [
            {
                name: 'chance',
                type: 'number',
                default: 0.5,
            },
        ],
    },
    {
        id: 'random_chance_with_looting',
        name: 'Random Chance with Looting',
        description: 'Chance increases with looting',
        parameters: [
            {
                name: 'chance',
                type: 'number',
                default: 0.5,
            },
            {
                name: 'looting_multiplier',
                type: 'number',
                default: 0.01,
            },
        ],
    },
    {
        id: 'killed_by_player',
        name: 'Killed by Player',
        description: 'Only drops if killed by a player',
        parameters: [],
    },
    {
        id: 'entity_properties',
        name: 'Entity Properties',
        description: 'Checks entity properties',
        parameters: [
            {
                name: 'property',
                type: 'string',
                default: 'on_fire',
            },
        ],
    },
    {
        id: 'match_tool',
        name: 'Match Tool',
        description: 'Requires specific tool',
        parameters: [
            {
                name: 'tool',
                type: 'string',
                default: 'minecraft:diamond_pickaxe',
            },
        ],
    },
    {
        id: 'survives_explosion',
        name: 'Survives Explosion',
        description: 'Only drops if not destroyed by explosion',
        parameters: [],
    },
    {
        id: 'block_state_property',
        name: 'Block State Property',
        description: 'Checks block state',
        parameters: [
            {
                name: 'property',
                type: 'string',
                default: 'age',
            },
            {
                name: 'value',
                type: 'string',
                default: '7',
            },
        ],
    },
];

export const lootTablePresets: LootTablePreset[] = [
    {
        id: 'simple_drop',
        name: 'Simple Drop',
        description: 'A single item drop (like dirt from dirt block)',
        tableType: 'block',
        pools: [
            {
                rolls: 1,
                entries: [
                    {
                        type: 'item',
                        name: 'minecraft:dirt',
                        weight: 1,
                        functions: [],
                        conditions: [],
                    },
                ],
                conditions: [],
            },
        ],
    },
    {
        id: 'fortune_affected',
        name: 'Fortune Affected',
        description: 'Drops more with fortune enchantment',
        tableType: 'block',
        pools: [
            {
                rolls: 1,
                entries: [
                    {
                        type: 'item',
                        name: 'minecraft:diamond',
                        weight: 1,
                        functions: [
                            {
                                function: 'fortune_bonus',
                                parameters: { multiplier: 1 },
                            },
                        ],
                        conditions: [],
                    },
                ],
                conditions: [],
            },
        ],
    },
    {
        id: 'silk_touch_required',
        name: 'Silk Touch Required',
        description: 'Different drops with/without silk touch',
        tableType: 'block',
        pools: [
            {
                rolls: 1,
                entries: [
                    {
                        type: 'item',
                        name: 'minecraft:diamond_ore',
                        weight: 1,
                        functions: [],
                        conditions: [
                            {
                                condition: 'match_tool',
                                parameters: { tool: 'minecraft:diamond_pickaxe' },
                            },
                        ],
                    },
                    {
                        type: 'item',
                        name: 'minecraft:diamond',
                        weight: 1,
                        functions: [
                            {
                                function: 'fortune_bonus',
                                parameters: { multiplier: 1 },
                            },
                        ],
                        conditions: [],
                    },
                ],
                conditions: [],
            },
        ],
    },
    {
        id: 'rare_mob_drop',
        name: 'Rare Mob Drop',
        description: 'Rare drop from mob with looting bonus',
        tableType: 'entity',
        pools: [
            {
                rolls: 1,
                entries: [
                    {
                        type: 'item',
                        name: 'minecraft:emerald',
                        weight: 1,
                        functions: [
                            {
                                function: 'looting_enchant',
                                parameters: { count: 1 },
                            },
                        ],
                        conditions: [
                            {
                                condition: 'random_chance_with_looting',
                                parameters: { chance: 0.025, looting_multiplier: 0.01 },
                            },
                            {
                                condition: 'killed_by_player',
                                parameters: {},
                            },
                        ],
                    },
                ],
                conditions: [],
            },
        ],
    },
    {
        id: 'treasure_chest',
        name: 'Treasure Chest',
        description: 'Multiple weighted items for a chest',
        tableType: 'chest',
        pools: [
            {
                rolls: { min: 3, max: 5 },
                entries: [
                    {
                        type: 'item',
                        name: 'minecraft:diamond',
                        weight: 5,
                        functions: [
                            {
                                function: 'set_count',
                                parameters: { count: { min: 1, max: 3 } },
                            },
                        ],
                        conditions: [],
                    },
                    {
                        type: 'item',
                        name: 'minecraft:emerald',
                        weight: 10,
                        functions: [
                            {
                                function: 'set_count',
                                parameters: { count: { min: 1, max: 5 } },
                            },
                        ],
                        conditions: [],
                    },
                    {
                        type: 'item',
                        name: 'minecraft:iron_ingot',
                        weight: 20,
                        functions: [
                            {
                                function: 'set_count',
                                parameters: { count: { min: 2, max: 8 } },
                            },
                        ],
                        conditions: [],
                    },
                    {
                        type: 'item',
                        name: 'minecraft:golden_apple',
                        weight: 2,
                        functions: [],
                        conditions: [],
                    },
                ],
                conditions: [],
            },
        ],
    },
];

export const itemCategories = [
    'materials',
    'tools',
    'armor',
    'food',
    'blocks',
    'special',
];
