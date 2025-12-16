import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    Award,
    Beaker,
    BookOpenText,
    BoxSelect,
    Bug,
    Calculator,
    ClipboardList,
    Code,
    Compass,
    Crosshair,
    Droplet,
    FileJson,
    Gem,
    Grid3x3,
    Hash,
    Layers,
    type LucideIcon,
    Map,
    MessageSquare,
    Package,
    Palette,
    PawPrint,
    PenTool,
    PersonStanding,
    Rocket,
    Server,
    Shield,
    ShoppingCart,
    SignpostBig,
    Sparkle,
    Sparkles,
    Terminal,
    User,
    UsersRound,
    UtensilsCrossed,
    Wand2,
    Zap,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Tool {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
}

interface ToolCategory {
    title: string;
    tools: Tool[];
}

const toolCategories: ToolCategory[] = [
    {
        title: 'Players & Skins',
        tools: [
            {
                title: 'Player Lookup',
                description: 'Search players and view trust scores',
                href: '/players',
                icon: Shield,
            },
            {
                title: 'Skin Explorer',
                description: 'Browse and discover player skins',
                href: '/skins',
                icon: User,
            },
            {
                title: 'Skin Viewer',
                description: '3D skin viewer and renderer',
                href: '/tools/skin-viewer',
                icon: User,
            },
            {
                title: 'UUID Converter',
                description: 'Convert between UUID formats',
                href: '/tools/uuid-converter',
                icon: Hash,
            },
            {
                title: 'XP Calculator',
                description: 'Calculate experience points needed',
                href: '/tools/xp-calculator',
                icon: Sparkles,
            },
        ],
    },
    {
        title: 'Mods & Resource Packs',
        tools: [
            {
                title: 'Browse Mods',
                description: 'Discover and search Minecraft mods',
                href: '/mods',
                icon: Package,
            },
            {
                title: 'Resource Packs',
                description: 'Browse texture and resource packs',
                href: '/resource-packs',
                icon: Compass,
            },
        ],
    },
    {
        title: 'Server Tools',
        tools: [
            {
                title: 'Server Status',
                description: 'Check Minecraft server status',
                href: '/tools/server-status',
                icon: Server,
            },
        ],
    },
    {
        title: 'Building Tools',
        tools: [
            {
                title: 'Banner Creator',
                description: 'Design custom banners with patterns',
                href: '/tools/banner-creator',
                icon: Palette,
            },
            {
                title: 'Color Codes',
                description: 'Minecraft color and formatting codes',
                href: '/tools/color-codes',
                icon: PenTool,
            },
            {
                title: 'Firework Designer',
                description: 'Create custom firework rockets',
                href: '/tools/firework-designer',
                icon: Rocket,
            },
        ],
    },
    {
        title: 'Gameplay Tools',
        tools: [
            {
                title: 'Enchantment Calculator',
                description: 'Calculate enchantment costs and combos',
                href: '/tools/enchantment-calculator',
                icon: Wand2,
            },
            {
                title: 'Crafting Recipes',
                description: 'Browse all crafting recipes',
                href: '/tools/crafting-recipes',
                icon: BookOpenText,
            },
            {
                title: 'Potion Brewing',
                description: 'Potion brewing guide and recipes',
                href: '/tools/potion-brewing',
                icon: Beaker,
            },
            {
                title: 'Villager Trading',
                description: 'Villager trades and professions guide',
                href: '/tools/villager-trading',
                icon: ShoppingCart,
            },
        ],
    },
    {
        title: 'World Tools',
        tools: [
            {
                title: 'Nether Calculator',
                description: 'Convert Overworld to Nether coords',
                href: '/tools/nether-calculator',
                icon: Calculator,
            },
            {
                title: 'Flat World Generator',
                description: 'Create superflat world presets',
                href: '/tools/flat-world-generator',
                icon: Layers,
            },
            {
                title: 'Mob Spawning',
                description: 'Mob spawning mechanics calculator',
                href: '/tools/mob-spawning',
                icon: PawPrint,
            },
            {
                title: 'Biome Guide',
                description: 'Explore all biomes and their features',
                href: '/tools/biome-guide',
                icon: Map,
            },
            {
                title: 'Coordinate Calculator',
                description: 'Chunk, region, and slime chunk finder',
                href: '/tools/coordinate-calculator',
                icon: Grid3x3,
            },
        ],
    },
    {
        title: 'Command Generators',
        tools: [
            {
                title: 'Command Generator',
                description: 'Generate various Minecraft commands',
                href: '/tools/command-generator',
                icon: Terminal,
            },
            {
                title: 'Target Selector',
                description: 'Build complex target selectors',
                href: '/tools/target-selector',
                icon: Crosshair,
            },
            {
                title: 'Execute Builder',
                description: 'Visual execute command chain builder',
                href: '/tools/execute-generator',
                icon: Code,
            },
            {
                title: 'Tellraw Generator',
                description: 'Create formatted JSON text messages',
                href: '/tools/tellraw-generator',
                icon: MessageSquare,
            },
            {
                title: 'Effect Generator',
                description: 'Generate effect commands',
                href: '/tools/effect-generator',
                icon: Droplet,
            },
            {
                title: 'Item Generator',
                description: 'Create items with NBT data',
                href: '/tools/item-generator',
                icon: Gem,
            },
            {
                title: 'Entity Generator',
                description: 'Summon entities with custom NBT',
                href: '/tools/entity-generator',
                icon: Bug,
            },
            {
                title: 'Fill/Clone Generator',
                description: 'Generate fill and clone commands',
                href: '/tools/fill-clone-generator',
                icon: BoxSelect,
            },
        ],
    },
    {
        title: 'Data Pack Tools',
        tools: [
            {
                title: 'Recipe Generator',
                description: 'Create custom recipe JSON files',
                href: '/tools/recipe-generator',
                icon: UtensilsCrossed,
            },
            {
                title: 'Loot Table Generator',
                description: 'Design loot tables for data packs',
                href: '/tools/loot-table-generator',
                icon: FileJson,
            },
            {
                title: 'Advancement Generator',
                description: 'Create custom advancements',
                href: '/tools/advancement-generator',
                icon: Award,
            },
        ],
    },
    {
        title: 'Multiplayer Tools',
        tools: [
            {
                title: 'Scoreboard Generator',
                description: 'Create and manage scoreboards',
                href: '/tools/scoreboard-generator',
                icon: ClipboardList,
            },
            {
                title: 'Bossbar Generator',
                description: 'Design custom boss bars',
                href: '/tools/bossbar-generator',
                icon: Activity,
            },
            {
                title: 'Team Generator',
                description: 'Create and configure teams',
                href: '/tools/team-generator',
                icon: UsersRound,
            },
        ],
    },
    {
        title: 'Technical Tools',
        tools: [
            {
                title: 'Redstone Calculator',
                description: 'Redstone timing and signal calculator',
                href: '/tools/redstone-calculator',
                icon: Zap,
            },
            {
                title: 'Armor Stand Editor',
                description: 'Pose armor stands visually',
                href: '/tools/armor-stand-editor',
                icon: PersonStanding,
            },
            {
                title: 'Particle Generator',
                description: 'Create particle effect commands',
                href: '/tools/particle-generator',
                icon: Sparkle,
            },
            {
                title: 'Sign/Book Generator',
                description: 'Create signs and written books',
                href: '/tools/sign-book-generator',
                icon: SignpostBig,
            },
        ],
    },
];

function ToolCard({ tool }: { tool: Tool }) {
    const Icon = tool.icon;
    return (
        <Link href={tool.href} className="group">
            <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md group-hover:bg-accent/30">
                <CardHeader className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary/20">
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <CardTitle className="text-sm font-medium leading-tight">
                                {tool.title}
                            </CardTitle>
                            <CardDescription className="mt-1 line-clamp-2 text-xs">
                                {tool.description}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </Link>
    );
}

export default function Dashboard() {
    const totalTools = toolCategories.reduce(
        (acc, cat) => acc + cat.tools.length,
        0
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Welcome Section */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Welcome to Kaizen Tools
                        </h1>
                        <p className="text-muted-foreground">
                            Your ultimate Minecraft toolkit with{' '}
                            <span className="font-semibold text-primary">
                                {totalTools} tools
                            </span>{' '}
                            to enhance your gameplay, create commands, and
                            explore the world of Minecraft.
                        </p>
                    </div>
                </div>

                {/* Tools Grid by Category */}
                <div className="space-y-8">
                    {toolCategories.map((category) => (
                        <div key={category.title}>
                            <h2 className="mb-4 text-lg font-semibold tracking-tight">
                                {category.title}
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {category.tools.map((tool) => (
                                    <ToolCard key={tool.href} tool={tool} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
