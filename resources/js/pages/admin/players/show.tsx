import { OverrideTrustDialog } from '@/components/admin/override-trust-dialog';
import { ReviewReportDialog } from '@/components/admin/review-report-dialog';
import { StatusBadge } from '@/components/admin/status-badge';
import { TrustBadge } from '@/components/players/trust-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { AdminPlayer, AdminReport } from '@/types/admin';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ExternalLink,
    Flag,
    Loader2,
    Shield,
    ShieldOff,
    User,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    player: AdminPlayer;
    reports: AdminReport[];
}

export default function AdminPlayerShow({ player, reports }: Props) {
    const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<AdminReport | null>(
        null,
    );
    const [isRemovingOverride, setIsRemovingOverride] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Players', href: '/admin/players' },
        { title: player.username, href: `/admin/players/${player.id}` },
    ];

    const handleRemoveOverride = async () => {
        setIsRemovingOverride(true);
        try {
            const response = await fetch(
                `/admin/players/${player.id}/override`,
                {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                },
            );

            if (response.ok) {
                router.reload();
            }
        } finally {
            setIsRemovingOverride(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${player.username} - Admin`} />

            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
                <Link
                    href="/admin/players"
                    className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:gap-3 hover:text-foreground"
                >
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                    Back to Players
                </Link>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Player Info */}
                    <div className="space-y-6 lg:col-span-1">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center">
                                    <img
                                        src={`https://mc-heads.net/avatar/${player.username}/128`}
                                        alt={player.username}
                                        className="mb-4 size-24 rounded-xl"
                                    />
                                    <h1 className="text-2xl font-bold">
                                        {player.username}
                                    </h1>
                                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                                        {player.uuid}
                                    </p>
                                    <div className="mt-4">
                                        <TrustBadge
                                            level={player.trust_level}
                                            size="lg"
                                        />
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Trust Score
                                        </span>
                                        <span className="font-mono font-bold">
                                            {player.trust_score}/100
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Total Reports
                                        </span>
                                        <Badge variant="secondary">
                                            {player.reports_count}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Verified Reports
                                        </span>
                                        <Badge variant="destructive">
                                            {player.verified_reports_count}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {player.admin_override ? (
                                    <div className="space-y-4">
                                        <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
                                            <div className="mb-2 flex items-center gap-2 font-medium text-purple-600 dark:text-purple-400">
                                                <Shield className="size-4" />
                                                Admin Override Active
                                            </div>
                                            {player.admin_override_by && (
                                                <p className="text-sm text-muted-foreground">
                                                    By:{' '}
                                                    {
                                                        player.admin_override_by
                                                            .name
                                                    }
                                                </p>
                                            )}
                                            {player.admin_notes && (
                                                <p className="mt-2 text-sm">
                                                    {player.admin_notes}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={handleRemoveOverride}
                                            disabled={isRemovingOverride}
                                        >
                                            {isRemovingOverride ? (
                                                <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                                <ShieldOff className="size-4" />
                                            )}
                                            Remove Override
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        className="w-full"
                                        onClick={() =>
                                            setOverrideDialogOpen(true)
                                        }
                                    >
                                        <Shield className="size-4" />
                                        Override Trust Level
                                    </Button>
                                )}

                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-2 w-full"
                                >
                                    <Link href={`/players/${player.username}`}>
                                        <User className="size-4" />
                                        View Public Profile
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Reports */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Flag className="size-5" />
                                    Reports ({reports.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {reports.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Reporter</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reports.map((report) => (
                                                <TableRow key={report.id}>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {
                                                                report.report_type_label
                                                            }
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge
                                                            status={
                                                                report.status
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {report.reporter
                                                            ?.name || 'Unknown'}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {new Date(
                                                            report.created_at,
                                                        ).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {report.evidence_url && (
                                                                <Button
                                                                    asChild
                                                                    variant="ghost"
                                                                    size="sm"
                                                                >
                                                                    <a
                                                                        href={
                                                                            report.evidence_url
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <ExternalLink className="size-4" />
                                                                    </a>
                                                                </Button>
                                                            )}
                                                            {report.status ===
                                                                'pending' && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setSelectedReport(
                                                                            report,
                                                                        )
                                                                    }
                                                                >
                                                                    Review
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        <Flag className="mx-auto mb-4 size-12 opacity-50" />
                                        <p>No reports for this player</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <OverrideTrustDialog
                player={player}
                open={overrideDialogOpen}
                onOpenChange={setOverrideDialogOpen}
                onSuccess={() => router.reload()}
            />

            <ReviewReportDialog
                report={selectedReport}
                open={!!selectedReport}
                onOpenChange={(open) => !open && setSelectedReport(null)}
                onSuccess={() => router.reload()}
            />
        </AppLayout>
    );
}
