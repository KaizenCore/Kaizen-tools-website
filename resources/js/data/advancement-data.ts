export interface FrameType {
    id: string;
    name: string;
    description: string;
}

export interface TriggerType {
    id: string;
    name: string;
    description: string;
    category: string;
}

export interface RewardType {
    id: string;
    name: string;
    description: string;
}

export interface MinecraftItem {
    id: string;
    name: string;
    category: string;
}

export interface AdvancementPreset {
    id: string;
    name: string;
    description: string;
    data: {
        title: string;
        description: string;
        icon: string;
        frame: string;
        trigger: string;
        showToast: boolean;
        announceToChat: boolean;
        hidden: boolean;
    };
}

export const frameTypes: FrameType[] = [
    {
        id: 'task',
        name: 'Task',
        description: 'Regular advancement (default oval frame)',
    },
    {
        id: 'goal',
        name: 'Goal',
        description: 'Rounded square frame for important milestones',
    },
    {
        id: 'challenge',
        name: 'Challenge',
        description: 'Fancy spiked frame for difficult achievements',
    },
];

export const triggerTypes: TriggerType[] = [
    {
        id: 'impossible',
        name: 'Impossible',
        description: 'Never triggers automatically (grant via command)',
        category: 'general',
    },
    {
        id: 'inventory_changed',
        name: 'Inventory Changed',
        description: 'When the player inventory changes',
        category: 'inventory',
    },
    {
        id: 'player_killed_entity',
        name: 'Player Killed Entity',
        description: 'When the player kills an entity',
        category: 'combat',
    },
    {
        id: 'entity_killed_player',
        name: 'Entity Killed Player',
        description: 'When an entity kills the player',
        category: 'combat',
    },
    {
        id: 'location',
        name: 'Location',
        description: 'When the player enters a specific location',
        category: 'exploration',
    },
    {
        id: 'consume_item',
        name: 'Consume Item',
        description: 'When the player eats or drinks an item',
        category: 'inventory',
    },
    {
        id: 'bred_animals',
        name: 'Bred Animals',
        description: 'When the player breeds two animals',
        category: 'farming',
    },
    {
        id: 'tame_animal',
        name: 'Tame Animal',
        description: 'When the player tames an animal',
        category: 'farming',
    },
    {
        id: 'placed_block',
        name: 'Placed Block',
        description: 'When the player places a block',
        category: 'building',
    },
    {
        id: 'item_used_on_block',
        name: 'Item Used on Block',
        description: 'When an item is used on a block',
        category: 'building',
    },
    {
        id: 'enchanted_item',
        name: 'Enchanted Item',
        description: 'When the player enchants an item',
        category: 'inventory',
    },
    {
        id: 'fishing_rod_hooked',
        name: 'Fishing Rod Hooked',
        description: 'When a fishing rod catches something',
        category: 'farming',
    },
    {
        id: 'enter_block',
        name: 'Enter Block',
        description: 'When the player enters a block (like water)',
        category: 'exploration',
    },
    {
        id: 'tick',
        name: 'Tick',
        description: 'Checks every game tick (use with conditions)',
        category: 'general',
    },
    {
        id: 'villager_trade',
        name: 'Villager Trade',
        description: 'When the player trades with a villager',
        category: 'farming',
    },
    {
        id: 'item_durability_changed',
        name: 'Item Durability Changed',
        description: 'When an item loses durability',
        category: 'inventory',
    },
    {
        id: 'levitation',
        name: 'Levitation',
        description: 'When the player has levitation effect',
        category: 'exploration',
    },
    {
        id: 'changed_dimension',
        name: 'Changed Dimension',
        description: 'When the player changes dimensions',
        category: 'exploration',
    },
    {
        id: 'player_hurt_entity',
        name: 'Player Hurt Entity',
        description: 'When the player damages an entity',
        category: 'combat',
    },
    {
        id: 'player_generates_container_loot',
        name: 'Player Generates Container Loot',
        description: 'When the player generates loot in a container',
        category: 'exploration',
    },
];

export const rewardTypes: RewardType[] = [
    {
        id: 'experience',
        name: 'Experience Points',
        description: 'Grant experience points to the player',
    },
    {
        id: 'loot',
        name: 'Loot Tables',
        description: 'Give items from loot tables',
    },
    {
        id: 'recipes',
        name: 'Recipes',
        description: 'Unlock crafting recipes',
    },
    {
        id: 'function',
        name: 'Function',
        description: 'Run a function',
    },
];

export const minecraftItems: MinecraftItem[] = [
    { id: 'minecraft:diamond', name: 'Diamond', category: 'materials' },
    { id: 'minecraft:iron_ingot', name: 'Iron Ingot', category: 'materials' },
    { id: 'minecraft:gold_ingot', name: 'Gold Ingot', category: 'materials' },
    { id: 'minecraft:emerald', name: 'Emerald', category: 'materials' },
    { id: 'minecraft:netherite_ingot', name: 'Netherite Ingot', category: 'materials' },
    { id: 'minecraft:diamond_sword', name: 'Diamond Sword', category: 'tools' },
    { id: 'minecraft:diamond_pickaxe', name: 'Diamond Pickaxe', category: 'tools' },
    { id: 'minecraft:diamond_axe', name: 'Diamond Axe', category: 'tools' },
    { id: 'minecraft:diamond_shovel', name: 'Diamond Shovel', category: 'tools' },
    { id: 'minecraft:diamond_hoe', name: 'Diamond Hoe', category: 'tools' },
    { id: 'minecraft:bow', name: 'Bow', category: 'tools' },
    { id: 'minecraft:crossbow', name: 'Crossbow', category: 'tools' },
    { id: 'minecraft:fishing_rod', name: 'Fishing Rod', category: 'tools' },
    { id: 'minecraft:diamond_helmet', name: 'Diamond Helmet', category: 'armor' },
    { id: 'minecraft:diamond_chestplate', name: 'Diamond Chestplate', category: 'armor' },
    { id: 'minecraft:diamond_leggings', name: 'Diamond Leggings', category: 'armor' },
    { id: 'minecraft:diamond_boots', name: 'Diamond Boots', category: 'armor' },
    { id: 'minecraft:elytra', name: 'Elytra', category: 'armor' },
    { id: 'minecraft:shield', name: 'Shield', category: 'armor' },
    { id: 'minecraft:oak_log', name: 'Oak Log', category: 'blocks' },
    { id: 'minecraft:stone', name: 'Stone', category: 'blocks' },
    { id: 'minecraft:cobblestone', name: 'Cobblestone', category: 'blocks' },
    { id: 'minecraft:dirt', name: 'Dirt', category: 'blocks' },
    { id: 'minecraft:grass_block', name: 'Grass Block', category: 'blocks' },
    { id: 'minecraft:crafting_table', name: 'Crafting Table', category: 'blocks' },
    { id: 'minecraft:furnace', name: 'Furnace', category: 'blocks' },
    { id: 'minecraft:chest', name: 'Chest', category: 'blocks' },
    { id: 'minecraft:ender_chest', name: 'Ender Chest', category: 'blocks' },
    { id: 'minecraft:beacon', name: 'Beacon', category: 'blocks' },
    { id: 'minecraft:bread', name: 'Bread', category: 'food' },
    { id: 'minecraft:cooked_beef', name: 'Cooked Beef', category: 'food' },
    { id: 'minecraft:golden_apple', name: 'Golden Apple', category: 'food' },
    { id: 'minecraft:enchanted_golden_apple', name: 'Enchanted Golden Apple', category: 'food' },
    { id: 'minecraft:ender_pearl', name: 'Ender Pearl', category: 'misc' },
    { id: 'minecraft:ender_eye', name: 'Eye of Ender', category: 'misc' },
    { id: 'minecraft:blaze_rod', name: 'Blaze Rod', category: 'misc' },
    { id: 'minecraft:nether_star', name: 'Nether Star', category: 'misc' },
    { id: 'minecraft:dragon_egg', name: 'Dragon Egg', category: 'misc' },
    { id: 'minecraft:totem_of_undying', name: 'Totem of Undying', category: 'misc' },
    { id: 'minecraft:trident', name: 'Trident', category: 'tools' },
];

export const advancementPresets: AdvancementPreset[] = [
    {
        id: 'first_diamond',
        name: 'First Diamond',
        description: 'Obtain your first diamond',
        data: {
            title: 'Diamonds!',
            description: 'Acquire diamonds',
            icon: 'minecraft:diamond',
            frame: 'task',
            trigger: 'inventory_changed',
            showToast: true,
            announceToChat: false,
            hidden: false,
        },
    },
    {
        id: 'kill_wither',
        name: 'Kill the Wither',
        description: 'Defeat the Wither boss',
        data: {
            title: 'The Beginning?',
            description: 'Summon and defeat the Wither',
            icon: 'minecraft:nether_star',
            frame: 'challenge',
            trigger: 'player_killed_entity',
            showToast: true,
            announceToChat: true,
            hidden: false,
        },
    },
    {
        id: 'visit_nether',
        name: 'Visit the Nether',
        description: 'Enter the Nether dimension',
        data: {
            title: 'We Need to Go Deeper',
            description: 'Build, light, and enter a Nether Portal',
            icon: 'minecraft:obsidian',
            frame: 'goal',
            trigger: 'changed_dimension',
            showToast: true,
            announceToChat: false,
            hidden: false,
        },
    },
    {
        id: 'breed_animals',
        name: 'Breed Animals',
        description: 'Breed two animals together',
        data: {
            title: 'The Parrots and the Bats',
            description: 'Breed two animals together',
            icon: 'minecraft:wheat',
            frame: 'task',
            trigger: 'bred_animals',
            showToast: true,
            announceToChat: false,
            hidden: false,
        },
    },
    {
        id: 'enchant_item',
        name: 'Enchant an Item',
        description: 'Use an enchantment table',
        data: {
            title: 'Enchanter',
            description: 'Enchant an item at an Enchanting Table',
            icon: 'minecraft:enchanting_table',
            frame: 'task',
            trigger: 'enchanted_item',
            showToast: true,
            announceToChat: false,
            hidden: false,
        },
    },
    {
        id: 'trade_villager',
        name: 'Trade with Villager',
        description: 'Successfully trade with a villager',
        data: {
            title: 'What a Deal!',
            description: 'Successfully trade with a Villager',
            icon: 'minecraft:emerald',
            frame: 'task',
            trigger: 'villager_trade',
            showToast: true,
            announceToChat: false,
            hidden: false,
        },
    },
];
