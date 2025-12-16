export interface ParticleType {
    id: string;
    name: string;
    category: string;
    specialParams?: {
        type: 'dust' | 'dust_color_transition' | 'block' | 'block_marker' | 'falling_dust' | 'item' | 'sculk_charge' | 'shriek' | 'vibration';
        params: string[];
    };
}

export const particleCategories = [
    'All',
    'Ambient',
    'Combat',
    'Nature',
    'Blocks',
    'Weather',
    'Magic',
    'Mobs',
    'Special',
] as const;

export const particles: ParticleType[] = [
    { id: 'ambient_entity_effect', name: 'Ambient Entity Effect', category: 'Ambient' },
    { id: 'angry_villager', name: 'Angry Villager', category: 'Mobs' },
    { id: 'ash', name: 'Ash', category: 'Weather' },
    {
        id: 'block',
        name: 'Block',
        category: 'Blocks',
        specialParams: {
            type: 'block',
            params: ['block']
        }
    },
    {
        id: 'block_marker',
        name: 'Block Marker',
        category: 'Blocks',
        specialParams: {
            type: 'block_marker',
            params: ['block']
        }
    },
    { id: 'bubble', name: 'Bubble', category: 'Nature' },
    { id: 'bubble_column_up', name: 'Bubble Column Up', category: 'Nature' },
    { id: 'bubble_pop', name: 'Bubble Pop', category: 'Nature' },
    { id: 'campfire_cosy_smoke', name: 'Campfire Cosy Smoke', category: 'Ambient' },
    { id: 'campfire_signal_smoke', name: 'Campfire Signal Smoke', category: 'Ambient' },
    { id: 'cherry_leaves', name: 'Cherry Leaves', category: 'Nature' },
    { id: 'cloud', name: 'Cloud', category: 'Weather' },
    { id: 'composter', name: 'Composter', category: 'Blocks' },
    { id: 'crimson_spore', name: 'Crimson Spore', category: 'Nature' },
    { id: 'crit', name: 'Critical Hit', category: 'Combat' },
    { id: 'damage_indicator', name: 'Damage Indicator', category: 'Combat' },
    { id: 'dolphin', name: 'Dolphin', category: 'Mobs' },
    { id: 'dragon_breath', name: 'Dragon Breath', category: 'Magic' },
    { id: 'dripping_dripstone_lava', name: 'Dripping Dripstone Lava', category: 'Nature' },
    { id: 'dripping_dripstone_water', name: 'Dripping Dripstone Water', category: 'Nature' },
    { id: 'dripping_honey', name: 'Dripping Honey', category: 'Nature' },
    { id: 'dripping_lava', name: 'Dripping Lava', category: 'Nature' },
    { id: 'dripping_obsidian_tear', name: 'Dripping Obsidian Tear', category: 'Nature' },
    { id: 'dripping_water', name: 'Dripping Water', category: 'Nature' },
    {
        id: 'dust',
        name: 'Dust',
        category: 'Special',
        specialParams: {
            type: 'dust',
            params: ['r', 'g', 'b', 'size']
        }
    },
    {
        id: 'dust_color_transition',
        name: 'Dust Color Transition',
        category: 'Special',
        specialParams: {
            type: 'dust_color_transition',
            params: ['fromR', 'fromG', 'fromB', 'toR', 'toG', 'toB', 'size']
        }
    },
    { id: 'dust_pillar', name: 'Dust Pillar', category: 'Blocks' },
    { id: 'dust_plume', name: 'Dust Plume', category: 'Blocks' },
    { id: 'effect', name: 'Effect', category: 'Magic' },
    { id: 'egg_crack', name: 'Egg Crack', category: 'Mobs' },
    { id: 'elder_guardian', name: 'Elder Guardian', category: 'Mobs' },
    { id: 'electric_spark', name: 'Electric Spark', category: 'Special' },
    { id: 'enchant', name: 'Enchant', category: 'Magic' },
    { id: 'enchanted_hit', name: 'Enchanted Hit', category: 'Combat' },
    { id: 'end_rod', name: 'End Rod', category: 'Magic' },
    { id: 'entity_effect', name: 'Entity Effect', category: 'Magic' },
    { id: 'explosion', name: 'Explosion', category: 'Combat' },
    { id: 'explosion_emitter', name: 'Explosion Emitter', category: 'Combat' },
    { id: 'falling_dripstone_lava', name: 'Falling Dripstone Lava', category: 'Nature' },
    { id: 'falling_dripstone_water', name: 'Falling Dripstone Water', category: 'Nature' },
    {
        id: 'falling_dust',
        name: 'Falling Dust',
        category: 'Blocks',
        specialParams: {
            type: 'falling_dust',
            params: ['block']
        }
    },
    { id: 'falling_honey', name: 'Falling Honey', category: 'Nature' },
    { id: 'falling_lava', name: 'Falling Lava', category: 'Nature' },
    { id: 'falling_nectar', name: 'Falling Nectar', category: 'Nature' },
    { id: 'falling_obsidian_tear', name: 'Falling Obsidian Tear', category: 'Nature' },
    { id: 'falling_spore_blossom', name: 'Falling Spore Blossom', category: 'Nature' },
    { id: 'falling_water', name: 'Falling Water', category: 'Nature' },
    { id: 'firework', name: 'Firework', category: 'Special' },
    { id: 'fishing', name: 'Fishing', category: 'Nature' },
    { id: 'flame', name: 'Flame', category: 'Nature' },
    { id: 'flash', name: 'Flash', category: 'Special' },
    { id: 'glow', name: 'Glow', category: 'Magic' },
    { id: 'glow_squid_ink', name: 'Glow Squid Ink', category: 'Mobs' },
    { id: 'gust', name: 'Gust', category: 'Weather' },
    { id: 'gust_emitter', name: 'Gust Emitter', category: 'Weather' },
    { id: 'happy_villager', name: 'Happy Villager', category: 'Mobs' },
    { id: 'heart', name: 'Heart', category: 'Mobs' },
    { id: 'infested', name: 'Infested', category: 'Mobs' },
    { id: 'instant_effect', name: 'Instant Effect', category: 'Magic' },
    {
        id: 'item',
        name: 'Item',
        category: 'Special',
        specialParams: {
            type: 'item',
            params: ['item']
        }
    },
    { id: 'item_slime', name: 'Item Slime', category: 'Mobs' },
    { id: 'item_snowball', name: 'Item Snowball', category: 'Combat' },
    { id: 'landing_honey', name: 'Landing Honey', category: 'Nature' },
    { id: 'landing_lava', name: 'Landing Lava', category: 'Nature' },
    { id: 'landing_obsidian_tear', name: 'Landing Obsidian Tear', category: 'Nature' },
    { id: 'large_smoke', name: 'Large Smoke', category: 'Ambient' },
    { id: 'lava', name: 'Lava', category: 'Nature' },
    { id: 'mycelium', name: 'Mycelium', category: 'Nature' },
    { id: 'nautilus', name: 'Nautilus', category: 'Mobs' },
    { id: 'note', name: 'Note', category: 'Special' },
    { id: 'ominous_spawning', name: 'Ominous Spawning', category: 'Special' },
    { id: 'pale_oak_leaves', name: 'Pale Oak Leaves', category: 'Nature' },
    { id: 'poof', name: 'Poof', category: 'Ambient' },
    { id: 'portal', name: 'Portal', category: 'Magic' },
    { id: 'raid_omen', name: 'Raid Omen', category: 'Special' },
    { id: 'rain', name: 'Rain', category: 'Weather' },
    { id: 'reverse_portal', name: 'Reverse Portal', category: 'Magic' },
    { id: 'scrape', name: 'Scrape', category: 'Blocks' },
    {
        id: 'sculk_charge',
        name: 'Sculk Charge',
        category: 'Special',
        specialParams: {
            type: 'sculk_charge',
            params: ['roll']
        }
    },
    { id: 'sculk_charge_pop', name: 'Sculk Charge Pop', category: 'Special' },
    { id: 'sculk_soul', name: 'Sculk Soul', category: 'Special' },
    {
        id: 'shriek',
        name: 'Shriek',
        category: 'Special',
        specialParams: {
            type: 'shriek',
            params: ['delay']
        }
    },
    { id: 'small_flame', name: 'Small Flame', category: 'Nature' },
    { id: 'small_gust', name: 'Small Gust', category: 'Weather' },
    { id: 'smoke', name: 'Smoke', category: 'Ambient' },
    { id: 'sneeze', name: 'Sneeze', category: 'Mobs' },
    { id: 'snowflake', name: 'Snowflake', category: 'Weather' },
    { id: 'sonic_boom', name: 'Sonic Boom', category: 'Combat' },
    { id: 'soul', name: 'Soul', category: 'Magic' },
    { id: 'soul_fire_flame', name: 'Soul Fire Flame', category: 'Magic' },
    { id: 'spit', name: 'Spit', category: 'Combat' },
    { id: 'splash', name: 'Splash', category: 'Nature' },
    { id: 'spore_blossom_air', name: 'Spore Blossom Air', category: 'Nature' },
    { id: 'squid_ink', name: 'Squid Ink', category: 'Mobs' },
    { id: 'sweep_attack', name: 'Sweep Attack', category: 'Combat' },
    { id: 'totem_of_undying', name: 'Totem of Undying', category: 'Magic' },
    { id: 'trial_omen', name: 'Trial Omen', category: 'Special' },
    { id: 'trial_spawner_detection', name: 'Trial Spawner Detection', category: 'Special' },
    { id: 'trial_spawner_detection_ominous', name: 'Trial Spawner Detection Ominous', category: 'Special' },
    { id: 'underwater', name: 'Underwater', category: 'Nature' },
    { id: 'vault_connection', name: 'Vault Connection', category: 'Special' },
    {
        id: 'vibration',
        name: 'Vibration',
        category: 'Special',
        specialParams: {
            type: 'vibration',
            params: ['destination', 'arrivalTicks']
        }
    },
    { id: 'warped_spore', name: 'Warped Spore', category: 'Nature' },
    { id: 'wax_off', name: 'Wax Off', category: 'Blocks' },
    { id: 'wax_on', name: 'Wax On', category: 'Blocks' },
    { id: 'white_ash', name: 'White Ash', category: 'Weather' },
    { id: 'witch', name: 'Witch', category: 'Mobs' },
];

export const commonBlocks = [
    'minecraft:stone',
    'minecraft:grass_block',
    'minecraft:dirt',
    'minecraft:cobblestone',
    'minecraft:oak_planks',
    'minecraft:glass',
    'minecraft:oak_log',
    'minecraft:oak_leaves',
    'minecraft:sand',
    'minecraft:gravel',
    'minecraft:gold_ore',
    'minecraft:iron_ore',
    'minecraft:coal_ore',
    'minecraft:diamond_ore',
    'minecraft:redstone_ore',
    'minecraft:emerald_ore',
    'minecraft:netherrack',
    'minecraft:soul_sand',
    'minecraft:glowstone',
    'minecraft:end_stone',
    'minecraft:obsidian',
];

export const commonItems = [
    'minecraft:diamond',
    'minecraft:emerald',
    'minecraft:gold_ingot',
    'minecraft:iron_ingot',
    'minecraft:apple',
    'minecraft:golden_apple',
    'minecraft:enchanted_golden_apple',
    'minecraft:bread',
    'minecraft:cooked_beef',
    'minecraft:arrow',
    'minecraft:bow',
    'minecraft:diamond_sword',
    'minecraft:diamond_pickaxe',
    'minecraft:heart_of_the_sea',
    'minecraft:nether_star',
    'minecraft:elytra',
];

export const presets = [
    {
        name: 'Flame Circle',
        description: 'A circle of flame particles',
        particle: 'flame',
        x: '~',
        y: '~1',
        z: '~',
        dx: '2',
        dy: '0',
        dz: '2',
        speed: '0',
        count: '50',
        mode: 'normal',
        viewer: '@a',
    },
    {
        name: 'Colored Dust',
        description: 'Red dust particles',
        particle: 'dust',
        x: '~',
        y: '~1',
        z: '~',
        dx: '0.5',
        dy: '0.5',
        dz: '0.5',
        speed: '1',
        count: '10',
        mode: 'normal',
        viewer: '@a',
        specialParams: {
            r: '1',
            g: '0',
            b: '0',
            size: '1',
        },
    },
    {
        name: 'Block Break Effect',
        description: 'Stone breaking particles',
        particle: 'block',
        x: '~',
        y: '~',
        z: '~',
        dx: '0.5',
        dy: '0.5',
        dz: '0.5',
        speed: '1',
        count: '20',
        mode: 'normal',
        viewer: '@a',
        specialParams: {
            block: 'minecraft:stone',
        },
    },
    {
        name: 'Enchantment Particles',
        description: 'Enchanting table particles',
        particle: 'enchant',
        x: '~',
        y: '~1',
        z: '~',
        dx: '1',
        dy: '2',
        dz: '1',
        speed: '1',
        count: '100',
        mode: 'normal',
        viewer: '@a',
    },
];
