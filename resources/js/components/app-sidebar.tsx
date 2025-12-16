import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavGroup, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Award,
    BookOpen,
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
    Flag,
    Beaker,
    Folder,
    Folders,
    Gem,
    Grid3x3,
    Hash,
    Heart,
    Layers,
    LayoutGrid,
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
    ShieldCheck,
    ShoppingCart,
    SignpostBig,
    Sparkle,
    Sparkles,
    Terminal,
    UsersRound,
    UtensilsCrossed,
    User,
    Users as UsersIcon,
    Wand2,
    Wrench,
    Zap,
} from 'lucide-react';
import AppLogo from './app-logo';

const navGroups: NavGroup[] = [
    {
        title: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
        ],
    },
    {
        title: 'Mods',
        items: [
            {
                title: 'Browse Mods',
                href: '/mods',
                icon: Package,
            },
            {
                title: 'Categories',
                href: '/mods/categories',
                icon: Folders,
            },
        ],
    },
    {
        title: 'Players',
        items: [
            {
                title: 'Player Lookup',
                href: '/players',
                icon: Shield,
            },
            {
                title: 'Skin Explorer',
                href: '/skins',
                icon: User,
            },
            {
                title: 'Skin Viewer',
                href: '/tools/skin-viewer',
                icon: User,
            },
            {
                title: 'UUID Converter',
                href: '/tools/uuid-converter',
                icon: Hash,
            },
            {
                title: 'XP Calculator',
                href: '/tools/xp-calculator',
                icon: Sparkles,
            },
        ],
    },
    {
        title: 'Resource Packs',
        items: [
            {
                title: 'Browse Packs',
                href: '/resource-packs',
                icon: Compass,
            },
        ],
    },
    {
        title: 'Server Tools',
        items: [
            {
                title: 'Server Status',
                href: '/tools/server-status',
                icon: Server,
            },
        ],
    },
    {
        title: 'Building Tools',
        items: [
            {
                title: 'Banner Creator',
                href: '/tools/banner-creator',
                icon: Palette,
            },
            {
                title: 'Color Codes',
                href: '/tools/color-codes',
                icon: PenTool,
            },
            {
                title: 'Firework Designer',
                href: '/tools/firework-designer',
                icon: Rocket,
            },
        ],
    },
    {
        title: 'Gameplay Tools',
        items: [
            {
                title: 'Enchantment Calc',
                href: '/tools/enchantment-calculator',
                icon: Wand2,
            },
            {
                title: 'Crafting Recipes',
                href: '/tools/crafting-recipes',
                icon: BookOpenText,
            },
            {
                title: 'Potion Brewing',
                href: '/tools/potion-brewing',
                icon: Beaker,
            },
            {
                title: 'Villager Trading',
                href: '/tools/villager-trading',
                icon: ShoppingCart,
            },
        ],
    },
    {
        title: 'World Tools',
        items: [
            {
                title: 'Nether Calculator',
                href: '/tools/nether-calculator',
                icon: Calculator,
            },
            {
                title: 'Flat World Gen',
                href: '/tools/flat-world-generator',
                icon: Layers,
            },
            {
                title: 'Mob Spawning',
                href: '/tools/mob-spawning',
                icon: PawPrint,
            },
            {
                title: 'Biome Guide',
                href: '/tools/biome-guide',
                icon: Map,
            },
            {
                title: 'Coord Calculator',
                href: '/tools/coordinate-calculator',
                icon: Grid3x3,
            },
        ],
    },
    {
        title: 'Technical Tools',
        items: [
            {
                title: 'Command Gen',
                href: '/tools/command-generator',
                icon: Terminal,
            },
            {
                title: 'Redstone Calc',
                href: '/tools/redstone-calculator',
                icon: Zap,
            },
            {
                title: 'Armor Stand',
                href: '/tools/armor-stand-editor',
                icon: PersonStanding,
            },
            {
                title: 'Loot Tables',
                href: '/tools/loot-table-generator',
                icon: FileJson,
            },
            {
                title: 'Advancements',
                href: '/tools/advancement-generator',
                icon: Award,
            },
            {
                title: 'Recipe Gen',
                href: '/tools/recipe-generator',
                icon: UtensilsCrossed,
            },
            {
                title: 'Tellraw Gen',
                href: '/tools/tellraw-generator',
                icon: MessageSquare,
            },
            {
                title: 'Sign/Book Gen',
                href: '/tools/sign-book-generator',
                icon: SignpostBig,
            },
            {
                title: 'Target Selector',
                href: '/tools/target-selector',
                icon: Crosshair,
            },
            {
                title: 'Particle Gen',
                href: '/tools/particle-generator',
                icon: Sparkle,
            },
            {
                title: 'Scoreboard Gen',
                href: '/tools/scoreboard-generator',
                icon: ClipboardList,
            },
            {
                title: 'Bossbar Gen',
                href: '/tools/bossbar-generator',
                icon: Activity,
            },
            {
                title: 'Entity Gen',
                href: '/tools/entity-generator',
                icon: Bug,
            },
            {
                title: 'Item Gen',
                href: '/tools/item-generator',
                icon: Gem,
            },
            {
                title: 'Fill/Clone Gen',
                href: '/tools/fill-clone-generator',
                icon: BoxSelect,
            },
            {
                title: 'Effect Gen',
                href: '/tools/effect-generator',
                icon: Droplet,
            },
            {
                title: 'Team Gen',
                href: '/tools/team-generator',
                icon: UsersRound,
            },
            {
                title: 'Execute Builder',
                href: '/tools/execute-generator',
                icon: Code,
            },
        ],
    },
    {
        title: 'Coming Soon',
        items: [
            {
                title: 'More Tools',
                href: '#',
                icon: Wrench,
            },
            {
                title: 'Favorites',
                href: '#',
                icon: Heart,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const adminNavGroup: NavGroup = {
    title: 'Admin',
    items: [
        {
            title: 'Dashboard',
            href: '/admin',
            icon: ShieldCheck,
        },
        {
            title: 'Reports',
            href: '/admin/reports',
            icon: Flag,
        },
        {
            title: 'Players',
            href: '/admin/players',
            icon: UsersIcon,
        },
    ],
};

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.is_admin ?? false;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="transition-all duration-200"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {navGroups.map((group) => (
                    <NavMain
                        key={group.title}
                        title={group.title}
                        items={group.items}
                    />
                ))}
                {isAdmin && (
                    <NavMain
                        key={adminNavGroup.title}
                        title={adminNavGroup.title}
                        items={adminNavGroup.items}
                    />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
