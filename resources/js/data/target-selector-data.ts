export interface SelectorType {
    id: string;
    name: string;
    description: string;
}

export interface ArgumentDefinition {
    id: string;
    name: string;
    description: string;
    type: 'text' | 'number' | 'range' | 'select' | 'checkbox' | 'position' | 'rotation' | 'nbt' | 'scores';
    category: 'position' | 'filters' | 'limits' | 'advanced';
}

export interface EntityType {
    id: string;
    name: string;
    category: 'hostile' | 'passive' | 'neutral' | 'boss' | 'other';
}

export interface GamemodeOption {
    id: string;
    name: string;
}

export interface SortOption {
    id: string;
    name: string;
    description: string;
}

export const selectorTypes: SelectorType[] = [
    { id: '@a', name: '@a', description: 'All players' },
    { id: '@e', name: '@e', description: 'All entities' },
    { id: '@p', name: '@p', description: 'Nearest player' },
    { id: '@r', name: '@r', description: 'Random player' },
    { id: '@s', name: '@s', description: 'Self (executing entity)' },
];

export const argumentDefinitions: ArgumentDefinition[] = [
    { id: 'x', name: 'X Position', description: 'X coordinate', type: 'position', category: 'position' },
    { id: 'y', name: 'Y Position', description: 'Y coordinate', type: 'position', category: 'position' },
    { id: 'z', name: 'Z Position', description: 'Z coordinate', type: 'position', category: 'position' },
    { id: 'dx', name: 'DX Volume', description: 'Volume width (X dimension)', type: 'number', category: 'position' },
    { id: 'dy', name: 'DY Volume', description: 'Volume height (Y dimension)', type: 'number', category: 'position' },
    { id: 'dz', name: 'DZ Volume', description: 'Volume depth (Z dimension)', type: 'number', category: 'position' },
    { id: 'distance', name: 'Distance', description: 'Distance range (e.g., "..5", "3..10", "5..")', type: 'range', category: 'position' },
    { id: 'type', name: 'Entity Type', description: 'Filter by entity type', type: 'select', category: 'filters' },
    { id: 'gamemode', name: 'Gamemode', description: 'Filter by gamemode', type: 'select', category: 'filters' },
    { id: 'name', name: 'Name', description: 'Filter by entity name', type: 'text', category: 'filters' },
    { id: 'tag', name: 'Tag', description: 'Filter by entity tag(s)', type: 'text', category: 'filters' },
    { id: 'team', name: 'Team', description: 'Filter by team name', type: 'text', category: 'filters' },
    { id: 'level', name: 'Experience Level', description: 'Experience level range', type: 'range', category: 'filters' },
    { id: 'x_rotation', name: 'X Rotation', description: 'Vertical rotation range (pitch)', type: 'rotation', category: 'filters' },
    { id: 'y_rotation', name: 'Y Rotation', description: 'Horizontal rotation range (yaw)', type: 'rotation', category: 'filters' },
    { id: 'limit', name: 'Limit', description: 'Maximum number of entities', type: 'number', category: 'limits' },
    { id: 'sort', name: 'Sort', description: 'Sort order', type: 'select', category: 'limits' },
    { id: 'scores', name: 'Scores', description: 'Scoreboard objective values', type: 'scores', category: 'advanced' },
    { id: 'nbt', name: 'NBT', description: 'NBT compound data', type: 'nbt', category: 'advanced' },
    { id: 'predicate', name: 'Predicate', description: 'Predicate name', type: 'text', category: 'advanced' },
];

export const entityTypes: EntityType[] = [
    // Hostile mobs
    { id: 'zombie', name: 'Zombie', category: 'hostile' },
    { id: 'skeleton', name: 'Skeleton', category: 'hostile' },
    { id: 'creeper', name: 'Creeper', category: 'hostile' },
    { id: 'spider', name: 'Spider', category: 'hostile' },
    { id: 'cave_spider', name: 'Cave Spider', category: 'hostile' },
    { id: 'enderman', name: 'Enderman', category: 'hostile' },
    { id: 'endermite', name: 'Endermite', category: 'hostile' },
    { id: 'witch', name: 'Witch', category: 'hostile' },
    { id: 'blaze', name: 'Blaze', category: 'hostile' },
    { id: 'ghast', name: 'Ghast', category: 'hostile' },
    { id: 'slime', name: 'Slime', category: 'hostile' },
    { id: 'magma_cube', name: 'Magma Cube', category: 'hostile' },
    { id: 'drowned', name: 'Drowned', category: 'hostile' },
    { id: 'husk', name: 'Husk', category: 'hostile' },
    { id: 'stray', name: 'Stray', category: 'hostile' },
    { id: 'phantom', name: 'Phantom', category: 'hostile' },
    { id: 'pillager', name: 'Pillager', category: 'hostile' },
    { id: 'ravager', name: 'Ravager', category: 'hostile' },
    { id: 'vindicator', name: 'Vindicator', category: 'hostile' },
    { id: 'evoker', name: 'Evoker', category: 'hostile' },
    { id: 'vex', name: 'Vex', category: 'hostile' },
    { id: 'silverfish', name: 'Silverfish', category: 'hostile' },
    { id: 'wither_skeleton', name: 'Wither Skeleton', category: 'hostile' },
    { id: 'piglin_brute', name: 'Piglin Brute', category: 'hostile' },
    { id: 'hoglin', name: 'Hoglin', category: 'hostile' },
    { id: 'zoglin', name: 'Zoglin', category: 'hostile' },
    { id: 'shulker', name: 'Shulker', category: 'hostile' },
    { id: 'guardian', name: 'Guardian', category: 'hostile' },
    { id: 'elder_guardian', name: 'Elder Guardian', category: 'hostile' },
    { id: 'bogged', name: 'Bogged', category: 'hostile' },
    { id: 'breeze', name: 'Breeze', category: 'hostile' },

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
    { id: 'wandering_trader', name: 'Wandering Trader', category: 'passive' },
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
    { id: 'spider', name: 'Spider', category: 'neutral' },
    { id: 'cave_spider', name: 'Cave Spider', category: 'neutral' },
    { id: 'enderman', name: 'Enderman', category: 'neutral' },

    // Boss mobs
    { id: 'ender_dragon', name: 'Ender Dragon', category: 'boss' },
    { id: 'wither', name: 'Wither', category: 'boss' },
    { id: 'warden', name: 'Warden', category: 'boss' },

    // Other entities
    { id: 'player', name: 'Player', category: 'other' },
    { id: 'armor_stand', name: 'Armor Stand', category: 'other' },
    { id: 'item_frame', name: 'Item Frame', category: 'other' },
    { id: 'glow_item_frame', name: 'Glow Item Frame', category: 'other' },
    { id: 'painting', name: 'Painting', category: 'other' },
    { id: 'boat', name: 'Boat', category: 'other' },
    { id: 'chest_boat', name: 'Chest Boat', category: 'other' },
    { id: 'minecart', name: 'Minecart', category: 'other' },
    { id: 'chest_minecart', name: 'Chest Minecart', category: 'other' },
    { id: 'furnace_minecart', name: 'Furnace Minecart', category: 'other' },
    { id: 'hopper_minecart', name: 'Hopper Minecart', category: 'other' },
    { id: 'tnt_minecart', name: 'TNT Minecart', category: 'other' },
    { id: 'tnt', name: 'TNT', category: 'other' },
    { id: 'falling_block', name: 'Falling Block', category: 'other' },
    { id: 'firework_rocket', name: 'Firework Rocket', category: 'other' },
    { id: 'arrow', name: 'Arrow', category: 'other' },
    { id: 'spectral_arrow', name: 'Spectral Arrow', category: 'other' },
    { id: 'trident', name: 'Trident', category: 'other' },
    { id: 'snowball', name: 'Snowball', category: 'other' },
    { id: 'egg', name: 'Egg', category: 'other' },
    { id: 'ender_pearl', name: 'Ender Pearl', category: 'other' },
    { id: 'eye_of_ender', name: 'Eye of Ender', category: 'other' },
    { id: 'experience_orb', name: 'Experience Orb', category: 'other' },
    { id: 'item', name: 'Item', category: 'other' },
    { id: 'lightning_bolt', name: 'Lightning Bolt', category: 'other' },
    { id: 'marker', name: 'Marker', category: 'other' },
    { id: 'area_effect_cloud', name: 'Area Effect Cloud', category: 'other' },
];

export const gamemodeOptions: GamemodeOption[] = [
    { id: 'survival', name: 'Survival' },
    { id: 'creative', name: 'Creative' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'spectator', name: 'Spectator' },
];

export const sortOptions: SortOption[] = [
    { id: 'nearest', name: 'Nearest', description: 'Sort by distance (closest first)' },
    { id: 'furthest', name: 'Furthest', description: 'Sort by distance (farthest first)' },
    { id: 'random', name: 'Random', description: 'Random order' },
    { id: 'arbitrary', name: 'Arbitrary', description: 'Default order (arbitrary)' },
];

export interface PresetExample {
    name: string;
    description: string;
    selector: string;
    config: {
        selectorType: string;
        [key: string]: unknown;
    };
}

export const presetExamples: PresetExample[] = [
    {
        name: 'All players within 10 blocks',
        description: 'Select all players within a 10 block radius',
        selector: '@a[distance=..10]',
        config: {
            selectorType: '@a',
            distanceMin: '',
            distanceMax: '10',
        },
    },
    {
        name: 'Nearest zombie',
        description: 'Select the closest zombie entity',
        selector: '@e[type=zombie,limit=1,sort=nearest]',
        config: {
            selectorType: '@e',
            entityType: 'zombie',
            limit: '1',
            sort: 'nearest',
        },
    },
    {
        name: 'All entities except players',
        description: 'Select all entities excluding players',
        selector: '@e[type=!player]',
        config: {
            selectorType: '@e',
            entityType: 'player',
            entityTypeNegate: true,
        },
    },
    {
        name: 'Players in survival mode',
        description: 'Select all players in survival gamemode',
        selector: '@a[gamemode=survival]',
        config: {
            selectorType: '@a',
            gamemode: 'survival',
            gamemodeNegate: false,
        },
    },
    {
        name: 'Entities with specific tag',
        description: 'Select entities with a custom tag',
        selector: '@e[tag=boss]',
        config: {
            selectorType: '@e',
            tags: ['boss'],
        },
    },
];
