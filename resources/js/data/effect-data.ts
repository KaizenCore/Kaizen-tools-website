export interface Effect {
    id: string;
    name: string;
    category: 'Positive' | 'Negative' | 'Neutral';
    color: string;
    maxUsefulAmplifier: number;
    description: string;
    incompatibleWith: string[];
}

export const effectCategories = ['All', 'Positive', 'Negative', 'Neutral'] as const;
export type EffectCategory = (typeof effectCategories)[number];

export const effects: Effect[] = [
    // Positive Effects
    {
        id: 'speed',
        name: 'Speed',
        category: 'Positive',
        color: '#7CAFC2',
        maxUsefulAmplifier: 5,
        description: 'Increases walking speed',
        incompatibleWith: ['slowness'],
    },
    {
        id: 'haste',
        name: 'Haste',
        category: 'Positive',
        color: '#D9C043',
        maxUsefulAmplifier: 5,
        description: 'Increases mining and attack speed',
        incompatibleWith: ['mining_fatigue'],
    },
    {
        id: 'strength',
        name: 'Strength',
        category: 'Positive',
        color: '#932423',
        maxUsefulAmplifier: 5,
        description: 'Increases melee attack damage',
        incompatibleWith: ['weakness'],
    },
    {
        id: 'instant_health',
        name: 'Instant Health',
        category: 'Positive',
        color: '#F82423',
        maxUsefulAmplifier: 10,
        description: 'Heals instantly',
        incompatibleWith: ['instant_damage'],
    },
    {
        id: 'jump_boost',
        name: 'Jump Boost',
        category: 'Positive',
        color: '#22FF4C',
        maxUsefulAmplifier: 5,
        description: 'Increases jump height',
        incompatibleWith: [],
    },
    {
        id: 'regeneration',
        name: 'Regeneration',
        category: 'Positive',
        color: '#CD5CAB',
        maxUsefulAmplifier: 5,
        description: 'Regenerates health over time',
        incompatibleWith: [],
    },
    {
        id: 'resistance',
        name: 'Resistance',
        category: 'Positive',
        color: '#99453A',
        maxUsefulAmplifier: 5,
        description: 'Reduces incoming damage',
        incompatibleWith: [],
    },
    {
        id: 'fire_resistance',
        name: 'Fire Resistance',
        category: 'Positive',
        color: '#E49A3A',
        maxUsefulAmplifier: 0,
        description: 'Grants immunity to fire and lava damage',
        incompatibleWith: [],
    },
    {
        id: 'water_breathing',
        name: 'Water Breathing',
        category: 'Positive',
        color: '#2E5299',
        maxUsefulAmplifier: 0,
        description: 'Prevents drowning and improves underwater visibility',
        incompatibleWith: [],
    },
    {
        id: 'invisibility',
        name: 'Invisibility',
        category: 'Positive',
        color: '#7F8392',
        maxUsefulAmplifier: 0,
        description: 'Turns the player invisible',
        incompatibleWith: [],
    },
    {
        id: 'night_vision',
        name: 'Night Vision',
        category: 'Positive',
        color: '#1F1FA1',
        maxUsefulAmplifier: 0,
        description: 'Allows clear vision in darkness and underwater',
        incompatibleWith: [],
    },
    {
        id: 'health_boost',
        name: 'Health Boost',
        category: 'Positive',
        color: '#F87D23',
        maxUsefulAmplifier: 10,
        description: 'Increases maximum health',
        incompatibleWith: [],
    },
    {
        id: 'absorption',
        name: 'Absorption',
        category: 'Positive',
        color: '#2552A5',
        maxUsefulAmplifier: 10,
        description: 'Grants extra absorption hearts',
        incompatibleWith: [],
    },
    {
        id: 'saturation',
        name: 'Saturation',
        category: 'Positive',
        color: '#F82423',
        maxUsefulAmplifier: 5,
        description: 'Restores hunger and saturation instantly',
        incompatibleWith: [],
    },
    {
        id: 'luck',
        name: 'Luck',
        category: 'Positive',
        color: '#339900',
        maxUsefulAmplifier: 5,
        description: 'Increases luck, improving loot quality',
        incompatibleWith: ['unluck'],
    },
    {
        id: 'slow_falling',
        name: 'Slow Falling',
        category: 'Positive',
        color: '#F7F8E0',
        maxUsefulAmplifier: 0,
        description: 'Reduces fall speed and negates fall damage',
        incompatibleWith: [],
    },
    {
        id: 'conduit_power',
        name: 'Conduit Power',
        category: 'Positive',
        color: '#1DC2D1',
        maxUsefulAmplifier: 0,
        description: 'Grants water breathing, night vision, and haste underwater',
        incompatibleWith: [],
    },
    {
        id: 'dolphins_grace',
        name: "Dolphin's Grace",
        category: 'Positive',
        color: '#88A1AB',
        maxUsefulAmplifier: 0,
        description: 'Increases swimming speed',
        incompatibleWith: [],
    },
    {
        id: 'hero_of_the_village',
        name: 'Hero of the Village',
        category: 'Positive',
        color: '#44A400',
        maxUsefulAmplifier: 5,
        description: 'Provides discounts on trades and gifts from villagers',
        incompatibleWith: [],
    },

    // Negative Effects
    {
        id: 'slowness',
        name: 'Slowness',
        category: 'Negative',
        color: '#5A6C81',
        maxUsefulAmplifier: 5,
        description: 'Decreases walking speed',
        incompatibleWith: ['speed'],
    },
    {
        id: 'mining_fatigue',
        name: 'Mining Fatigue',
        category: 'Negative',
        color: '#4A4217',
        maxUsefulAmplifier: 5,
        description: 'Decreases mining and attack speed',
        incompatibleWith: ['haste'],
    },
    {
        id: 'instant_damage',
        name: 'Instant Damage',
        category: 'Negative',
        color: '#430A09',
        maxUsefulAmplifier: 10,
        description: 'Deals instant damage',
        incompatibleWith: ['instant_health'],
    },
    {
        id: 'nausea',
        name: 'Nausea',
        category: 'Negative',
        color: '#551D4A',
        maxUsefulAmplifier: 0,
        description: 'Distorts and warps the screen',
        incompatibleWith: [],
    },
    {
        id: 'blindness',
        name: 'Blindness',
        category: 'Negative',
        color: '#1F1F23',
        maxUsefulAmplifier: 0,
        description: 'Impairs vision with a thick black fog',
        incompatibleWith: [],
    },
    {
        id: 'hunger',
        name: 'Hunger',
        category: 'Negative',
        color: '#587653',
        maxUsefulAmplifier: 5,
        description: 'Depletes hunger bar faster',
        incompatibleWith: [],
    },
    {
        id: 'weakness',
        name: 'Weakness',
        category: 'Negative',
        color: '#484D48',
        maxUsefulAmplifier: 5,
        description: 'Decreases melee attack damage',
        incompatibleWith: ['strength'],
    },
    {
        id: 'poison',
        name: 'Poison',
        category: 'Negative',
        color: '#4E9331',
        maxUsefulAmplifier: 5,
        description: 'Damages health over time (leaves 1/2 heart)',
        incompatibleWith: [],
    },
    {
        id: 'wither',
        name: 'Wither',
        category: 'Negative',
        color: '#352A27',
        maxUsefulAmplifier: 5,
        description: 'Damages health over time (can kill)',
        incompatibleWith: [],
    },
    {
        id: 'unluck',
        name: 'Bad Luck',
        category: 'Negative',
        color: '#C0A44D',
        maxUsefulAmplifier: 5,
        description: 'Decreases luck, worsening loot quality',
        incompatibleWith: ['luck'],
    },
    {
        id: 'bad_omen',
        name: 'Bad Omen',
        category: 'Negative',
        color: '#0B6138',
        maxUsefulAmplifier: 5,
        description: 'Triggers a raid when entering a village',
        incompatibleWith: [],
    },
    {
        id: 'darkness',
        name: 'Darkness',
        category: 'Negative',
        color: '#000000',
        maxUsefulAmplifier: 0,
        description: 'Creates a pulsing darkness effect that limits vision',
        incompatibleWith: [],
    },
    {
        id: 'trial_omen',
        name: 'Trial Omen',
        category: 'Negative',
        color: '#1D3C73',
        maxUsefulAmplifier: 5,
        description: 'Makes trial spawner encounters more difficult',
        incompatibleWith: [],
    },
    {
        id: 'raid_omen',
        name: 'Raid Omen',
        category: 'Negative',
        color: '#0B6138',
        maxUsefulAmplifier: 5,
        description: 'Causes a raid to start when near a village',
        incompatibleWith: [],
    },
    {
        id: 'wind_charged',
        name: 'Wind Charged',
        category: 'Negative',
        color: '#61FFDB',
        maxUsefulAmplifier: 3,
        description: 'Releases wind burst when damaged',
        incompatibleWith: [],
    },
    {
        id: 'weaving',
        name: 'Weaving',
        category: 'Negative',
        color: '#7E3A2F',
        maxUsefulAmplifier: 3,
        description: 'Spawns cobwebs when damaged',
        incompatibleWith: [],
    },
    {
        id: 'oozing',
        name: 'Oozing',
        category: 'Negative',
        color: '#A0ACAF',
        maxUsefulAmplifier: 3,
        description: 'Spawns slimes when killed',
        incompatibleWith: [],
    },
    {
        id: 'infested',
        name: 'Infested',
        category: 'Negative',
        color: '#929494',
        maxUsefulAmplifier: 3,
        description: 'Spawns silverfish when damaged',
        incompatibleWith: [],
    },

    // Neutral Effects
    {
        id: 'glowing',
        name: 'Glowing',
        category: 'Neutral',
        color: '#94A061',
        maxUsefulAmplifier: 0,
        description: 'Outlines the entity with a glowing effect',
        incompatibleWith: [],
    },
    {
        id: 'levitation',
        name: 'Levitation',
        category: 'Neutral',
        color: '#CEFFFF',
        maxUsefulAmplifier: 5,
        description: 'Causes entity to float upwards',
        incompatibleWith: [],
    },
];

export interface EffectPreset {
    name: string;
    description: string;
    effects: {
        effectId: string;
        duration: number;
        amplifier: number;
        hideParticles: boolean;
    }[];
}

export const effectPresets: EffectPreset[] = [
    {
        name: 'Speed Runner',
        description: 'Enhanced mobility for fast travel',
        effects: [
            {
                effectId: 'speed',
                duration: 600,
                amplifier: 1,
                hideParticles: false,
            },
            {
                effectId: 'jump_boost',
                duration: 600,
                amplifier: 1,
                hideParticles: false,
            },
        ],
    },
    {
        name: 'Night Explorer',
        description: 'Perfect for cave and night exploration',
        effects: [
            {
                effectId: 'night_vision',
                duration: 600,
                amplifier: 0,
                hideParticles: true,
            },
            {
                effectId: 'fire_resistance',
                duration: 600,
                amplifier: 0,
                hideParticles: false,
            },
        ],
    },
    {
        name: 'Combat Ready',
        description: 'Enhanced combat capabilities',
        effects: [
            {
                effectId: 'strength',
                duration: 300,
                amplifier: 1,
                hideParticles: false,
            },
            {
                effectId: 'resistance',
                duration: 300,
                amplifier: 0,
                hideParticles: false,
            },
            {
                effectId: 'regeneration',
                duration: 300,
                amplifier: 0,
                hideParticles: false,
            },
        ],
    },
    {
        name: 'Water Explorer',
        description: 'Ideal for underwater exploration',
        effects: [
            {
                effectId: 'water_breathing',
                duration: 600,
                amplifier: 0,
                hideParticles: true,
            },
            {
                effectId: 'night_vision',
                duration: 600,
                amplifier: 0,
                hideParticles: true,
            },
            {
                effectId: 'dolphins_grace',
                duration: 600,
                amplifier: 0,
                hideParticles: false,
            },
        ],
    },
    {
        name: 'Clear All Effects',
        description: 'Remove all status effects',
        effects: [],
    },
];

export function getEffectById(id: string): Effect | undefined {
    return effects.find((e) => e.id === id);
}

export function getEffectsByCategory(category: EffectCategory): Effect[] {
    if (category === 'All') {
        return effects;
    }

    return effects.filter((e) => e.category === category);
}

export function areEffectsCompatible(effect1Id: string, effect2Id: string): boolean {
    const effect1 = getEffectById(effect1Id);
    const effect2 = getEffectById(effect2Id);

    if (!effect1 || !effect2) {
        return false;
    }

    return (
        !effect1.incompatibleWith.includes(effect2Id) &&
        !effect2.incompatibleWith.includes(effect1Id)
    );
}

export function formatAmplifier(amplifier: number): string {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

    if (amplifier < 10) {
        return romanNumerals[amplifier];
    }

    return String(amplifier + 1);
}

export const targetSelectors = [
    { value: '@a', label: '@a (All players)' },
    { value: '@p', label: '@p (Nearest player)' },
    { value: '@s', label: '@s (Self)' },
    { value: '@e', label: '@e (All entities)' },
    { value: '@r', label: '@r (Random player)' },
] as const;

export const durationPresets = [
    { label: '30s', value: 30 },
    { label: '1min', value: 60 },
    { label: '5min', value: 300 },
    { label: '10min', value: 600 },
    { label: 'Infinite', value: 1000000 },
] as const;
