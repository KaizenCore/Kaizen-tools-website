export type EntityCategory = 'hostile' | 'passive' | 'neutral' | 'aquatic' | 'utility' | 'bosses' | 'projectiles';

export interface Entity {
    id: string;
    name: string;
    category: EntityCategory;
    canBeBaby?: boolean;
    canHaveEquipment?: boolean;
    specificNBT?: string[];
}

export interface NBTTag {
    id: string;
    name: string;
    type: 'boolean' | 'number' | 'string' | 'select' | 'slider' | 'array';
    category: 'universal' | 'mob' | 'specific';
    description: string;
    defaultValue?: any;
    min?: number;
    max?: number;
    options?: { value: string; label: string }[];
    applicableTo?: string[];
}

export interface PotionEffect {
    id: string;
    name: string;
    color: string;
}

export interface Attribute {
    id: string;
    name: string;
    defaultValue: number;
    min: number;
    max: number;
}

export interface EquipmentSlot {
    id: string;
    name: string;
}

export interface EntityPreset {
    id: string;
    name: string;
    description: string;
    entityId: string;
    nbt: Record<string, any>;
}

export const entityCategories: { id: EntityCategory; name: string }[] = [
    { id: 'hostile', name: 'Hostile' },
    { id: 'passive', name: 'Passive' },
    { id: 'neutral', name: 'Neutral' },
    { id: 'aquatic', name: 'Aquatic' },
    { id: 'utility', name: 'Utility' },
    { id: 'bosses', name: 'Bosses' },
    { id: 'projectiles', name: 'Projectiles' },
];

export const entities: Entity[] = [
    // Hostile Mobs
    { id: 'zombie', name: 'Zombie', category: 'hostile', canBeBaby: true, canHaveEquipment: true, specificNBT: ['CanBreakDoors', 'DrownedConversionTime'] },
    { id: 'skeleton', name: 'Skeleton', category: 'hostile', canHaveEquipment: true, specificNBT: ['StrayConversionTime'] },
    { id: 'creeper', name: 'Creeper', category: 'hostile', specificNBT: ['Fuse', 'ExplosionRadius', 'powered', 'ignited'] },
    { id: 'spider', name: 'Spider', category: 'hostile' },
    { id: 'cave_spider', name: 'Cave Spider', category: 'hostile' },
    { id: 'enderman', name: 'Enderman', category: 'hostile', specificNBT: ['carriedBlockState'] },
    { id: 'witch', name: 'Witch', category: 'hostile' },
    { id: 'slime', name: 'Slime', category: 'hostile', specificNBT: ['Size'] },
    { id: 'magma_cube', name: 'Magma Cube', category: 'hostile', specificNBT: ['Size'] },
    { id: 'ghast', name: 'Ghast', category: 'hostile', specificNBT: ['ExplosionPower'] },
    { id: 'blaze', name: 'Blaze', category: 'hostile' },
    { id: 'wither_skeleton', name: 'Wither Skeleton', category: 'hostile', canHaveEquipment: true },
    { id: 'stray', name: 'Stray', category: 'hostile', canHaveEquipment: true },
    { id: 'husk', name: 'Husk', category: 'hostile', canBeBaby: true, canHaveEquipment: true },
    { id: 'drowned', name: 'Drowned', category: 'hostile', canBeBaby: true, canHaveEquipment: true },
    { id: 'phantom', name: 'Phantom', category: 'hostile', specificNBT: ['AX'] },
    { id: 'pillager', name: 'Pillager', category: 'hostile', canHaveEquipment: true },
    { id: 'vindicator', name: 'Vindicator', category: 'hostile', canHaveEquipment: true },
    { id: 'evoker', name: 'Evoker', category: 'hostile' },
    { id: 'ravager', name: 'Ravager', category: 'hostile', specificNBT: ['AttackTick', 'RoarTick', 'StunTick'] },
    { id: 'vex', name: 'Vex', category: 'hostile', specificNBT: ['BoundX', 'BoundY', 'BoundZ', 'LifeTicks'] },
    { id: 'guardian', name: 'Guardian', category: 'hostile' },
    { id: 'elder_guardian', name: 'Elder Guardian', category: 'hostile' },
    { id: 'shulker', name: 'Shulker', category: 'hostile', specificNBT: ['Peek', 'AttachFace', 'Color'] },
    { id: 'endermite', name: 'Endermite', category: 'hostile', specificNBT: ['Lifetime'] },
    { id: 'silverfish', name: 'Silverfish', category: 'hostile' },
    { id: 'hoglin', name: 'Hoglin', category: 'hostile', canBeBaby: true, specificNBT: ['IsImmuneToZombification', 'TimeInOverworld'] },
    { id: 'piglin', name: 'Piglin', category: 'neutral', canBeBaby: true, canHaveEquipment: true, specificNBT: ['IsImmuneToZombification', 'TimeInOverworld', 'IsBaby'] },
    { id: 'piglin_brute', name: 'Piglin Brute', category: 'hostile', canHaveEquipment: true, specificNBT: ['IsImmuneToZombification', 'TimeInOverworld'] },
    { id: 'zoglin', name: 'Zoglin', category: 'hostile', canBeBaby: true },
    { id: 'warden', name: 'Warden', category: 'hostile', specificNBT: ['anger'] },
    { id: 'breeze', name: 'Breeze', category: 'hostile' },
    { id: 'bogged', name: 'Bogged', category: 'hostile', canHaveEquipment: true },

    // Passive Mobs
    { id: 'pig', name: 'Pig', category: 'passive', canBeBaby: true, specificNBT: ['Saddle'] },
    { id: 'cow', name: 'Cow', category: 'passive', canBeBaby: true },
    { id: 'sheep', name: 'Sheep', category: 'passive', canBeBaby: true, specificNBT: ['Sheared', 'Color'] },
    { id: 'chicken', name: 'Chicken', category: 'passive', canBeBaby: true, specificNBT: ['EggLayTime'] },
    { id: 'rabbit', name: 'Rabbit', category: 'passive', canBeBaby: true, specificNBT: ['RabbitType', 'MoreCarrotTicks'] },
    { id: 'horse', name: 'Horse', category: 'passive', canBeBaby: true, specificNBT: ['Variant', 'Tame', 'Bred', 'EatingHaystack', 'Temper', 'ChestedHorse', 'SaddleItem', 'ArmorItem'] },
    { id: 'donkey', name: 'Donkey', category: 'passive', canBeBaby: true, specificNBT: ['Tame', 'Bred', 'ChestedHorse', 'SaddleItem'] },
    { id: 'mule', name: 'Mule', category: 'passive', canBeBaby: true, specificNBT: ['Tame', 'Bred', 'ChestedHorse', 'SaddleItem'] },
    { id: 'llama', name: 'Llama', category: 'passive', canBeBaby: true, specificNBT: ['Variant', 'Strength', 'Tame', 'Bred', 'ChestedHorse', 'DecorItem'] },
    { id: 'wolf', name: 'Wolf', category: 'neutral', canBeBaby: true, specificNBT: ['Owner', 'Sitting', 'CollarColor', 'variant'] },
    { id: 'cat', name: 'Cat', category: 'passive', canBeBaby: true, specificNBT: ['Owner', 'Sitting', 'CollarColor', 'variant'] },
    { id: 'ocelot', name: 'Ocelot', category: 'passive', canBeBaby: true },
    { id: 'parrot', name: 'Parrot', category: 'passive', specificNBT: ['Variant'] },
    { id: 'fox', name: 'Fox', category: 'passive', canBeBaby: true, specificNBT: ['Type', 'Sleeping', 'Sitting', 'Crouching'] },
    { id: 'bee', name: 'Bee', category: 'neutral', canBeBaby: true, specificNBT: ['HasNectar', 'HasStung', 'TicksSincePollination', 'CannotEnterHiveTicks', 'AngerTime'] },
    { id: 'goat', name: 'Goat', category: 'neutral', canBeBaby: true, specificNBT: ['IsScreamingGoat'] },
    { id: 'frog', name: 'Frog', category: 'passive', specificNBT: ['variant'] },
    { id: 'tadpole', name: 'Tadpole', category: 'passive' },
    { id: 'allay', name: 'Allay', category: 'passive', specificNBT: ['CanDuplicate', 'DuplicationCooldown'] },
    { id: 'sniffer', name: 'Sniffer', category: 'passive', canBeBaby: true },
    { id: 'camel', name: 'Camel', category: 'passive', canBeBaby: true, specificNBT: ['Tame', 'Bred', 'SaddleItem'] },
    { id: 'armadillo', name: 'Armadillo', category: 'passive', canBeBaby: true },

    // Neutral Mobs
    { id: 'iron_golem', name: 'Iron Golem', category: 'neutral', specificNBT: ['PlayerCreated', 'AngerTime'] },
    { id: 'snow_golem', name: 'Snow Golem', category: 'neutral', specificNBT: ['Pumpkin'] },
    { id: 'dolphin', name: 'Dolphin', category: 'aquatic', specificNBT: ['TreasurePosX', 'TreasurePosY', 'TreasurePosZ', 'GotFish', 'CanFindTreasure'] },
    { id: 'panda', name: 'Panda', category: 'neutral', canBeBaby: true, specificNBT: ['MainGene', 'HiddenGene', 'SneezeCounter', 'EatingCounter'] },
    { id: 'polar_bear', name: 'Polar Bear', category: 'neutral', canBeBaby: true },
    { id: 'zombified_piglin', name: 'Zombified Piglin', category: 'neutral', canBeBaby: true, canHaveEquipment: true, specificNBT: ['AngerTime', 'IsImmuneToZombification'] },
    { id: 'trader_llama', name: 'Trader Llama', category: 'neutral', specificNBT: ['Variant', 'Strength', 'DespawnDelay'] },

    // Aquatic Mobs
    { id: 'cod', name: 'Cod', category: 'aquatic', specificNBT: ['FromBucket'] },
    { id: 'salmon', name: 'Salmon', category: 'aquatic', specificNBT: ['FromBucket'] },
    { id: 'tropical_fish', name: 'Tropical Fish', category: 'aquatic', specificNBT: ['Variant', 'FromBucket'] },
    { id: 'pufferfish', name: 'Pufferfish', category: 'aquatic', specificNBT: ['PuffState', 'FromBucket'] },
    { id: 'squid', name: 'Squid', category: 'aquatic' },
    { id: 'glow_squid', name: 'Glow Squid', category: 'aquatic', specificNBT: ['DarkTicksRemaining'] },
    { id: 'axolotl', name: 'Axolotl', category: 'aquatic', canBeBaby: true, specificNBT: ['Variant', 'FromBucket'] },
    { id: 'turtle', name: 'Turtle', category: 'aquatic', canBeBaby: true, specificNBT: ['HomePosX', 'HomePosY', 'HomePosZ', 'HasEgg'] },

    // Utility Entities
    { id: 'armor_stand', name: 'Armor Stand', category: 'utility', canHaveEquipment: true, specificNBT: ['Small', 'Marker', 'Invisible', 'ShowArms', 'NoBasePlate', 'Pose'] },
    { id: 'item_frame', name: 'Item Frame', category: 'utility', specificNBT: ['Item', 'ItemRotation', 'Fixed'] },
    { id: 'glow_item_frame', name: 'Glow Item Frame', category: 'utility', specificNBT: ['Item', 'ItemRotation', 'Fixed'] },
    { id: 'painting', name: 'Painting', category: 'utility', specificNBT: ['variant'] },
    { id: 'minecart', name: 'Minecart', category: 'utility', specificNBT: ['CustomDisplayTile', 'DisplayState', 'DisplayOffset'] },
    { id: 'boat', name: 'Boat', category: 'utility', specificNBT: ['Type'] },
    { id: 'tnt', name: 'TNT', category: 'utility', specificNBT: ['Fuse'] },
    { id: 'falling_block', name: 'Falling Block', category: 'utility', specificNBT: ['BlockState', 'Time', 'DropItem', 'HurtEntities'] },
    { id: 'area_effect_cloud', name: 'Area Effect Cloud', category: 'utility', specificNBT: ['Radius', 'RadiusPerTick', 'Duration', 'DurationOnUse', 'Color', 'Particle'] },
    { id: 'ender_crystal', name: 'End Crystal', category: 'utility', specificNBT: ['ShowBottom', 'BeamTarget'] },
    { id: 'lightning_bolt', name: 'Lightning Bolt', category: 'utility' },
    { id: 'experience_orb', name: 'Experience Orb', category: 'utility', specificNBT: ['Value'] },

    // Bosses
    { id: 'ender_dragon', name: 'Ender Dragon', category: 'bosses', specificNBT: ['DragonPhase'] },
    { id: 'wither', name: 'Wither', category: 'bosses', specificNBT: ['Invul'] },

    // Projectiles
    { id: 'arrow', name: 'Arrow', category: 'projectiles', specificNBT: ['damage', 'pickup', 'crit', 'ShotFromCrossbow'] },
    { id: 'spectral_arrow', name: 'Spectral Arrow', category: 'projectiles', specificNBT: ['damage', 'pickup', 'crit'] },
    { id: 'trident', name: 'Trident', category: 'projectiles', specificNBT: ['damage', 'pickup', 'crit', 'Trident'] },
    { id: 'fireball', name: 'Fireball', category: 'projectiles', specificNBT: ['ExplosionPower', 'direction'] },
    { id: 'small_fireball', name: 'Small Fireball', category: 'projectiles', specificNBT: ['direction'] },
    { id: 'dragon_fireball', name: 'Dragon Fireball', category: 'projectiles', specificNBT: ['direction'] },
    { id: 'wither_skull', name: 'Wither Skull', category: 'projectiles', specificNBT: ['direction'] },
    { id: 'snowball', name: 'Snowball', category: 'projectiles' },
    { id: 'egg', name: 'Egg', category: 'projectiles' },
    { id: 'ender_pearl', name: 'Ender Pearl', category: 'projectiles' },
    { id: 'eye_of_ender', name: 'Eye of Ender', category: 'projectiles' },
    { id: 'firework_rocket', name: 'Firework Rocket', category: 'projectiles', specificNBT: ['FireworksItem', 'LifeTime', 'Life'] },
    { id: 'potion', name: 'Thrown Potion', category: 'projectiles', specificNBT: ['Potion', 'CustomPotionEffects', 'CustomPotionColor'] },
    { id: 'experience_bottle', name: 'Experience Bottle', category: 'projectiles' },
];

export const nbtTags: NBTTag[] = [
    // Universal Tags
    { id: 'CustomName', name: 'Custom Name', type: 'string', category: 'universal', description: 'Custom display name for the entity (JSON text component)' },
    { id: 'CustomNameVisible', name: 'Show Name', type: 'boolean', category: 'universal', description: 'Whether the custom name is always visible', defaultValue: false },
    { id: 'NoGravity', name: 'No Gravity', type: 'boolean', category: 'universal', description: 'Entity is not affected by gravity', defaultValue: false },
    { id: 'Invulnerable', name: 'Invulnerable', type: 'boolean', category: 'universal', description: 'Entity cannot be damaged', defaultValue: false },
    { id: 'Silent', name: 'Silent', type: 'boolean', category: 'universal', description: 'Entity does not make sounds', defaultValue: false },
    { id: 'Glowing', name: 'Glowing', type: 'boolean', category: 'universal', description: 'Entity has glowing outline', defaultValue: false },
    { id: 'NoAI', name: 'No AI', type: 'boolean', category: 'universal', description: 'Entity has no artificial intelligence', defaultValue: false },
    { id: 'PersistenceRequired', name: 'Persistence Required', type: 'boolean', category: 'universal', description: 'Mob will not despawn', defaultValue: false },
    { id: 'Tags', name: 'Tags', type: 'array', category: 'universal', description: 'Entity scoreboard tags' },

    // Mob-specific Tags
    { id: 'Health', name: 'Health', type: 'slider', category: 'mob', description: 'Current health points', defaultValue: 20, min: 1, max: 2024 },
    { id: 'IsBaby', name: 'Is Baby', type: 'boolean', category: 'mob', description: 'Mob is a baby', defaultValue: false },
    { id: 'CanPickUpLoot', name: 'Can Pick Up Loot', type: 'boolean', category: 'mob', description: 'Mob can pick up items', defaultValue: false },

    // Creeper
    { id: 'Fuse', name: 'Fuse Time', type: 'number', category: 'specific', description: 'Creeper fuse time in ticks', defaultValue: 30, applicableTo: ['creeper'] },
    { id: 'ExplosionRadius', name: 'Explosion Radius', type: 'slider', category: 'specific', description: 'Creeper explosion radius', defaultValue: 3, min: 0, max: 10, applicableTo: ['creeper', 'ghast', 'fireball'] },
    { id: 'powered', name: 'Charged', type: 'boolean', category: 'specific', description: 'Creeper is charged', defaultValue: false, applicableTo: ['creeper'] },
    { id: 'ignited', name: 'Ignited', type: 'boolean', category: 'specific', description: 'Creeper is ignited', defaultValue: false, applicableTo: ['creeper'] },

    // Slime/Magma Cube
    { id: 'Size', name: 'Size', type: 'slider', category: 'specific', description: 'Size of slime/magma cube', defaultValue: 1, min: 0, max: 10, applicableTo: ['slime', 'magma_cube'] },

    // Zombie
    { id: 'CanBreakDoors', name: 'Can Break Doors', type: 'boolean', category: 'specific', description: 'Zombie can break doors', defaultValue: false, applicableTo: ['zombie'] },
    { id: 'DrownedConversionTime', name: 'Drowned Conversion Time', type: 'number', category: 'specific', description: 'Time until zombie converts to drowned', defaultValue: -1, applicableTo: ['zombie'] },

    // Horse
    { id: 'Variant', name: 'Variant', type: 'number', category: 'specific', description: 'Horse variant/color', defaultValue: 0, applicableTo: ['horse', 'llama', 'trader_llama', 'tropical_fish'] },
    { id: 'Tame', name: 'Tamed', type: 'boolean', category: 'specific', description: 'Animal is tamed', defaultValue: false, applicableTo: ['horse', 'donkey', 'mule', 'llama', 'wolf', 'cat', 'parrot', 'camel'] },

    // Sheep
    { id: 'Sheared', name: 'Sheared', type: 'boolean', category: 'specific', description: 'Sheep is sheared', defaultValue: false, applicableTo: ['sheep'] },
    { id: 'Color', name: 'Color', type: 'slider', category: 'specific', description: 'Wool/collar color (0-15)', defaultValue: 0, min: 0, max: 15, applicableTo: ['sheep', 'wolf', 'cat', 'shulker'] },

    // Armor Stand
    { id: 'Small', name: 'Small', type: 'boolean', category: 'specific', description: 'Armor stand is small', defaultValue: false, applicableTo: ['armor_stand'] },
    { id: 'Marker', name: 'Marker', type: 'boolean', category: 'specific', description: 'Armor stand is a marker (no hitbox)', defaultValue: false, applicableTo: ['armor_stand'] },
    { id: 'Invisible', name: 'Invisible', type: 'boolean', category: 'specific', description: 'Armor stand is invisible', defaultValue: false, applicableTo: ['armor_stand'] },
    { id: 'ShowArms', name: 'Show Arms', type: 'boolean', category: 'specific', description: 'Armor stand shows arms', defaultValue: false, applicableTo: ['armor_stand'] },
    { id: 'NoBasePlate', name: 'No Base Plate', type: 'boolean', category: 'specific', description: 'Armor stand has no base plate', defaultValue: false, applicableTo: ['armor_stand'] },

    // Villager
    { id: 'VillagerData', name: 'Profession', type: 'select', category: 'specific', description: 'Villager profession', applicableTo: ['villager'], options: [
        { value: 'none', label: 'None' },
        { value: 'armorer', label: 'Armorer' },
        { value: 'butcher', label: 'Butcher' },
        { value: 'cartographer', label: 'Cartographer' },
        { value: 'cleric', label: 'Cleric' },
        { value: 'farmer', label: 'Farmer' },
        { value: 'fisherman', label: 'Fisherman' },
        { value: 'fletcher', label: 'Fletcher' },
        { value: 'leatherworker', label: 'Leatherworker' },
        { value: 'librarian', label: 'Librarian' },
        { value: 'mason', label: 'Mason' },
        { value: 'nitwit', label: 'Nitwit' },
        { value: 'shepherd', label: 'Shepherd' },
        { value: 'toolsmith', label: 'Toolsmith' },
        { value: 'weaponsmith', label: 'Weaponsmith' },
    ] },
];

export const potionEffects: PotionEffect[] = [
    { id: 'speed', name: 'Speed', color: '#7CAFC2' },
    { id: 'slowness', name: 'Slowness', color: '#5A6C81' },
    { id: 'haste', name: 'Haste', color: '#D9C043' },
    { id: 'mining_fatigue', name: 'Mining Fatigue', color: '#4A4217' },
    { id: 'strength', name: 'Strength', color: '#932423' },
    { id: 'instant_health', name: 'Instant Health', color: '#F82423' },
    { id: 'instant_damage', name: 'Instant Damage', color: '#430A09' },
    { id: 'jump_boost', name: 'Jump Boost', color: '#22FF4C' },
    { id: 'nausea', name: 'Nausea', color: '#551D4A' },
    { id: 'regeneration', name: 'Regeneration', color: '#CD5CAB' },
    { id: 'resistance', name: 'Resistance', color: '#99453A' },
    { id: 'fire_resistance', name: 'Fire Resistance', color: '#E49A3A' },
    { id: 'water_breathing', name: 'Water Breathing', color: '#2E5299' },
    { id: 'invisibility', name: 'Invisibility', color: '#7F8392' },
    { id: 'blindness', name: 'Blindness', color: '#1F1F23' },
    { id: 'night_vision', name: 'Night Vision', color: '#1F1FA1' },
    { id: 'hunger', name: 'Hunger', color: '#587653' },
    { id: 'weakness', name: 'Weakness', color: '#484D48' },
    { id: 'poison', name: 'Poison', color: '#4E9331' },
    { id: 'wither', name: 'Wither', color: '#352A27' },
    { id: 'health_boost', name: 'Health Boost', color: '#F87D23' },
    { id: 'absorption', name: 'Absorption', color: '#2552A5' },
    { id: 'saturation', name: 'Saturation', color: '#F82421' },
    { id: 'glowing', name: 'Glowing', color: '#94A061' },
    { id: 'levitation', name: 'Levitation', color: '#CEFFFF' },
    { id: 'luck', name: 'Luck', color: '#339900' },
    { id: 'unluck', name: 'Bad Luck', color: '#C0A44D' },
    { id: 'slow_falling', name: 'Slow Falling', color: '#F7F7D6' },
    { id: 'conduit_power', name: 'Conduit Power', color: '#1DC2D1' },
    { id: 'dolphins_grace', name: "Dolphin's Grace", color: '#88A3BE' },
    { id: 'bad_omen', name: 'Bad Omen', color: '#0B6138' },
    { id: 'hero_of_the_village', name: 'Hero of the Village', color: '#44FF44' },
    { id: 'darkness', name: 'Darkness', color: '#292921' },
];

export const attributes: Attribute[] = [
    { id: 'generic.max_health', name: 'Max Health', defaultValue: 20, min: 1, max: 2048 },
    { id: 'generic.follow_range', name: 'Follow Range', defaultValue: 32, min: 0, max: 2048 },
    { id: 'generic.knockback_resistance', name: 'Knockback Resistance', defaultValue: 0, min: 0, max: 1 },
    { id: 'generic.movement_speed', name: 'Movement Speed', defaultValue: 0.7, min: 0, max: 10 },
    { id: 'generic.attack_damage', name: 'Attack Damage', defaultValue: 2, min: 0, max: 2048 },
    { id: 'generic.attack_knockback', name: 'Attack Knockback', defaultValue: 0, min: 0, max: 5 },
    { id: 'generic.attack_speed', name: 'Attack Speed', defaultValue: 4, min: 0, max: 1024 },
    { id: 'generic.armor', name: 'Armor', defaultValue: 0, min: 0, max: 30 },
    { id: 'generic.armor_toughness', name: 'Armor Toughness', defaultValue: 0, min: 0, max: 20 },
    { id: 'generic.luck', name: 'Luck', defaultValue: 0, min: -1024, max: 1024 },
];

export const equipmentSlots: EquipmentSlot[] = [
    { id: 'head', name: 'Helmet' },
    { id: 'chest', name: 'Chestplate' },
    { id: 'legs', name: 'Leggings' },
    { id: 'feet', name: 'Boots' },
    { id: 'mainhand', name: 'Main Hand' },
    { id: 'offhand', name: 'Off Hand' },
];

export const entityPresets: EntityPreset[] = [
    {
        id: 'invincible_armor_stand',
        name: 'Invincible Armor Stand',
        description: 'An invincible, invisible armor stand with arms',
        entityId: 'armor_stand',
        nbt: {
            Invulnerable: true,
            Invisible: true,
            ShowArms: true,
            NoBasePlate: true,
        },
    },
    {
        id: 'giant_zombie',
        name: 'Giant Zombie',
        description: 'A huge zombie with high health',
        entityId: 'zombie',
        nbt: {
            Health: 100,
            CustomName: '{"text":"Giant Zombie","color":"red"}',
            CustomNameVisible: true,
            Attributes: [
                { Name: 'generic.max_health', Base: 100 },
                { Name: 'generic.attack_damage', Base: 10 },
            ],
        },
    },
    {
        id: 'charged_creeper',
        name: 'Charged Creeper',
        description: 'A powered creeper with large explosion',
        entityId: 'creeper',
        nbt: {
            powered: true,
            ExplosionRadius: 5,
            CustomName: '{"text":"Charged Creeper","color":"aqua"}',
            CustomNameVisible: true,
        },
    },
    {
        id: 'equipped_skeleton',
        name: 'Fully Equipped Skeleton',
        description: 'A skeleton with diamond armor and bow',
        entityId: 'skeleton',
        nbt: {
            ArmorItems: [
                { id: 'diamond_boots', Count: 1 },
                { id: 'diamond_leggings', Count: 1 },
                { id: 'diamond_chestplate', Count: 1 },
                { id: 'diamond_helmet', Count: 1 },
            ],
            HandItems: [
                { id: 'bow', Count: 1 },
                {},
            ],
            ArmorDropChances: [0.0, 0.0, 0.0, 0.0],
        },
    },
    {
        id: 'baby_zombie_chicken',
        name: 'Baby Zombie Riding Chicken',
        description: 'A baby zombie jockey on a chicken',
        entityId: 'chicken',
        nbt: {
            Passengers: [
                {
                    id: 'minecraft:zombie',
                    IsBaby: true,
                    CustomName: '{"text":"Jockey","color":"green"}',
                },
            ],
        },
    },
];

export function getEntitiesByCategory(category: EntityCategory): Entity[] {
    return entities.filter((entity) => entity.category === category);
}

export function getEntityById(id: string): Entity | undefined {
    return entities.find((entity) => entity.id === id);
}

export function getNBTTagsForEntity(entityId: string): NBTTag[] {
    const entity = getEntityById(entityId);
    if (!entity) {
        return [];
    }

    return nbtTags.filter((tag) => {
        if (tag.category === 'universal') {
            return true;
        }
        if (tag.category === 'mob' && entity.canHaveEquipment) {
            return true;
        }
        if (tag.category === 'specific' && tag.applicableTo?.includes(entityId)) {
            return true;
        }
        return false;
    });
}

export function generateSummonCommand(
    entityId: string,
    position: { x: number; y: number; z: number },
    nbt: Record<string, any>,
): string {
    let command = `/summon minecraft:${entityId} ${position.x} ${position.y} ${position.z}`;

    if (Object.keys(nbt).length > 0) {
        command += ` ${JSON.stringify(nbt)}`;
    }

    return command;
}
