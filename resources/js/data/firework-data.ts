export interface FireworkShape {
    id: string;
    name: string;
    ingredient: string | null;
}

export interface FireworkEffect {
    id: string;
    name: string;
    ingredient: string;
}

export const fireworkShapes: FireworkShape[] = [
    { id: 'small_ball', name: 'Small Ball', ingredient: null },
    { id: 'large_ball', name: 'Large Ball', ingredient: 'Fire Charge' },
    { id: 'star', name: 'Star', ingredient: 'Gold Nugget' },
    { id: 'creeper', name: 'Creeper Face', ingredient: 'Creeper Head' },
    { id: 'burst', name: 'Burst', ingredient: 'Feather' },
];

export const fireworkEffects: FireworkEffect[] = [
    { id: 'trail', name: 'Trail', ingredient: 'Diamond' },
    { id: 'twinkle', name: 'Twinkle', ingredient: 'Glowstone Dust' },
];

export const flightDurations = [1, 2, 3]; // gunpowder count
