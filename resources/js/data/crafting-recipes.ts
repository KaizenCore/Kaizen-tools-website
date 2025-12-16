export interface Recipe {
    id: string;
    name: string;
    category:
        | 'tools'
        | 'weapons'
        | 'armor'
        | 'building'
        | 'redstone'
        | 'food'
        | 'decoration'
        | 'transportation'
        | 'misc';
    output: { item: string; count: number };
    pattern: (string | null)[][]; // 3x3 grid, null for empty
    ingredients: Record<string, string>; // key -> item name mapping
    shapeless?: boolean;
}

export const craftingRecipes: Recipe[] = [
    // Tools
    {
        id: 'wooden_pickaxe',
        name: 'Wooden Pickaxe',
        category: 'tools',
        output: { item: 'wooden_pickaxe', count: 1 },
        pattern: [
            ['P', 'P', 'P'],
            [null, 'S', null],
            [null, 'S', null],
        ],
        ingredients: { P: 'Planks', S: 'Stick' },
    },
    {
        id: 'stone_pickaxe',
        name: 'Stone Pickaxe',
        category: 'tools',
        output: { item: 'stone_pickaxe', count: 1 },
        pattern: [
            ['C', 'C', 'C'],
            [null, 'S', null],
            [null, 'S', null],
        ],
        ingredients: { C: 'Cobblestone', S: 'Stick' },
    },
    {
        id: 'iron_pickaxe',
        name: 'Iron Pickaxe',
        category: 'tools',
        output: { item: 'iron_pickaxe', count: 1 },
        pattern: [
            ['I', 'I', 'I'],
            [null, 'S', null],
            [null, 'S', null],
        ],
        ingredients: { I: 'Iron Ingot', S: 'Stick' },
    },
    {
        id: 'golden_pickaxe',
        name: 'Golden Pickaxe',
        category: 'tools',
        output: { item: 'golden_pickaxe', count: 1 },
        pattern: [
            ['G', 'G', 'G'],
            [null, 'S', null],
            [null, 'S', null],
        ],
        ingredients: { G: 'Gold Ingot', S: 'Stick' },
    },
    {
        id: 'diamond_pickaxe',
        name: 'Diamond Pickaxe',
        category: 'tools',
        output: { item: 'diamond_pickaxe', count: 1 },
        pattern: [
            ['D', 'D', 'D'],
            [null, 'S', null],
            [null, 'S', null],
        ],
        ingredients: { D: 'Diamond', S: 'Stick' },
    },
    {
        id: 'wooden_axe',
        name: 'Wooden Axe',
        category: 'tools',
        output: { item: 'wooden_axe', count: 1 },
        pattern: [
            ['P', 'P', null],
            ['P', 'S', null],
            [null, 'S', null],
        ],
        ingredients: { P: 'Planks', S: 'Stick' },
    },
    {
        id: 'stone_axe',
        name: 'Stone Axe',
        category: 'tools',
        output: { item: 'stone_axe', count: 1 },
        pattern: [
            ['C', 'C', null],
            ['C', 'S', null],
            [null, 'S', null],
        ],
        ingredients: { C: 'Cobblestone', S: 'Stick' },
    },
    {
        id: 'iron_axe',
        name: 'Iron Axe',
        category: 'tools',
        output: { item: 'iron_axe', count: 1 },
        pattern: [
            ['I', 'I', null],
            ['I', 'S', null],
            [null, 'S', null],
        ],
        ingredients: { I: 'Iron Ingot', S: 'Stick' },
    },
    {
        id: 'wooden_shovel',
        name: 'Wooden Shovel',
        category: 'tools',
        output: { item: 'wooden_shovel', count: 1 },
        pattern: [
            [null, 'P', null],
            [null, 'S', null],
            [null, 'S', null],
        ],
        ingredients: { P: 'Planks', S: 'Stick' },
    },
    {
        id: 'stone_shovel',
        name: 'Stone Shovel',
        category: 'tools',
        output: { item: 'stone_shovel', count: 1 },
        pattern: [
            [null, 'C', null],
            [null, 'S', null],
            [null, 'S', null],
        ],
        ingredients: { C: 'Cobblestone', S: 'Stick' },
    },
    {
        id: 'wooden_hoe',
        name: 'Wooden Hoe',
        category: 'tools',
        output: { item: 'wooden_hoe', count: 1 },
        pattern: [
            ['P', 'P', null],
            [null, 'S', null],
            [null, 'S', null],
        ],
        ingredients: { P: 'Planks', S: 'Stick' },
    },
    {
        id: 'stone_hoe',
        name: 'Stone Hoe',
        category: 'tools',
        output: { item: 'stone_hoe', count: 1 },
        pattern: [
            ['C', 'C', null],
            [null, 'S', null],
            [null, 'S', null],
        ],
        ingredients: { C: 'Cobblestone', S: 'Stick' },
    },

    // Weapons
    {
        id: 'wooden_sword',
        name: 'Wooden Sword',
        category: 'weapons',
        output: { item: 'wooden_sword', count: 1 },
        pattern: [
            [null, 'P', null],
            [null, 'P', null],
            [null, 'S', null],
        ],
        ingredients: { P: 'Planks', S: 'Stick' },
    },
    {
        id: 'stone_sword',
        name: 'Stone Sword',
        category: 'weapons',
        output: { item: 'stone_sword', count: 1 },
        pattern: [
            [null, 'C', null],
            [null, 'C', null],
            [null, 'S', null],
        ],
        ingredients: { C: 'Cobblestone', S: 'Stick' },
    },
    {
        id: 'iron_sword',
        name: 'Iron Sword',
        category: 'weapons',
        output: { item: 'iron_sword', count: 1 },
        pattern: [
            [null, 'I', null],
            [null, 'I', null],
            [null, 'S', null],
        ],
        ingredients: { I: 'Iron Ingot', S: 'Stick' },
    },
    {
        id: 'golden_sword',
        name: 'Golden Sword',
        category: 'weapons',
        output: { item: 'golden_sword', count: 1 },
        pattern: [
            [null, 'G', null],
            [null, 'G', null],
            [null, 'S', null],
        ],
        ingredients: { G: 'Gold Ingot', S: 'Stick' },
    },
    {
        id: 'diamond_sword',
        name: 'Diamond Sword',
        category: 'weapons',
        output: { item: 'diamond_sword', count: 1 },
        pattern: [
            [null, 'D', null],
            [null, 'D', null],
            [null, 'S', null],
        ],
        ingredients: { D: 'Diamond', S: 'Stick' },
    },
    {
        id: 'bow',
        name: 'Bow',
        category: 'weapons',
        output: { item: 'bow', count: 1 },
        pattern: [
            [null, 'S', 'T'],
            ['S', null, 'T'],
            [null, 'S', 'T'],
        ],
        ingredients: { S: 'Stick', T: 'String' },
    },
    {
        id: 'arrow',
        name: 'Arrow',
        category: 'weapons',
        output: { item: 'arrow', count: 4 },
        pattern: [
            [null, 'F', null],
            [null, 'S', null],
            [null, 'E', null],
        ],
        ingredients: { F: 'Flint', S: 'Stick', E: 'Feather' },
    },

    // Armor
    {
        id: 'leather_helmet',
        name: 'Leather Helmet',
        category: 'armor',
        output: { item: 'leather_helmet', count: 1 },
        pattern: [
            ['L', 'L', 'L'],
            ['L', null, 'L'],
            [null, null, null],
        ],
        ingredients: { L: 'Leather' },
    },
    {
        id: 'leather_chestplate',
        name: 'Leather Chestplate',
        category: 'armor',
        output: { item: 'leather_chestplate', count: 1 },
        pattern: [
            ['L', null, 'L'],
            ['L', 'L', 'L'],
            ['L', 'L', 'L'],
        ],
        ingredients: { L: 'Leather' },
    },
    {
        id: 'leather_leggings',
        name: 'Leather Leggings',
        category: 'armor',
        output: { item: 'leather_leggings', count: 1 },
        pattern: [
            ['L', 'L', 'L'],
            ['L', null, 'L'],
            ['L', null, 'L'],
        ],
        ingredients: { L: 'Leather' },
    },
    {
        id: 'leather_boots',
        name: 'Leather Boots',
        category: 'armor',
        output: { item: 'leather_boots', count: 1 },
        pattern: [
            [null, null, null],
            ['L', null, 'L'],
            ['L', null, 'L'],
        ],
        ingredients: { L: 'Leather' },
    },
    {
        id: 'iron_helmet',
        name: 'Iron Helmet',
        category: 'armor',
        output: { item: 'iron_helmet', count: 1 },
        pattern: [
            ['I', 'I', 'I'],
            ['I', null, 'I'],
            [null, null, null],
        ],
        ingredients: { I: 'Iron Ingot' },
    },
    {
        id: 'iron_chestplate',
        name: 'Iron Chestplate',
        category: 'armor',
        output: { item: 'iron_chestplate', count: 1 },
        pattern: [
            ['I', null, 'I'],
            ['I', 'I', 'I'],
            ['I', 'I', 'I'],
        ],
        ingredients: { I: 'Iron Ingot' },
    },
    {
        id: 'diamond_helmet',
        name: 'Diamond Helmet',
        category: 'armor',
        output: { item: 'diamond_helmet', count: 1 },
        pattern: [
            ['D', 'D', 'D'],
            ['D', null, 'D'],
            [null, null, null],
        ],
        ingredients: { D: 'Diamond' },
    },
    {
        id: 'shield',
        name: 'Shield',
        category: 'armor',
        output: { item: 'shield', count: 1 },
        pattern: [
            ['P', 'I', 'P'],
            ['P', 'P', 'P'],
            [null, 'P', null],
        ],
        ingredients: { P: 'Planks', I: 'Iron Ingot' },
    },

    // Building
    {
        id: 'crafting_table',
        name: 'Crafting Table',
        category: 'building',
        output: { item: 'crafting_table', count: 1 },
        pattern: [
            ['P', 'P', null],
            ['P', 'P', null],
            [null, null, null],
        ],
        ingredients: { P: 'Planks' },
    },
    {
        id: 'chest',
        name: 'Chest',
        category: 'building',
        output: { item: 'chest', count: 1 },
        pattern: [
            ['P', 'P', 'P'],
            ['P', null, 'P'],
            ['P', 'P', 'P'],
        ],
        ingredients: { P: 'Planks' },
    },
    {
        id: 'furnace',
        name: 'Furnace',
        category: 'building',
        output: { item: 'furnace', count: 1 },
        pattern: [
            ['C', 'C', 'C'],
            ['C', null, 'C'],
            ['C', 'C', 'C'],
        ],
        ingredients: { C: 'Cobblestone' },
    },
    {
        id: 'stick',
        name: 'Stick',
        category: 'building',
        output: { item: 'stick', count: 4 },
        pattern: [
            [null, null, null],
            [null, 'P', null],
            [null, 'P', null],
        ],
        ingredients: { P: 'Planks' },
    },
    {
        id: 'torch',
        name: 'Torch',
        category: 'building',
        output: { item: 'torch', count: 4 },
        pattern: [
            [null, null, null],
            [null, 'C', null],
            [null, 'S', null],
        ],
        ingredients: { C: 'Coal', S: 'Stick' },
    },
    {
        id: 'ladder',
        name: 'Ladder',
        category: 'building',
        output: { item: 'ladder', count: 3 },
        pattern: [
            ['S', null, 'S'],
            ['S', 'S', 'S'],
            ['S', null, 'S'],
        ],
        ingredients: { S: 'Stick' },
    },
    {
        id: 'door',
        name: 'Wooden Door',
        category: 'building',
        output: { item: 'wooden_door', count: 3 },
        pattern: [
            ['P', 'P', null],
            ['P', 'P', null],
            ['P', 'P', null],
        ],
        ingredients: { P: 'Planks' },
    },
    {
        id: 'fence',
        name: 'Fence',
        category: 'building',
        output: { item: 'fence', count: 3 },
        pattern: [
            [null, null, null],
            ['P', 'S', 'P'],
            ['P', 'S', 'P'],
        ],
        ingredients: { P: 'Planks', S: 'Stick' },
    },
    {
        id: 'fence_gate',
        name: 'Fence Gate',
        category: 'building',
        output: { item: 'fence_gate', count: 1 },
        pattern: [
            [null, null, null],
            ['S', 'P', 'S'],
            ['S', 'P', 'S'],
        ],
        ingredients: { S: 'Stick', P: 'Planks' },
    },
    {
        id: 'stone_bricks',
        name: 'Stone Bricks',
        category: 'building',
        output: { item: 'stone_bricks', count: 4 },
        pattern: [
            ['S', 'S', null],
            ['S', 'S', null],
            [null, null, null],
        ],
        ingredients: { S: 'Stone' },
    },
    {
        id: 'bookshelf',
        name: 'Bookshelf',
        category: 'building',
        output: { item: 'bookshelf', count: 1 },
        pattern: [
            ['P', 'P', 'P'],
            ['B', 'B', 'B'],
            ['P', 'P', 'P'],
        ],
        ingredients: { P: 'Planks', B: 'Book' },
    },

    // Redstone
    {
        id: 'redstone_torch',
        name: 'Redstone Torch',
        category: 'redstone',
        output: { item: 'redstone_torch', count: 1 },
        pattern: [
            [null, null, null],
            [null, 'R', null],
            [null, 'S', null],
        ],
        ingredients: { R: 'Redstone', S: 'Stick' },
    },
    {
        id: 'lever',
        name: 'Lever',
        category: 'redstone',
        output: { item: 'lever', count: 1 },
        pattern: [
            [null, null, null],
            [null, 'S', null],
            [null, 'C', null],
        ],
        ingredients: { S: 'Stick', C: 'Cobblestone' },
    },
    {
        id: 'button',
        name: 'Stone Button',
        category: 'redstone',
        output: { item: 'stone_button', count: 1 },
        pattern: [
            [null, null, null],
            [null, 'S', null],
            [null, null, null],
        ],
        ingredients: { S: 'Stone' },
    },
    {
        id: 'pressure_plate',
        name: 'Wooden Pressure Plate',
        category: 'redstone',
        output: { item: 'wooden_pressure_plate', count: 1 },
        pattern: [
            [null, null, null],
            ['P', 'P', null],
            [null, null, null],
        ],
        ingredients: { P: 'Planks' },
    },
    {
        id: 'stone_pressure_plate',
        name: 'Stone Pressure Plate',
        category: 'redstone',
        output: { item: 'stone_pressure_plate', count: 1 },
        pattern: [
            [null, null, null],
            ['S', 'S', null],
            [null, null, null],
        ],
        ingredients: { S: 'Stone' },
    },
    {
        id: 'piston',
        name: 'Piston',
        category: 'redstone',
        output: { item: 'piston', count: 1 },
        pattern: [
            ['P', 'P', 'P'],
            ['C', 'I', 'C'],
            ['C', 'R', 'C'],
        ],
        ingredients: { P: 'Planks', C: 'Cobblestone', I: 'Iron Ingot', R: 'Redstone' },
    },
    {
        id: 'sticky_piston',
        name: 'Sticky Piston',
        category: 'redstone',
        output: { item: 'sticky_piston', count: 1 },
        pattern: [
            [null, null, null],
            [null, 'S', null],
            [null, 'P', null],
        ],
        ingredients: { S: 'Slimeball', P: 'Piston' },
    },
    {
        id: 'repeater',
        name: 'Redstone Repeater',
        category: 'redstone',
        output: { item: 'repeater', count: 1 },
        pattern: [
            [null, null, null],
            ['T', 'R', 'T'],
            ['S', 'S', 'S'],
        ],
        ingredients: { T: 'Redstone Torch', R: 'Redstone', S: 'Stone' },
    },
    {
        id: 'comparator',
        name: 'Redstone Comparator',
        category: 'redstone',
        output: { item: 'comparator', count: 1 },
        pattern: [
            [null, 'T', null],
            ['T', 'Q', 'T'],
            ['S', 'S', 'S'],
        ],
        ingredients: { T: 'Redstone Torch', Q: 'Quartz', S: 'Stone' },
    },

    // Food
    {
        id: 'bread',
        name: 'Bread',
        category: 'food',
        output: { item: 'bread', count: 1 },
        pattern: [
            [null, null, null],
            ['W', 'W', 'W'],
            [null, null, null],
        ],
        ingredients: { W: 'Wheat' },
    },
    {
        id: 'golden_apple',
        name: 'Golden Apple',
        category: 'food',
        output: { item: 'golden_apple', count: 1 },
        pattern: [
            ['G', 'G', 'G'],
            ['G', 'A', 'G'],
            ['G', 'G', 'G'],
        ],
        ingredients: { G: 'Gold Ingot', A: 'Apple' },
    },
    {
        id: 'cookie',
        name: 'Cookie',
        category: 'food',
        output: { item: 'cookie', count: 8 },
        pattern: [
            [null, null, null],
            ['W', 'C', 'W'],
            [null, null, null],
        ],
        ingredients: { W: 'Wheat', C: 'Cocoa Beans' },
    },
    {
        id: 'cake',
        name: 'Cake',
        category: 'food',
        output: { item: 'cake', count: 1 },
        pattern: [
            ['M', 'M', 'M'],
            ['S', 'E', 'S'],
            ['W', 'W', 'W'],
        ],
        ingredients: { M: 'Milk Bucket', S: 'Sugar', E: 'Egg', W: 'Wheat' },
    },
    {
        id: 'mushroom_stew',
        name: 'Mushroom Stew',
        category: 'food',
        output: { item: 'mushroom_stew', count: 1 },
        pattern: [
            [null, null, null],
            ['R', 'B', null],
            [null, 'W', null],
        ],
        ingredients: { R: 'Red Mushroom', B: 'Brown Mushroom', W: 'Bowl' },
        shapeless: true,
    },

    // Decoration
    {
        id: 'painting',
        name: 'Painting',
        category: 'decoration',
        output: { item: 'painting', count: 1 },
        pattern: [
            ['S', 'S', 'S'],
            ['S', 'W', 'S'],
            ['S', 'S', 'S'],
        ],
        ingredients: { S: 'Stick', W: 'Wool' },
    },
    {
        id: 'item_frame',
        name: 'Item Frame',
        category: 'decoration',
        output: { item: 'item_frame', count: 1 },
        pattern: [
            ['S', 'S', 'S'],
            ['S', 'L', 'S'],
            ['S', 'S', 'S'],
        ],
        ingredients: { S: 'Stick', L: 'Leather' },
    },
    {
        id: 'flower_pot',
        name: 'Flower Pot',
        category: 'decoration',
        output: { item: 'flower_pot', count: 1 },
        pattern: [
            [null, null, null],
            ['B', null, 'B'],
            [null, 'B', null],
        ],
        ingredients: { B: 'Brick' },
    },
    {
        id: 'bed',
        name: 'Bed',
        category: 'decoration',
        output: { item: 'bed', count: 1 },
        pattern: [
            [null, null, null],
            ['W', 'W', 'W'],
            ['P', 'P', 'P'],
        ],
        ingredients: { W: 'Wool', P: 'Planks' },
    },

    // Transportation
    {
        id: 'minecart',
        name: 'Minecart',
        category: 'transportation',
        output: { item: 'minecart', count: 1 },
        pattern: [
            [null, null, null],
            ['I', null, 'I'],
            ['I', 'I', 'I'],
        ],
        ingredients: { I: 'Iron Ingot' },
    },
    {
        id: 'powered_rail',
        name: 'Powered Rail',
        category: 'transportation',
        output: { item: 'powered_rail', count: 6 },
        pattern: [
            ['G', null, 'G'],
            ['G', 'S', 'G'],
            ['G', 'R', 'G'],
        ],
        ingredients: { G: 'Gold Ingot', S: 'Stick', R: 'Redstone' },
    },
    {
        id: 'rail',
        name: 'Rail',
        category: 'transportation',
        output: { item: 'rail', count: 16 },
        pattern: [
            ['I', null, 'I'],
            ['I', 'S', 'I'],
            ['I', null, 'I'],
        ],
        ingredients: { I: 'Iron Ingot', S: 'Stick' },
    },
    {
        id: 'boat',
        name: 'Boat',
        category: 'transportation',
        output: { item: 'boat', count: 1 },
        pattern: [
            [null, null, null],
            ['P', null, 'P'],
            ['P', 'P', 'P'],
        ],
        ingredients: { P: 'Planks' },
    },

    // Misc
    {
        id: 'paper',
        name: 'Paper',
        category: 'misc',
        output: { item: 'paper', count: 3 },
        pattern: [
            [null, null, null],
            ['S', 'S', 'S'],
            [null, null, null],
        ],
        ingredients: { S: 'Sugar Cane' },
    },
    {
        id: 'book',
        name: 'Book',
        category: 'misc',
        output: { item: 'book', count: 1 },
        pattern: [
            [null, null, null],
            ['P', 'P', 'P'],
            [null, null, null],
        ],
        ingredients: { P: 'Paper' },
        shapeless: true,
    },
    {
        id: 'enchanting_table',
        name: 'Enchanting Table',
        category: 'misc',
        output: { item: 'enchanting_table', count: 1 },
        pattern: [
            [null, 'B', null],
            ['D', 'O', 'D'],
            ['O', 'O', 'O'],
        ],
        ingredients: { B: 'Book', D: 'Diamond', O: 'Obsidian' },
    },
    {
        id: 'brewing_stand',
        name: 'Brewing Stand',
        category: 'misc',
        output: { item: 'brewing_stand', count: 1 },
        pattern: [
            [null, null, null],
            [null, 'B', null],
            ['C', 'C', 'C'],
        ],
        ingredients: { B: 'Blaze Rod', C: 'Cobblestone' },
    },
    {
        id: 'anvil',
        name: 'Anvil',
        category: 'misc',
        output: { item: 'anvil', count: 1 },
        pattern: [
            ['B', 'B', 'B'],
            [null, 'I', null],
            ['I', 'I', 'I'],
        ],
        ingredients: { B: 'Block of Iron', I: 'Iron Ingot' },
    },
    {
        id: 'shears',
        name: 'Shears',
        category: 'misc',
        output: { item: 'shears', count: 1 },
        pattern: [
            [null, null, null],
            [null, 'I', null],
            ['I', null, null],
        ],
        ingredients: { I: 'Iron Ingot' },
    },
    {
        id: 'bucket',
        name: 'Bucket',
        category: 'misc',
        output: { item: 'bucket', count: 1 },
        pattern: [
            [null, null, null],
            ['I', null, 'I'],
            [null, 'I', null],
        ],
        ingredients: { I: 'Iron Ingot' },
    },
    {
        id: 'fishing_rod',
        name: 'Fishing Rod',
        category: 'misc',
        output: { item: 'fishing_rod', count: 1 },
        pattern: [
            [null, null, 'S'],
            [null, 'S', 'T'],
            ['S', null, 'T'],
        ],
        ingredients: { S: 'Stick', T: 'String' },
    },
    {
        id: 'compass',
        name: 'Compass',
        category: 'misc',
        output: { item: 'compass', count: 1 },
        pattern: [
            [null, 'I', null],
            ['I', 'R', 'I'],
            [null, 'I', null],
        ],
        ingredients: { I: 'Iron Ingot', R: 'Redstone' },
    },
    {
        id: 'clock',
        name: 'Clock',
        category: 'misc',
        output: { item: 'clock', count: 1 },
        pattern: [
            [null, 'G', null],
            ['G', 'R', 'G'],
            [null, 'G', null],
        ],
        ingredients: { G: 'Gold Ingot', R: 'Redstone' },
    },
];
