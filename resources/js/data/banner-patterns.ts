export interface BannerPattern {
    id: string;
    name: string;
    craftable: boolean;
}

export const bannerPatterns: BannerPattern[] = [
    // Base patterns (no pattern, just base color)
    { id: 'base', name: 'Base', craftable: false },

    // Craftable patterns
    { id: 'square_bottom_left', name: 'Square Bottom Left', craftable: true },
    { id: 'square_bottom_right', name: 'Square Bottom Right', craftable: true },
    { id: 'square_top_left', name: 'Square Top Left', craftable: true },
    { id: 'square_top_right', name: 'Square Top Right', craftable: true },
    { id: 'stripe_bottom', name: 'Stripe Bottom', craftable: true },
    { id: 'stripe_top', name: 'Stripe Top', craftable: true },
    { id: 'stripe_left', name: 'Stripe Left', craftable: true },
    { id: 'stripe_right', name: 'Stripe Right', craftable: true },
    { id: 'stripe_center', name: 'Stripe Center', craftable: true },
    { id: 'stripe_middle', name: 'Stripe Middle', craftable: true },
    { id: 'stripe_downright', name: 'Stripe Downright', craftable: true },
    { id: 'stripe_downleft', name: 'Stripe Downleft', craftable: true },
    { id: 'small_stripes', name: 'Small Stripes', craftable: true },
    { id: 'cross', name: 'Cross', craftable: true },
    { id: 'straight_cross', name: 'Straight Cross', craftable: true },
    { id: 'diagonal_left', name: 'Diagonal Left', craftable: true },
    { id: 'diagonal_up_right', name: 'Diagonal Up Right', craftable: true },
    { id: 'diagonal_up_left', name: 'Diagonal Up Left', craftable: true },
    { id: 'diagonal_right', name: 'Diagonal Right', craftable: true },
    { id: 'circle', name: 'Circle', craftable: true },
    { id: 'rhombus', name: 'Rhombus', craftable: true },
    { id: 'half_vertical', name: 'Half Vertical', craftable: true },
    { id: 'half_horizontal', name: 'Half Horizontal', craftable: true },
    { id: 'half_vertical_right', name: 'Half Vertical Right', craftable: true },
    { id: 'half_horizontal_bottom', name: 'Half Horizontal Bottom', craftable: true },
    { id: 'border', name: 'Border', craftable: true },
    { id: 'curly_border', name: 'Curly Border', craftable: true },
    { id: 'gradient', name: 'Gradient', craftable: true },
    { id: 'gradient_up', name: 'Gradient Up', craftable: true },
    { id: 'bricks', name: 'Bricks', craftable: true },
    { id: 'triangle_bottom', name: 'Triangle Bottom', craftable: true },
    { id: 'triangle_top', name: 'Triangle Top', craftable: true },
    { id: 'triangles_bottom', name: 'Triangles Bottom', craftable: true },
    { id: 'triangles_top', name: 'Triangles Top', craftable: true },

    // Special patterns (require special items)
    { id: 'creeper', name: 'Creeper Charge', craftable: false },
    { id: 'skull', name: 'Skull Charge', craftable: false },
    { id: 'flower', name: 'Flower Charge', craftable: false },
    { id: 'mojang', name: 'Thing', craftable: false },
    { id: 'globe', name: 'Globe', craftable: false },
    { id: 'piglin', name: 'Snout', craftable: false },
    { id: 'flow', name: 'Flow', craftable: false },
    { id: 'guster', name: 'Guster', craftable: false },
];
