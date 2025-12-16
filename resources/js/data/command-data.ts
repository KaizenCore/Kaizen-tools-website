export interface EntityType {
    id: string;
    name: string;
    category: 'hostile' | 'passive' | 'neutral' | 'boss' | 'other';
}

export interface Effect {
    id: string;
    name: string;
    numericId: number;
    maxLevel: number;
}

export interface MinecraftItem {
    id: string;
    name: string;
    category: 'weapon' | 'tool' | 'armor' | 'food' | 'block' | 'other';
    maxStackSize: number;
}

export interface Enchantment {
    id: string;
    name: string;
    maxLevel: number;
}

export const entityTypes: EntityType[] = [
    // Hostile mobs
    { id: 'zombie', name: 'Zombie', category: 'hostile' },
    { id: 'skeleton', name: 'Skeleton', category: 'hostile' },
    { id: 'creeper', name: 'Creeper', category: 'hostile' },
    { id: 'spider', name: 'Spider', category: 'hostile' },
    { id: 'enderman', name: 'Enderman', category: 'hostile' },
    { id: 'witch', name: 'Witch', category: 'hostile' },
    { id: 'blaze', name: 'Blaze', category: 'hostile' },
    { id: 'ghast', name: 'Ghast', category: 'hostile' },
    { id: 'slime', name: 'Slime', category: 'hostile' },
    { id: 'magma_cube', name: 'Magma Cube', category: 'hostile' },
    { id: 'drowned', name: 'Drowned', category: 'hostile' },
    { id: 'phantom', name: 'Phantom', category: 'hostile' },
    { id: 'pillager', name: 'Pillager', category: 'hostile' },
    { id: 'ravager', name: 'Ravager', category: 'hostile' },
    { id: 'vindicator', name: 'Vindicator', category: 'hostile' },
    { id: 'evoker', name: 'Evoker', category: 'hostile' },
    { id: 'wither_skeleton', name: 'Wither Skeleton', category: 'hostile' },
    { id: 'piglin_brute', name: 'Piglin Brute', category: 'hostile' },
    { id: 'hoglin', name: 'Hoglin', category: 'hostile' },
    { id: 'zoglin', name: 'Zoglin', category: 'hostile' },
    { id: 'shulker', name: 'Shulker', category: 'hostile' },
    { id: 'guardian', name: 'Guardian', category: 'hostile' },
    { id: 'elder_guardian', name: 'Elder Guardian', category: 'hostile' },

    // Passive mobs
    { id: 'pig', name: 'Pig', category: 'passive' },
    { id: 'cow', name: 'Cow', category: 'passive' },
    { id: 'sheep', name: 'Sheep', category: 'passive' },
    { id: 'chicken', name: 'Chicken', category: 'passive' },
    { id: 'rabbit', name: 'Rabbit', category: 'passive' },
    { id: 'horse', name: 'Horse', category: 'passive' },
    { id: 'donkey', name: 'Donkey', category: 'passive' },
    { id: 'mule', name: 'Mule', category: 'passive' },
    { id: 'cat', name: 'Cat', category: 'passive' },
    { id: 'ocelot', name: 'Ocelot', category: 'passive' },
    { id: 'parrot', name: 'Parrot', category: 'passive' },
    { id: 'bat', name: 'Bat', category: 'passive' },
    { id: 'squid', name: 'Squid', category: 'passive' },
    { id: 'glow_squid', name: 'Glow Squid', category: 'passive' },
    { id: 'cod', name: 'Cod', category: 'passive' },
    { id: 'salmon', name: 'Salmon', category: 'passive' },
    { id: 'tropical_fish', name: 'Tropical Fish', category: 'passive' },
    { id: 'pufferfish', name: 'Pufferfish', category: 'passive' },
    { id: 'turtle', name: 'Turtle', category: 'passive' },
    { id: 'villager', name: 'Villager', category: 'passive' },
    { id: 'mooshroom', name: 'Mooshroom', category: 'passive' },
    { id: 'strider', name: 'Strider', category: 'passive' },
    { id: 'axolotl', name: 'Axolotl', category: 'passive' },
    { id: 'frog', name: 'Frog', category: 'passive' },
    { id: 'tadpole', name: 'Tadpole', category: 'passive' },
    { id: 'allay', name: 'Allay', category: 'passive' },
    { id: 'camel', name: 'Camel', category: 'passive' },
    { id: 'sniffer', name: 'Sniffer', category: 'passive' },
    { id: 'armadillo', name: 'Armadillo', category: 'passive' },

    // Neutral mobs
    { id: 'wolf', name: 'Wolf', category: 'neutral' },
    { id: 'polar_bear', name: 'Polar Bear', category: 'neutral' },
    { id: 'bee', name: 'Bee', category: 'neutral' },
    { id: 'iron_golem', name: 'Iron Golem', category: 'neutral' },
    { id: 'snow_golem', name: 'Snow Golem', category: 'neutral' },
    { id: 'piglin', name: 'Piglin', category: 'neutral' },
    { id: 'zombified_piglin', name: 'Zombified Piglin', category: 'neutral' },
    { id: 'dolphin', name: 'Dolphin', category: 'neutral' },
    { id: 'panda', name: 'Panda', category: 'neutral' },
    { id: 'llama', name: 'Llama', category: 'neutral' },
    { id: 'trader_llama', name: 'Trader Llama', category: 'neutral' },
    { id: 'fox', name: 'Fox', category: 'neutral' },
    { id: 'goat', name: 'Goat', category: 'neutral' },

    // Boss mobs
    { id: 'ender_dragon', name: 'Ender Dragon', category: 'boss' },
    { id: 'wither', name: 'Wither', category: 'boss' },
    { id: 'warden', name: 'Warden', category: 'boss' },

    // Other
    { id: 'armor_stand', name: 'Armor Stand', category: 'other' },
    { id: 'item_frame', name: 'Item Frame', category: 'other' },
    { id: 'glow_item_frame', name: 'Glow Item Frame', category: 'other' },
    { id: 'painting', name: 'Painting', category: 'other' },
    { id: 'boat', name: 'Boat', category: 'other' },
    { id: 'minecart', name: 'Minecart', category: 'other' },
    { id: 'tnt', name: 'TNT', category: 'other' },
    { id: 'firework_rocket', name: 'Firework Rocket', category: 'other' },
];

export const effects: Effect[] = [
    { id: 'speed', name: 'Speed', numericId: 1, maxLevel: 255 },
    { id: 'slowness', name: 'Slowness', numericId: 2, maxLevel: 255 },
    { id: 'haste', name: 'Haste', numericId: 3, maxLevel: 255 },
    { id: 'mining_fatigue', name: 'Mining Fatigue', numericId: 4, maxLevel: 255 },
    { id: 'strength', name: 'Strength', numericId: 5, maxLevel: 255 },
    { id: 'instant_health', name: 'Instant Health', numericId: 6, maxLevel: 255 },
    { id: 'instant_damage', name: 'Instant Damage', numericId: 7, maxLevel: 255 },
    { id: 'jump_boost', name: 'Jump Boost', numericId: 8, maxLevel: 255 },
    { id: 'nausea', name: 'Nausea', numericId: 9, maxLevel: 255 },
    { id: 'regeneration', name: 'Regeneration', numericId: 10, maxLevel: 255 },
    { id: 'resistance', name: 'Resistance', numericId: 11, maxLevel: 255 },
    { id: 'fire_resistance', name: 'Fire Resistance', numericId: 12, maxLevel: 255 },
    { id: 'water_breathing', name: 'Water Breathing', numericId: 13, maxLevel: 255 },
    { id: 'invisibility', name: 'Invisibility', numericId: 14, maxLevel: 255 },
    { id: 'blindness', name: 'Blindness', numericId: 15, maxLevel: 255 },
    { id: 'night_vision', name: 'Night Vision', numericId: 16, maxLevel: 255 },
    { id: 'hunger', name: 'Hunger', numericId: 17, maxLevel: 255 },
    { id: 'weakness', name: 'Weakness', numericId: 18, maxLevel: 255 },
    { id: 'poison', name: 'Poison', numericId: 19, maxLevel: 255 },
    { id: 'wither', name: 'Wither', numericId: 20, maxLevel: 255 },
    { id: 'health_boost', name: 'Health Boost', numericId: 21, maxLevel: 255 },
    { id: 'absorption', name: 'Absorption', numericId: 22, maxLevel: 255 },
    { id: 'saturation', name: 'Saturation', numericId: 23, maxLevel: 255 },
    { id: 'glowing', name: 'Glowing', numericId: 24, maxLevel: 255 },
    { id: 'levitation', name: 'Levitation', numericId: 25, maxLevel: 255 },
    { id: 'luck', name: 'Luck', numericId: 26, maxLevel: 255 },
    { id: 'unluck', name: 'Bad Luck', numericId: 27, maxLevel: 255 },
    { id: 'slow_falling', name: 'Slow Falling', numericId: 28, maxLevel: 255 },
    { id: 'conduit_power', name: 'Conduit Power', numericId: 29, maxLevel: 255 },
    { id: 'dolphins_grace', name: "Dolphin's Grace", numericId: 30, maxLevel: 255 },
    { id: 'bad_omen', name: 'Bad Omen', numericId: 31, maxLevel: 255 },
    { id: 'hero_of_the_village', name: 'Hero of the Village', numericId: 32, maxLevel: 255 },
    { id: 'darkness', name: 'Darkness', numericId: 33, maxLevel: 255 },
];

export const items: MinecraftItem[] = [
    // Weapons
    { id: 'diamond_sword', name: 'Diamond Sword', category: 'weapon', maxStackSize: 1 },
    { id: 'netherite_sword', name: 'Netherite Sword', category: 'weapon', maxStackSize: 1 },
    { id: 'iron_sword', name: 'Iron Sword', category: 'weapon', maxStackSize: 1 },
    { id: 'golden_sword', name: 'Golden Sword', category: 'weapon', maxStackSize: 1 },
    { id: 'stone_sword', name: 'Stone Sword', category: 'weapon', maxStackSize: 1 },
    { id: 'wooden_sword', name: 'Wooden Sword', category: 'weapon', maxStackSize: 1 },
    { id: 'bow', name: 'Bow', category: 'weapon', maxStackSize: 1 },
    { id: 'crossbow', name: 'Crossbow', category: 'weapon', maxStackSize: 1 },
    { id: 'trident', name: 'Trident', category: 'weapon', maxStackSize: 1 },
    { id: 'mace', name: 'Mace', category: 'weapon', maxStackSize: 1 },

    // Tools
    { id: 'diamond_pickaxe', name: 'Diamond Pickaxe', category: 'tool', maxStackSize: 1 },
    { id: 'netherite_pickaxe', name: 'Netherite Pickaxe', category: 'tool', maxStackSize: 1 },
    { id: 'diamond_axe', name: 'Diamond Axe', category: 'tool', maxStackSize: 1 },
    { id: 'netherite_axe', name: 'Netherite Axe', category: 'tool', maxStackSize: 1 },
    { id: 'diamond_shovel', name: 'Diamond Shovel', category: 'tool', maxStackSize: 1 },
    { id: 'netherite_shovel', name: 'Netherite Shovel', category: 'tool', maxStackSize: 1 },
    { id: 'diamond_hoe', name: 'Diamond Hoe', category: 'tool', maxStackSize: 1 },
    { id: 'netherite_hoe', name: 'Netherite Hoe', category: 'tool', maxStackSize: 1 },
    { id: 'shears', name: 'Shears', category: 'tool', maxStackSize: 1 },
    { id: 'fishing_rod', name: 'Fishing Rod', category: 'tool', maxStackSize: 1 },

    // Armor
    { id: 'diamond_helmet', name: 'Diamond Helmet', category: 'armor', maxStackSize: 1 },
    { id: 'diamond_chestplate', name: 'Diamond Chestplate', category: 'armor', maxStackSize: 1 },
    { id: 'diamond_leggings', name: 'Diamond Leggings', category: 'armor', maxStackSize: 1 },
    { id: 'diamond_boots', name: 'Diamond Boots', category: 'armor', maxStackSize: 1 },
    { id: 'netherite_helmet', name: 'Netherite Helmet', category: 'armor', maxStackSize: 1 },
    { id: 'netherite_chestplate', name: 'Netherite Chestplate', category: 'armor', maxStackSize: 1 },
    { id: 'netherite_leggings', name: 'Netherite Leggings', category: 'armor', maxStackSize: 1 },
    { id: 'netherite_boots', name: 'Netherite Boots', category: 'armor', maxStackSize: 1 },
    { id: 'elytra', name: 'Elytra', category: 'armor', maxStackSize: 1 },
    { id: 'shield', name: 'Shield', category: 'armor', maxStackSize: 1 },

    // Food
    { id: 'golden_apple', name: 'Golden Apple', category: 'food', maxStackSize: 64 },
    { id: 'enchanted_golden_apple', name: 'Enchanted Golden Apple', category: 'food', maxStackSize: 64 },
    { id: 'cooked_beef', name: 'Cooked Beef', category: 'food', maxStackSize: 64 },
    { id: 'bread', name: 'Bread', category: 'food', maxStackSize: 64 },
    { id: 'apple', name: 'Apple', category: 'food', maxStackSize: 64 },
    { id: 'golden_carrot', name: 'Golden Carrot', category: 'food', maxStackSize: 64 },
    { id: 'suspicious_stew', name: 'Suspicious Stew', category: 'food', maxStackSize: 1 },

    // Blocks
    { id: 'diamond_block', name: 'Diamond Block', category: 'block', maxStackSize: 64 },
    { id: 'netherite_block', name: 'Netherite Block', category: 'block', maxStackSize: 64 },
    { id: 'emerald_block', name: 'Emerald Block', category: 'block', maxStackSize: 64 },
    { id: 'gold_block', name: 'Gold Block', category: 'block', maxStackSize: 64 },
    { id: 'iron_block', name: 'Iron Block', category: 'block', maxStackSize: 64 },
    { id: 'tnt', name: 'TNT', category: 'block', maxStackSize: 64 },
    { id: 'beacon', name: 'Beacon', category: 'block', maxStackSize: 64 },
    { id: 'chest', name: 'Chest', category: 'block', maxStackSize: 64 },
    { id: 'ender_chest', name: 'Ender Chest', category: 'block', maxStackSize: 64 },

    // Other
    { id: 'diamond', name: 'Diamond', category: 'other', maxStackSize: 64 },
    { id: 'emerald', name: 'Emerald', category: 'other', maxStackSize: 64 },
    { id: 'netherite_ingot', name: 'Netherite Ingot', category: 'other', maxStackSize: 64 },
    { id: 'ender_pearl', name: 'Ender Pearl', category: 'other', maxStackSize: 16 },
    { id: 'totem_of_undying', name: 'Totem of Undying', category: 'other', maxStackSize: 1 },
    { id: 'enchanted_book', name: 'Enchanted Book', category: 'other', maxStackSize: 1 },
    { id: 'nether_star', name: 'Nether Star', category: 'other', maxStackSize: 64 },
    { id: 'dragon_egg', name: 'Dragon Egg', category: 'other', maxStackSize: 64 },
    { id: 'elytra', name: 'Elytra', category: 'other', maxStackSize: 1 },
];

export const commandEnchantments: Enchantment[] = [
    { id: 'sharpness', name: 'Sharpness', maxLevel: 5 },
    { id: 'smite', name: 'Smite', maxLevel: 5 },
    { id: 'bane_of_arthropods', name: 'Bane of Arthropods', maxLevel: 5 },
    { id: 'knockback', name: 'Knockback', maxLevel: 2 },
    { id: 'fire_aspect', name: 'Fire Aspect', maxLevel: 2 },
    { id: 'looting', name: 'Looting', maxLevel: 3 },
    { id: 'sweeping_edge', name: 'Sweeping Edge', maxLevel: 3 },
    { id: 'efficiency', name: 'Efficiency', maxLevel: 5 },
    { id: 'silk_touch', name: 'Silk Touch', maxLevel: 1 },
    { id: 'unbreaking', name: 'Unbreaking', maxLevel: 3 },
    { id: 'fortune', name: 'Fortune', maxLevel: 3 },
    { id: 'power', name: 'Power', maxLevel: 5 },
    { id: 'punch', name: 'Punch', maxLevel: 2 },
    { id: 'flame', name: 'Flame', maxLevel: 1 },
    { id: 'infinity', name: 'Infinity', maxLevel: 1 },
    { id: 'luck_of_the_sea', name: 'Luck of the Sea', maxLevel: 3 },
    { id: 'lure', name: 'Lure', maxLevel: 3 },
    { id: 'loyalty', name: 'Loyalty', maxLevel: 3 },
    { id: 'impaling', name: 'Impaling', maxLevel: 5 },
    { id: 'riptide', name: 'Riptide', maxLevel: 3 },
    { id: 'channeling', name: 'Channeling', maxLevel: 1 },
    { id: 'mending', name: 'Mending', maxLevel: 1 },
    { id: 'protection', name: 'Protection', maxLevel: 4 },
    { id: 'fire_protection', name: 'Fire Protection', maxLevel: 4 },
    { id: 'feather_falling', name: 'Feather Falling', maxLevel: 4 },
    { id: 'blast_protection', name: 'Blast Protection', maxLevel: 4 },
    { id: 'projectile_protection', name: 'Projectile Protection', maxLevel: 4 },
    { id: 'respiration', name: 'Respiration', maxLevel: 3 },
    { id: 'aqua_affinity', name: 'Aqua Affinity', maxLevel: 1 },
    { id: 'thorns', name: 'Thorns', maxLevel: 3 },
    { id: 'depth_strider', name: 'Depth Strider', maxLevel: 3 },
    { id: 'frost_walker', name: 'Frost Walker', maxLevel: 2 },
    { id: 'soul_speed', name: 'Soul Speed', maxLevel: 3 },
    { id: 'swift_sneak', name: 'Swift Sneak', maxLevel: 3 },
    { id: 'quick_charge', name: 'Quick Charge', maxLevel: 3 },
    { id: 'piercing', name: 'Piercing', maxLevel: 4 },
    { id: 'multishot', name: 'Multishot', maxLevel: 1 },
    { id: 'density', name: 'Density', maxLevel: 5 },
    { id: 'breach', name: 'Breach', maxLevel: 4 },
    { id: 'wind_burst', name: 'Wind Burst', maxLevel: 3 },
];

export const gamemodes = [
    { id: 'survival', name: 'Survival' },
    { id: 'creative', name: 'Creative' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'spectator', name: 'Spectator' },
];
