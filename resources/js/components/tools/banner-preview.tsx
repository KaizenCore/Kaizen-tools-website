import { minecraftColors } from '@/data/minecraft-colors';
import type { MinecraftColor } from '@/data/minecraft-colors';

export interface BannerLayer {
    pattern: string;
    color: string;
}

interface BannerPreviewProps {
    baseColor: string;
    layers: BannerLayer[];
}

function getColorHex(colorId: string): string {
    const color = minecraftColors.find((c) => c.id === colorId);
    return color?.hex ?? '#F9FFFE';
}

function getPatternPath(pattern: string): string {
    switch (pattern) {
        case 'base':
            return '';
        case 'square_bottom_left':
            return 'M0,32 L0,64 L16,64 L16,32 Z';
        case 'square_bottom_right':
            return 'M16,32 L16,64 L32,64 L32,32 Z';
        case 'square_top_left':
            return 'M0,0 L0,32 L16,32 L16,0 Z';
        case 'square_top_right':
            return 'M16,0 L16,32 L32,32 L32,0 Z';
        case 'stripe_bottom':
            return 'M0,48 L0,64 L32,64 L32,48 Z';
        case 'stripe_top':
            return 'M0,0 L0,16 L32,16 L32,0 Z';
        case 'stripe_left':
            return 'M0,0 L0,64 L8,64 L8,0 Z';
        case 'stripe_right':
            return 'M24,0 L24,64 L32,64 L32,0 Z';
        case 'stripe_center':
            return 'M12,0 L12,64 L20,64 L20,0 Z';
        case 'stripe_middle':
            return 'M0,28 L0,36 L32,36 L32,28 Z';
        case 'stripe_downright':
            return 'M0,0 L32,64 L32,56 L8,0 Z';
        case 'stripe_downleft':
            return 'M0,56 L0,64 L24,0 L32,0 Z';
        case 'small_stripes':
            return 'M0,0 L0,8 L32,8 L32,0 Z M0,16 L0,24 L32,24 L32,16 Z M0,32 L0,40 L32,40 L32,32 Z M0,48 L0,56 L32,56 L32,48 Z';
        case 'cross':
            return 'M0,0 L8,8 L8,24 L0,32 L0,64 L32,64 L32,32 L24,24 L24,8 L32,0 Z';
        case 'straight_cross':
            return 'M12,0 L12,12 L0,12 L0,20 L12,20 L12,32 L20,32 L20,20 L32,20 L32,12 L20,12 L20,0 Z M0,44 L0,52 L12,52 L12,64 L20,64 L20,52 L32,52 L32,44 L20,44 L20,32 L12,32 L12,44 Z';
        case 'diagonal_left':
            return 'M0,0 L0,16 L16,64 L32,64 L32,48 L16,0 Z';
        case 'diagonal_up_right':
            return 'M16,0 L0,48 L0,64 L16,64 L32,16 L32,0 Z';
        case 'diagonal_up_left':
            return 'M0,0 L0,16 L16,64 L32,64 L32,48 L16,0 Z';
        case 'diagonal_right':
            return 'M0,48 L0,64 L16,64 L32,16 L32,0 L16,0 Z';
        case 'circle':
            return 'M8,4 L4,8 L4,24 L8,28 L24,28 L28,24 L28,8 L24,4 Z';
        case 'rhombus':
            return 'M16,0 L0,32 L16,64 L32,32 Z';
        case 'half_vertical':
            return 'M0,0 L0,64 L16,64 L16,0 Z';
        case 'half_horizontal':
            return 'M0,0 L0,32 L32,32 L32,0 Z';
        case 'half_vertical_right':
            return 'M16,0 L16,64 L32,64 L32,0 Z';
        case 'half_horizontal_bottom':
            return 'M0,32 L0,64 L32,64 L32,32 Z';
        case 'border':
            return 'M0,0 L0,64 L32,64 L32,0 Z M4,4 L4,60 L28,60 L28,4 Z';
        case 'curly_border':
            return 'M0,0 L0,64 L4,64 L4,4 L28,4 L28,60 L4,60 L4,64 L32,64 L32,0 Z M8,8 L8,12 L24,12 L24,8 Z M8,52 L8,56 L24,56 L24,52 Z';
        case 'gradient':
            return 'M0,0 L0,16 L32,16 L32,0 Z M0,16 L0,32 L32,32 L32,16 Z M0,32 L0,48 L32,48 L32,32 Z M0,48 L0,64 L32,64 L32,48 Z';
        case 'gradient_up':
            return 'M0,48 L0,64 L32,64 L32,48 Z M0,32 L0,48 L32,48 L32,32 Z M0,16 L0,32 L32,32 L32,16 Z M0,0 L0,16 L32,16 L32,0 Z';
        case 'bricks':
            return 'M0,0 L0,8 L32,8 L32,0 Z M0,8 L0,16 L16,16 L16,8 Z M16,8 L16,16 L32,16 L32,8 Z M0,16 L0,24 L32,24 L32,16 Z M0,24 L0,32 L16,32 L16,24 Z M16,24 L16,32 L32,32 L32,24 Z M0,32 L0,40 L32,40 L32,32 Z M0,40 L0,48 L16,48 L16,40 Z M16,40 L16,48 L32,48 L32,40 Z M0,48 L0,56 L32,56 L32,48 Z M0,56 L0,64 L16,64 L16,56 Z M16,56 L16,64 L32,64 L32,56 Z';
        case 'triangle_bottom':
            return 'M0,64 L16,32 L32,64 Z';
        case 'triangle_top':
            return 'M0,0 L16,32 L32,0 Z';
        case 'triangles_bottom':
            return 'M0,64 L8,48 L16,64 Z M16,64 L24,48 L32,64 Z';
        case 'triangles_top':
            return 'M0,0 L8,16 L16,0 Z M16,0 L24,16 L32,0 Z';
        case 'creeper':
            return 'M8,8 L8,16 L12,16 L12,8 Z M20,8 L20,16 L24,16 L24,8 Z M12,20 L12,24 L20,24 L20,20 Z M8,24 L8,28 L12,28 L12,24 Z M20,24 L20,28 L24,28 L24,24 Z';
        case 'skull':
            return 'M8,4 L8,12 L12,12 L12,4 Z M20,4 L20,12 L24,12 L24,4 Z M12,16 L12,20 L20,20 L20,16 Z M8,20 L8,24 L12,24 L12,20 Z M20,20 L20,24 L24,24 L24,20 Z M12,24 L12,28 L16,28 L16,24 Z M16,24 L16,28 L20,28 L20,24 Z';
        case 'flower':
            return 'M12,4 L12,12 L16,12 L16,4 Z M8,8 L8,12 L12,12 L12,8 Z M16,8 L16,12 L20,12 L20,8 Z M12,12 L12,20 L16,20 L16,12 Z M14,16 L14,24 L18,24 L18,16 Z';
        case 'mojang':
            return 'M4,4 L4,28 L28,28 L28,4 Z M8,8 L8,12 L12,12 L12,8 Z M20,8 L20,12 L24,12 L24,8 Z M12,16 L12,20 L20,20 L20,16 Z';
        case 'globe':
            return 'M16,0 L12,4 L8,4 L4,8 L4,24 L8,28 L12,28 L16,32 L20,28 L24,28 L28,24 L28,8 L24,4 L20,4 Z M16,8 L8,16 L16,24 L24,16 Z';
        case 'piglin':
            return 'M8,12 L8,20 L12,20 L12,12 Z M20,12 L20,20 L24,20 L24,12 Z M12,20 L12,24 L20,24 L20,20 Z';
        case 'flow':
            return 'M8,8 L8,24 L24,24 L24,8 Z M12,4 L12,8 L20,8 L20,4 Z M4,12 L4,20 L8,20 L8,12 Z M24,12 L24,20 L28,20 L28,12 Z M12,24 L12,28 L20,28 L20,24 Z';
        case 'guster':
            return 'M8,4 L8,12 L12,12 L12,4 Z M20,4 L20,12 L24,12 L24,4 Z M4,12 L4,20 L8,20 L8,12 Z M24,12 L24,20 L28,20 L28,12 Z M8,20 L8,28 L24,28 L24,20 Z';
        default:
            return '';
    }
}

export function BannerPreview({ baseColor, layers }: BannerPreviewProps) {
    const baseHex = getColorHex(baseColor);

    return (
        <div className="relative mx-auto aspect-[1/2] w-full max-w-[256px]">
            <svg
                viewBox="0 0 32 64"
                className="size-full drop-shadow-lg"
                style={{
                    imageRendering: 'pixelated',
                }}
            >
                <rect
                    x="0"
                    y="0"
                    width="32"
                    height="64"
                    fill={baseHex}
                    className="transition-colors duration-200"
                />

                {layers.map((layer, index) => {
                    const pathData = getPatternPath(layer.pattern);
                    if (!pathData) {
                        return null;
                    }

                    return (
                        <path
                            key={index}
                            d={pathData}
                            fill={getColorHex(layer.color)}
                            className="transition-colors duration-200"
                        />
                    );
                })}
            </svg>
        </div>
    );
}
