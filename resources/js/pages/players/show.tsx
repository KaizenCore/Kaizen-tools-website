import { ReportPlayerDialog } from '@/components/players/report-player-dialog';
import { TrustBadge } from '@/components/players/trust-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Player, PlayerSkinData, UserReport } from '@/types/players';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock, Download, Loader2, Shirt, User } from 'lucide-react';

interface Props {
    player: Player;
    skinData: PlayerSkinData;
    userReport: UserReport | null;
}

export default function PlayerShow({ player, skinData, userReport }: Props) {
    if (!player || !player.uuid) {
        return (
            <AppLayout
                breadcrumbs={[
                    { title: 'Player Lookup', href: '/players' },
                    { title: 'Loading...', href: '#' },
                ]}
            >
                <Head title="Loading..." />
                <div className="flex min-h-[400px] items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Player Lookup', href: '/players' },
        { title: player.username, href: `/players/${player.username}` },
    ];

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${player.username} - Player Lookup`} />

            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
                <Link
                    href="/players"
                    className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:gap-3 hover:text-foreground"
                >
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                    Back to Player Lookup
                </Link>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <Card className="animate-in overflow-hidden duration-500 fade-in slide-in-from-bottom-4">
                            <CardContent className="p-6 sm:p-8">
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <img
                                            src={`https://mc-heads.net/avatar/${player.username}/128`}
                                            alt={player.username}
                                            className="size-28 rounded-2xl object-cover shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 dark:ring-white/10"
                                        />
                                    </div>

                                    {/* Header Info */}
                                    <div className="min-w-0 flex-1 space-y-4">
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                                {player.username}
                                            </h1>
                                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="size-4" />
                                                <span className="font-mono text-xs">
                                                    {player.uuid}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2">
                                            <TrustBadge
                                                level={player.trust_level}
                                                label={player.trust_level_label}
                                            />
                                            <Badge
                                                variant="outline"
                                                className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                                            >
                                                <Shirt className="mr-1 size-3" />
                                                {skinData.is_slim
                                                    ? 'Slim (Alex)'
                                                    : 'Classic (Steve)'}
                                            </Badge>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                onClick={() =>
                                                    handleDownload(
                                                        skinData.skin_url,
                                                        `${player.username}_skin.png`,
                                                    )
                                                }
                                            >
                                                <Download className="size-4" />
                                                Download Skin
                                            </Button>
                                            {userReport ? (
                                                <Badge
                                                    variant="secondary"
                                                    className="px-3 py-2"
                                                >
                                                    <Clock className="mr-1 size-3" />
                                                    Report {userReport.status}
                                                </Badge>
                                            ) : (
                                                <ReportPlayerDialog
                                                    player={player}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Full Body Preview */}
                                <div>
                                    <h2 className="mb-4 text-lg font-semibold">
                                        Full Body Preview
                                    </h2>
                                    <div className="flex items-center justify-center rounded-lg bg-muted/50 p-8">
                                        <img
                                            src={`https://mc-heads.net/body/${player.username}/600`}
                                            alt={`${player.username}'s skin`}
                                            className="max-h-[500px] w-auto object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Cape Section */}
                                {skinData.cape_url && (
                                    <>
                                        <Separator className="my-6" />
                                        <div>
                                            <h2 className="mb-4 text-lg font-semibold">
                                                Cape
                                            </h2>
                                            <div className="flex items-center justify-center rounded-lg bg-muted/50 p-8">
                                                <img
                                                    src={skinData.cape_url}
                                                    alt={`${player.username}'s cape`}
                                                    className="max-h-[400px] w-auto object-contain"
                                                />
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    handleDownload(
                                                        skinData.cape_url!,
                                                        `${player.username}_cape.png`,
                                                    )
                                                }
                                                variant="outline"
                                                className="mt-4"
                                            >
                                                <Download className="size-4" />
                                                Download Cape
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Trust Status */}
                        <Card className="animate-in delay-150 duration-500 fade-in slide-in-from-bottom-4">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Trust Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                                    <span className="font-medium">
                                        Community Rating
                                    </span>
                                    <TrustBadge
                                        level={player.trust_level}
                                        size="lg"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {player.trust_level === 'trusted' &&
                                        'This player has a good standing in the community.'}
                                    {player.trust_level === 'neutral' &&
                                        'This player has a neutral standing with some reports.'}
                                    {player.trust_level === 'suspect' &&
                                        'This player has multiple verified reports. Exercise caution.'}
                                    {player.trust_level === 'unknown' &&
                                        'This player has no reports against them. This is a good sign!'}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Different Views */}
                        <Card className="animate-in delay-300 duration-500 fade-in slide-in-from-bottom-4">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Different Views
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                                        Front View
                                    </p>
                                    <div className="flex items-center justify-center rounded-lg bg-muted/50 p-4">
                                        <img
                                            src={`https://mc-heads.net/player/${player.username}/200`}
                                            alt="Front view"
                                            className="h-auto w-full max-w-[200px] object-contain"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                                        Head (Isometric)
                                    </p>
                                    <div className="flex items-center justify-center rounded-lg bg-muted/50 p-4">
                                        <img
                                            src={`https://mc-heads.net/head/${player.username}/200`}
                                            alt="Head view"
                                            className="h-auto w-full max-w-[150px] object-contain"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                                        Avatar (2D)
                                    </p>
                                    <div className="flex items-center justify-center rounded-lg bg-muted/50 p-4">
                                        <img
                                            src={`https://mc-heads.net/avatar/${player.username}/200`}
                                            alt="Avatar view"
                                            className="h-auto w-full max-w-[150px] object-contain"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
