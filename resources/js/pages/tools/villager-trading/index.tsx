import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToolLayout } from '@/components/tool-layout';
import {
    bestTrades,
    calculatePrice,
    discountInfo,
    professions,
    tierInfo,
    tierLevels,
    type VillagerProfession,
} from '@/data/villager-trading-data';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Boxes,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Coins,
    Heart,
    Info,
    Search,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: '#',
    },
    {
        title: 'Villager Trading Guide',
        href: '/tools/villager-trading',
    },
];

export default function VillagerTrading() {
    const [selectedProfession, setSelectedProfession] = useState<VillagerProfession>(professions[8]);
    const [searchQuery, setSearchQuery] = useState('');
    const [heroDiscount, setHeroDiscount] = useState(false);
    const [curedDiscount, setCuredDiscount] = useState(false);
    const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({
        novice: true,
        apprentice: true,
        journeyman: true,
        expert: true,
        master: true,
    });

    const toggleTier = (tier: string) => {
        setExpandedTiers((prev) => ({
            ...prev,
            [tier]: !prev[tier],
        }));
    };

    const filteredTrades = selectedProfession.trades.filter((trade) => {
        if (!searchQuery) {
            return true;
        }

        const query = searchQuery.toLowerCase();
        return (
            trade.sellItem.toLowerCase().includes(query) ||
            trade.buyItem1.toLowerCase().includes(query) ||
            trade.buyItem2?.toLowerCase().includes(query)
        );
    });

    const tradesByTier = tierLevels.reduce(
        (acc, tier) => {
            acc[tier] = filteredTrades.filter((trade) => trade.tier === tier);
            return acc;
        },
        {} as Record<string, typeof filteredTrades>,
    );

    const sidebar = (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="size-5" />
                        Select Profession
                    </CardTitle>
                    <CardDescription>
                        Choose a villager profession to view trades
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="profession-select">Profession</Label>
                        <Select
                            value={selectedProfession.id}
                            onValueChange={(value) => {
                                const profession = professions.find((p) => p.id === value);
                                if (profession) {
                                    setSelectedProfession(profession);
                                }
                            }}
                        >
                            <SelectTrigger id="profession-select">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {professions.map((profession) => (
                                    <SelectItem key={profession.id} value={profession.id}>
                                        {profession.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2 rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                            <Boxes className="size-4 text-muted-foreground" />
                            <span className="text-sm font-semibold">Workstation Block</span>
                        </div>
                        <p className="text-lg font-bold" style={{ color: selectedProfession.color }}>
                            {selectedProfession.workstation}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                            <Info className="size-4 text-muted-foreground" />
                            <span className="text-sm font-semibold">Total Trades</span>
                        </div>
                        <p className="text-lg font-bold">{selectedProfession.trades.length} trades</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Coins className="size-5" />
                        Price Calculator
                    </CardTitle>
                    <CardDescription>Apply discounts to see reduced prices</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="hero-discount"
                            checked={heroDiscount}
                            onChange={(e) => {
                                setHeroDiscount(e.target.checked);
                            }}
                            className="size-4 rounded border-gray-300"
                        />
                        <Label htmlFor="hero-discount" className="cursor-pointer font-normal">
                            Hero of the Village (30% off)
                        </Label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="cured-discount"
                            checked={curedDiscount}
                            onChange={(e) => {
                                setCuredDiscount(e.target.checked);
                            }}
                            className="size-4 rounded border-gray-300"
                        />
                        <Label htmlFor="cured-discount" className="cursor-pointer font-normal">
                            Cured Zombie Villager (95% off)
                        </Label>
                    </div>

                    {(heroDiscount || curedDiscount) && (
                        <div className="flex flex-col gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-green-700 dark:text-green-400" />
                                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                    Discounts Active
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {curedDiscount && heroDiscount
                                    ? 'Total discount: 98.5% off (both discounts stack!)'
                                    : curedDiscount
                                      ? 'Cured villager discount: 95% off all trades'
                                      : 'Hero of the Village: 30% off all trades'}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Villager Trading Guide" />
            <ToolLayout
                title="Villager Trading Guide"
                description="Browse all villager professions, trades, and optimize your emerald economy"
                sidebar={sidebar}
            >
                <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="size-5" />
                                    {selectedProfession.name} Trades
                                </CardTitle>
                                <CardDescription>
                                    All available trades organized by villager level
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="search-trades">Search Trades</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="search-trades"
                                            type="text"
                                            placeholder="Search by item name..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                            }}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                {filteredTrades.length === 0 ? (
                                    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center">
                                        <AlertCircle className="size-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            No trades found matching "{searchQuery}"
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {tierLevels.map((tier) => {
                                            const trades = tradesByTier[tier];
                                            if (trades.length === 0) {
                                                return null;
                                            }

                                            const tierData = tierInfo[tier];
                                            const isExpanded = expandedTiers[tier];

                                            return (
                                                <div key={tier} className="flex flex-col gap-2 rounded-lg border">
                                                    <button
                                                        onClick={() => {
                                                            toggleTier(tier);
                                                        }}
                                                        className="flex items-center justify-between p-4 text-left transition-colors hover:bg-accent"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Badge
                                                                style={{
                                                                    backgroundColor: tierData.color,
                                                                    color: 'white',
                                                                    borderColor: 'transparent',
                                                                }}
                                                            >
                                                                {tierData.name}
                                                            </Badge>
                                                            <span className="text-sm text-muted-foreground">
                                                                {trades.length} trade{trades.length !== 1 ? 's' : ''}
                                                            </span>
                                                        </div>
                                                        {isExpanded ? (
                                                            <ChevronUp className="size-4 text-muted-foreground" />
                                                        ) : (
                                                            <ChevronDown className="size-4 text-muted-foreground" />
                                                        )}
                                                    </button>

                                                    {isExpanded && (
                                                        <div className="flex flex-col gap-2 border-t px-4 pb-4">
                                                            {trades.map((trade) => {
                                                                const buyPrice1 = calculatePrice(
                                                                    trade.buyQuantity1,
                                                                    heroDiscount,
                                                                    curedDiscount,
                                                                );
                                                                const buyPrice2 = trade.buyQuantity2
                                                                    ? calculatePrice(
                                                                          trade.buyQuantity2,
                                                                          heroDiscount,
                                                                          curedDiscount,
                                                                      )
                                                                    : null;

                                                                return (
                                                                    <div
                                                                        key={trade.id}
                                                                        className="flex flex-col gap-2 rounded-lg bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
                                                                    >
                                                                        <div className="flex flex-col gap-1">
                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                <span className="font-medium text-red-600 dark:text-red-400">
                                                                                    {buyPrice1[0]}
                                                                                    {buyPrice1[1] !== buyPrice1[0] &&
                                                                                        `-${buyPrice1[1]}`}{' '}
                                                                                    {trade.buyItem1}
                                                                                </span>
                                                                                {trade.buyItem2 && buyPrice2 && (
                                                                                    <>
                                                                                        <span className="text-muted-foreground">
                                                                                            +
                                                                                        </span>
                                                                                        <span className="font-medium text-red-600 dark:text-red-400">
                                                                                            {buyPrice2[0]}
                                                                                            {buyPrice2[1] !==
                                                                                                buyPrice2[0] &&
                                                                                                `-${buyPrice2[1]}`}{' '}
                                                                                            {trade.buyItem2}
                                                                                        </span>
                                                                                    </>
                                                                                )}
                                                                                <span className="text-muted-foreground">
                                                                                    →
                                                                                </span>
                                                                                <span className="font-medium text-green-700 dark:text-green-400">
                                                                                    {trade.sellQuantity}{' '}
                                                                                    {trade.sellItem}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                                                <span>
                                                                                    Max uses: {trade.maxUses}
                                                                                </span>
                                                                                <span>XP: {trade.xpReward}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                <div className="grid gap-6 sm:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="size-5" />
                                Discount Information
                            </CardTitle>
                            <CardDescription>How to get the best prices from villagers</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                                <Sparkles className="size-5 shrink-0 text-purple-600 dark:text-purple-400" />
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-semibold">{discountInfo.heroOfTheVillage.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {discountInfo.heroOfTheVillage.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Discount: {discountInfo.heroOfTheVillage.discount * 100}% off
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Heart className="size-5 shrink-0 text-pink-600 dark:text-pink-400" />
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-semibold">{discountInfo.zombieVillagerCure.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {discountInfo.zombieVillagerCure.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Discount: {discountInfo.zombieVillagerCure.discount * 100}% off
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                                <CheckCircle2 className="size-5 shrink-0 text-green-700 dark:text-green-400" />
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-semibold text-green-700 dark:text-green-400">Stack Both!</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {discountInfo.zombieVillagerCure.stackedDescription}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="size-5" />
                                Best Trades
                            </CardTitle>
                            <CardDescription>Most valuable villager trades in the game</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {bestTrades.map((trade, index) => (
                                <div key={index} className="flex items-start gap-3 rounded-lg border p-3">
                                    <Coins className="size-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold">{trade.item}</h4>
                                            <Badge variant="outline" className="text-xs">
                                                {trade.profession}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{trade.why}</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">Tip: {trade.tip}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Villager Trading Mechanics</CardTitle>
                        <CardDescription>Important information about trading with villagers</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Leveling Up Villagers</h4>
                                <p className="text-sm text-muted-foreground">
                                    Villagers gain experience from trading and level up from Novice to Master. Each
                                    level unlocks new trades. The XP required for each level is cumulative.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Trade Restocking</h4>
                                <p className="text-sm text-muted-foreground">
                                    Villagers restock their trades twice per in-game day when they work at their job
                                    site. They must be able to reach and work at their workstation block to restock.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Price Fluctuation</h4>
                                <p className="text-sm text-muted-foreground">
                                    Prices can increase if you trade the same item too many times in a row (demand
                                    increases). Prices return to normal after the villager restocks. Attacking villagers
                                    also increases prices.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Profession Assignment</h4>
                                <p className="text-sm text-muted-foreground">
                                    Unemployed villagers (those without a profession) will claim the nearest unclaimed
                                    workstation. Once a villager has traded once, their profession is locked and cannot
                                    be changed.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-semibold">Zombie Villager Curing</h4>
                                <p className="text-sm text-muted-foreground">
                                    To cure a zombie villager, throw a Splash Potion of Weakness at it, then feed it a
                                    Golden Apple. The curing process takes 3-5 minutes. The cured villager will remember
                                    you and give permanent discounts.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                </div>
            </ToolLayout>
        </AppLayout>
    );
}
