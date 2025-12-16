export interface Ingredient {
    id: string;
    name: string;
    type: 'base' | 'modifier' | 'effect';
}

export interface PotionEffect {
    name: string;
    duration?: string;
    level?: string;
    description: string;
}

export interface Potion {
    id: string;
    name: string;
    color: string; // OKLCH color
    baseIngredient: string;
    modifiers?: string[];
    effects: PotionEffect[];
    brewingPath: string[];
    tips?: string[];
}

export const baseIngredients: Ingredient[] = [
    { id: 'water_bottle', name: 'Water Bottle', type: 'base' },
    { id: 'nether_wart', name: 'Nether Wart', type: 'base' },
    { id: 'blaze_powder', name: 'Blaze Powder', type: 'base' },
];

export const modifierIngredients: Ingredient[] = [
    { id: 'redstone', name: 'Redstone', type: 'modifier' },
    { id: 'glowstone', name: 'Glowstone Dust', type: 'modifier' },
    { id: 'gunpowder', name: 'Gunpowder', type: 'modifier' },
    { id: 'dragons_breath', name: "Dragon's Breath", type: 'modifier' },
    { id: 'fermented_spider_eye', name: 'Fermented Spider Eye', type: 'modifier' },
];

export const effectIngredients: Ingredient[] = [
    { id: 'golden_carrot', name: 'Golden Carrot', type: 'effect' },
    { id: 'ghast_tear', name: 'Ghast Tear', type: 'effect' },
    { id: 'blaze_powder_effect', name: 'Blaze Powder', type: 'effect' },
    { id: 'sugar', name: 'Sugar', type: 'effect' },
    { id: 'magma_cream', name: 'Magma Cream', type: 'effect' },
    { id: 'rabbit_foot', name: 'Rabbit Foot', type: 'effect' },
    { id: 'glistering_melon', name: 'Glistering Melon Slice', type: 'effect' },
    { id: 'spider_eye', name: 'Spider Eye', type: 'effect' },
    { id: 'pufferfish', name: 'Pufferfish', type: 'effect' },
    { id: 'phantom_membrane', name: 'Phantom Membrane', type: 'effect' },
    { id: 'turtle_shell', name: 'Turtle Shell', type: 'effect' },
];

export const potions: Potion[] = [
    {
        id: 'healing',
        name: 'Healing',
        color: 'oklch(0.65 0.20 0)',
        baseIngredient: 'glistering_melon',
        modifiers: ['glowstone'],
        effects: [
            {
                name: 'Instant Health',
                level: 'I',
                description: 'Restores 4 hearts instantly',
            },
            {
                name: 'Instant Health II',
                level: 'II',
                description: 'Restores 8 hearts instantly (with Glowstone)',
            },
        ],
        brewingPath: ['water_bottle', 'nether_wart', 'glistering_melon'],
        tips: [
            'Cannot be extended with Redstone',
            'Glowstone increases healing from 4 to 8 hearts',
        ],
    },
    {
        id: 'regeneration',
        name: 'Regeneration',
        color: 'oklch(0.70 0.18 330)',
        baseIngredient: 'ghast_tear',
        modifiers: ['redstone', 'glowstone'],
        effects: [
            {
                name: 'Regeneration',
                duration: '45s',
                level: 'I',
                description: 'Regenerates 9 hearts over 45 seconds',
            },
            {
                name: 'Regeneration (Extended)',
                duration: '1:30',
                level: 'I',
                description: 'Regenerates 18 hearts over 1:30 (with Redstone)',
            },
            {
                name: 'Regeneration II',
                duration: '22s',
                level: 'II',
                description: 'Regenerates 9 hearts over 22 seconds (with Glowstone)',
            },
        ],
        brewingPath: ['water_bottle', 'nether_wart', 'ghast_tear'],
        tips: [
            'One of the most valuable potions for combat',
            'Ghast Tears can be obtained from Ghasts in the Nether',
        ],
    },
    {
        id: 'strength',
        name: 'Strength',
        color: 'oklch(0.55 0.22 30)',
        baseIngredient: 'blaze_powder_effect',
        modifiers: ['redstone', 'glowstone'],
        effects: [
            {
                name: 'Strength',
                duration: '3:00',
                level: 'I',
                description: 'Increases melee damage by 3',
            },
            {
                name: 'Strength (Extended)',
                duration: '8:00',
                level: 'I',
                description: 'Increases melee damage by 3 for 8 minutes (with Redstone)',
            },
            {
                name: 'Strength II',
                duration: '1:30',
                level: 'II',
                description: 'Increases melee damage by 6 (with Glowstone)',
            },
        ],
        brewingPath: ['water_bottle', 'nether_wart', 'blaze_powder'],
        tips: [
            'Essential for combat and boss fights',
            'Blaze Powder is also used as brewing fuel',
        ],
    },
    {
        id: 'swiftness',
        name: 'Swiftness',
        color: 'oklch(0.75 0.15 210)',
        baseIngredient: 'sugar',
        modifiers: ['redstone', 'glowstone'],
        effects: [
            {
                name: 'Speed',
                duration: '3:00',
                level: 'I',
                description: 'Increases movement speed by 20%',
            },
            {
                name: 'Speed (Extended)',
                duration: '8:00',
                level: 'I',
                description: 'Increases movement speed by 20% for 8 minutes (with Redstone)',
            },
            {
                name: 'Speed II',
                duration: '1:30',
                level: 'II',
                description: 'Increases movement speed by 40% (with Glowstone)',
            },
        ],
        brewingPath: ['water_bottle', 'nether_wart', 'sugar'],
        tips: [
            'Great for exploration and travel',
            'Sugar can be crafted from sugar cane',
        ],
    },
    {
        id: 'night_vision',
        name: 'Night Vision',
        color: 'oklch(0.45 0.15 240)',
        baseIngredient: 'golden_carrot',
        modifiers: ['redstone'],
        effects: [
            {
                name: 'Night Vision',
                duration: '3:00',
                description: 'See clearly in darkness and underwater',
            },
            {
                name: 'Night Vision (Extended)',
                duration: '8:00',
                description: 'See clearly for 8 minutes (with Redstone)',
            },
        ],
        brewingPath: ['water_bottle', 'nether_wart', 'golden_carrot'],
        tips: [
            'Cannot be enhanced with Glowstone',
            'Essential for mining and cave exploration',
            'Golden Carrots are crafted with gold nuggets and carrots',
        ],
    },
    {
        id: 'invisibility',
        name: 'Invisibility',
        color: 'oklch(0.85 0.05 240)',
        baseIngredient: 'fermented_spider_eye',
        modifiers: ['redstone'],
        effects: [
            {
                name: 'Invisibility',
                duration: '3:00',
                description: 'Makes player invisible (armor still visible)',
            },
            {
                name: 'Invisibility (Extended)',
                duration: '8:00',
                description: 'Invisible for 8 minutes (with Redstone)',
            },
        ],
        brewingPath: [
            'water_bottle',
            'nether_wart',
            'golden_carrot',
            'fermented_spider_eye',
        ],
        tips: [
            'Brewed from Night Vision potion with Fermented Spider Eye',
            'Armor and held items are still visible',
            'Mobs can still detect you if too close',
        ],
    },
    {
        id: 'fire_resistance',
        name: 'Fire Resistance',
        color: 'oklch(0.60 0.25 40)',
        baseIngredient: 'magma_cream',
        modifiers: ['redstone'],
        effects: [
            {
                name: 'Fire Resistance',
                duration: '3:00',
                description: 'Immunity to fire and lava damage',
            },
            {
                name: 'Fire Resistance (Extended)',
                duration: '8:00',
                description: 'Fire immunity for 8 minutes (with Redstone)',
            },
        ],
        brewingPath: ['water_bottle', 'nether_wart', 'magma_cream'],
        tips: [
            'Cannot be enhanced with Glowstone',
            'Essential for Nether exploration',
            'Magma Cream is crafted from Slime Ball and Blaze Powder',
        ],
    },
    {
        id: 'water_breathing',
        name: 'Water Breathing',
        color: 'oklch(0.60 0.20 240)',
        baseIngredient: 'pufferfish',
        modifiers: ['redstone'],
        effects: [
            {
                name: 'Water Breathing',
                duration: '3:00',
                description: 'Breathe underwater without oxygen bar depleting',
            },
            {
                name: 'Water Breathing (Extended)',
                duration: '8:00',
                description: 'Water breathing for 8 minutes (with Redstone)',
            },
        ],
        brewingPath: ['water_bottle', 'nether_wart', 'pufferfish'],
        tips: [
            'Cannot be enhanced with Glowstone',
            'Perfect for underwater exploration',
            'Pufferfish can be caught while fishing',
        ],
    },
    {
        id: 'poison',
        name: 'Poison',
        color: 'oklch(0.50 0.18 140)',
        baseIngredient: 'spider_eye',
        modifiers: ['redstone', 'glowstone'],
        effects: [
            {
                name: 'Poison',
                duration: '45s',
                level: 'I',
                description: 'Deals damage over time (cannot reduce below 1 heart)',
            },
            {
                name: 'Poison (Extended)',
                duration: '1:30',
                level: 'I',
                description: 'Poison for 1:30 (with Redstone)',
            },
            {
                name: 'Poison II',
                duration: '21s',
                level: 'II',
                description: 'Stronger poison damage (with Glowstone)',
            },
        ],
        brewingPath: ['water_bottle', 'nether_wart', 'spider_eye'],
        tips: [
            'Cannot kill - only reduces health to half a heart',
            'Spider Eyes drop from spiders and cave spiders',
            'Useful for splash potions in combat',
        ],
    },
    {
        id: 'weakness',
        name: 'Weakness',
        color: 'oklch(0.45 0.10 0)',
        baseIngredient: 'fermented_spider_eye',
        modifiers: ['redstone'],
        effects: [
            {
                name: 'Weakness',
                duration: '1:30',
                description: 'Reduces melee damage by 4',
            },
            {
                name: 'Weakness (Extended)',
                duration: '4:00',
                description: 'Weakness for 4 minutes (with Redstone)',
            },
        ],
        brewingPath: ['water_bottle', 'fermented_spider_eye'],
        tips: [
            'Can be brewed without Nether Wart',
            'Used to cure zombie villagers',
            'Cannot be enhanced with Glowstone',
        ],
    },
    {
        id: 'slowness',
        name: 'Slowness',
        color: 'oklch(0.40 0.12 240)',
        baseIngredient: 'fermented_spider_eye',
        modifiers: ['redstone', 'glowstone'],
        effects: [
            {
                name: 'Slowness',
                duration: '1:30',
                level: 'I',
                description: 'Decreases movement speed by 15%',
            },
            {
                name: 'Slowness (Extended)',
                duration: '4:00',
                level: 'I',
                description: 'Slowness for 4 minutes (with Redstone)',
            },
            {
                name: 'Slowness IV',
                duration: '20s',
                level: 'IV',
                description: 'Severe slowness (with Glowstone)',
            },
        ],
        brewingPath: [
            'water_bottle',
            'nether_wart',
            'sugar',
            'fermented_spider_eye',
        ],
        tips: [
            'Brewed from Swiftness potion with Fermented Spider Eye',
            'Or from Leaping potion with Fermented Spider Eye',
        ],
    },
    {
        id: 'harming',
        name: 'Harming',
        color: 'oklch(0.40 0.25 20)',
        baseIngredient: 'fermented_spider_eye',
        modifiers: ['glowstone'],
        effects: [
            {
                name: 'Instant Damage',
                level: 'I',
                description: 'Deals 6 damage instantly',
            },
            {
                name: 'Instant Damage II',
                level: 'II',
                description: 'Deals 12 damage instantly (with Glowstone)',
            },
        ],
        brewingPath: [
            'water_bottle',
            'nether_wart',
            'spider_eye',
            'fermented_spider_eye',
        ],
        tips: [
            'Cannot be extended with Redstone',
            'Brewed from Poison or Healing with Fermented Spider Eye',
            'Very effective as splash potions',
        ],
    },
    {
        id: 'turtle_master',
        name: 'Turtle Master',
        color: 'oklch(0.50 0.15 180)',
        baseIngredient: 'turtle_shell',
        modifiers: ['redstone', 'glowstone'],
        effects: [
            {
                name: 'Slowness IV + Resistance III',
                duration: '20s',
                description: 'Greatly reduces speed but increases resistance',
            },
            {
                name: 'Slowness IV + Resistance III (Extended)',
                duration: '40s',
                description: 'Extended turtle master effects (with Redstone)',
            },
            {
                name: 'Slowness VI + Resistance IV',
                duration: '20s',
                description: 'Maximum turtle master effects (with Glowstone)',
            },
        ],
        brewingPath: ['water_bottle', 'nether_wart', 'turtle_shell'],
        tips: [
            'Unique potion with both positive and negative effects',
            'Turtle Shell is crafted from 5 scutes',
            'Useful for tanking heavy damage',
        ],
    },
    {
        id: 'slow_falling',
        name: 'Slow Falling',
        color: 'oklch(0.80 0.10 240)',
        baseIngredient: 'phantom_membrane',
        modifiers: ['redstone'],
        effects: [
            {
                name: 'Slow Falling',
                duration: '1:30',
                description: 'Fall slowly and take no fall damage',
            },
            {
                name: 'Slow Falling (Extended)',
                duration: '4:00',
                description: 'Slow falling for 4 minutes (with Redstone)',
            },
        ],
        brewingPath: ['water_bottle', 'nether_wart', 'phantom_membrane'],
        tips: [
            'Cannot be enhanced with Glowstone',
            'Phantom Membrane drops from Phantoms',
            'Great for building and exploration',
        ],
    },
    {
        id: 'leaping',
        name: 'Leaping',
        color: 'oklch(0.65 0.18 120)',
        baseIngredient: 'rabbit_foot',
        modifiers: ['redstone', 'glowstone'],
        effects: [
            {
                name: 'Jump Boost',
                duration: '3:00',
                level: 'I',
                description: 'Increases jump height by 0.5 blocks',
            },
            {
                name: 'Jump Boost (Extended)',
                duration: '8:00',
                level: 'I',
                description: 'Jump boost for 8 minutes (with Redstone)',
            },
            {
                name: 'Jump Boost II',
                duration: '1:30',
                level: 'II',
                description: 'Increases jump height by 1.25 blocks (with Glowstone)',
            },
        ],
        brewingPath: ['water_bottle', 'nether_wart', 'rabbit_foot'],
        tips: [
            'Rabbit Foot has 10% drop rate from rabbits',
            'Can be corrupted to Slowness with Fermented Spider Eye',
        ],
    },
    {
        id: 'luck',
        name: 'Luck',
        color: 'oklch(0.70 0.20 140)',
        baseIngredient: 'luck',
        modifiers: ['redstone'],
        effects: [
            {
                name: 'Luck',
                duration: '5:00',
                level: 'I',
                description: 'Increases chance of finding treasure while fishing',
            },
        ],
        brewingPath: [],
        tips: [
            'Not brewable in survival mode',
            'Only available through commands',
            'Can still be found in creative inventory',
        ],
    },
];

export const brewingSteps = [
    {
        step: 1,
        name: 'Add Blaze Powder to Fuel the Brewing Stand',
        description:
            'Place Blaze Powder in the fuel slot on the left side of the brewing stand.',
    },
    {
        step: 2,
        name: 'Place Water Bottles in the Brewing Stand',
        description: 'You can brew up to 3 potions at once using 3 water bottles.',
    },
    {
        step: 3,
        name: 'Add Nether Wart',
        description:
            'This creates an Awkward Potion, the base for most effect potions.',
    },
    {
        step: 4,
        name: 'Add Effect Ingredient',
        description:
            'Add the ingredient for the desired potion effect (e.g., Sugar for Swiftness).',
    },
    {
        step: 5,
        name: 'Optional: Modify the Potion',
        description:
            'Add Redstone for duration, Glowstone for potency, Gunpowder for splash, or Dragon\'s Breath for lingering.',
    },
];

export const modifierEffects = {
    redstone: {
        name: 'Redstone',
        effect: 'Extends duration',
        description: 'Increases potion duration (usually from 3:00 to 8:00)',
    },
    glowstone: {
        name: 'Glowstone Dust',
        effect: 'Increases potency',
        description: 'Increases potion level (e.g., from I to II)',
    },
    gunpowder: {
        name: 'Gunpowder',
        effect: 'Creates splash potion',
        description: 'Makes potion throwable, affects area on impact',
    },
    dragons_breath: {
        name: "Dragon's Breath",
        effect: 'Creates lingering potion',
        description: 'Creates area effect cloud, used for tipped arrows',
    },
    fermented_spider_eye: {
        name: 'Fermented Spider Eye',
        effect: 'Corrupts potion',
        description: 'Transforms potion into different effect (often negative)',
    },
};

export function getPotionsByEffect(searchTerm: string): Potion[] {
    const term = searchTerm.toLowerCase();
    return potions.filter(
        (potion) =>
            potion.name.toLowerCase().includes(term) ||
            potion.effects.some((effect) =>
                effect.name.toLowerCase().includes(term),
            ) ||
            potion.effects.some((effect) =>
                effect.description.toLowerCase().includes(term),
            ),
    );
}

export function getBrewingPathSteps(potion: Potion): Array<{
    step: number;
    ingredient: string;
    result: string;
}> {
    return potion.brewingPath.map((ingredient, index) => ({
        step: index + 1,
        ingredient,
        result:
            index === 0
                ? 'Water Bottle'
                : index === 1
                  ? 'Awkward Potion'
                  : index === potion.brewingPath.length - 1
                    ? potion.name
                    : 'Intermediate Potion',
    }));
}
