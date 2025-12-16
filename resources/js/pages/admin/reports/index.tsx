import { ReviewReportDialog, StatusBadge } from '@/components/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import type { AdminReport, Pagination, ReportStats } from '@/types/admin';
import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    ExternalLink,
    Flag,
    Loader2,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    reports: AdminReport[];
    pagination: Pagination;
    filters: {
        status: string;
        report_type: string;
    };
    stats: ReportStats;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Reports', href: '/admin/reports' },
];

export default function AdminReportsIndex({
    reports,
    pagination,
    filters,
    stats,
}: Props) {
    const [selectedReports, setSelectedReports] = useState<number[]>([]);
    const [selectedReport, setSelectedReport] = useState<AdminReport | null>(
        null,
    );
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/admin/reports',
            {
                ...filters,
                [key]: value === 'all' ? '' : value,
            },
            { preserveState: true },
        );
    };

    const toggleSelectAll = () => {
        if (selectedReports.length === reports.length) {
            setSelectedReports([]);
        } else {
            setSelectedReports(reports.map((r) => r.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedReports((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
        );
    };

    const handleBulkAction = async (status: string) => {
        if (selectedReports.length === 0) return;

        setIsBulkProcessing(true);
        try {
            const response = await fetch('/admin/reports/bulk-review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({ report_ids: selectedReports, status }),
            });

            if (response.ok) {
                setSelectedReports([]);
                router.reload();
            }
        } finally {
            setIsBulkProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports - Admin" />

            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Reports
                    </h1>
                    <p className="text-muted-foreground">
                        Review and process player reports
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <Card
                        className="cursor-pointer hover:border-yellow-500/50"
                        onClick={() => handleFilterChange('status', 'pending')}
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Pending
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.pending}
                                    </p>
                                </div>
                                <Clock className="size-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        className="cursor-pointer hover:border-green-500/50"
                        onClick={() => handleFilterChange('status', 'verified')}
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Verified
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.verified}
                                    </p>
                                </div>
                                <CheckCircle2 className="size-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        className="cursor-pointer hover:border-red-500/50"
                        onClick={() => handleFilterChange('status', 'rejected')}
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Rejected
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.rejected}
                                    </p>
                                </div>
                                <XCircle className="size-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex gap-2">
                                <Select
                                    value={filters.status || 'pending'}
                                    onValueChange={(v) =>
                                        handleFilterChange('status', v)
                                    }
                                >
                                    <SelectTrigger className="w-36">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="verified">
                                            Verified
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            Rejected
                                        </SelectItem>
                                        <SelectItem value="resolved">
                                            Resolved
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.report_type || 'all'}
                                    onValueChange={(v) =>
                                        handleFilterChange('report_type', v)
                                    }
                                >
                                    <SelectTrigger className="w-44">
                                        <SelectValue placeholder="Report Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Types
                                        </SelectItem>
                                        <SelectItem value="cheating">
                                            Cheating
                                        </SelectItem>
                                        <SelectItem value="scamming">
                                            Scamming
                                        </SelectItem>
                                        <SelectItem value="toxicity">
                                            Toxicity
                                        </SelectItem>
                                        <SelectItem value="suspicious_account">
                                            Suspicious Account
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedReports.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        {selectedReports.length} selected
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-green-500 text-green-600 hover:bg-green-50"
                                        onClick={() =>
                                            handleBulkAction('verified')
                                        }
                                        disabled={isBulkProcessing}
                                    >
                                        {isBulkProcessing ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="size-4" />
                                        )}
                                        Verify All
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-500 text-red-600 hover:bg-red-50"
                                        onClick={() =>
                                            handleBulkAction('rejected')
                                        }
                                        disabled={isBulkProcessing}
                                    >
                                        {isBulkProcessing ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <XCircle className="size-4" />
                                        )}
                                        Reject All
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={
                                                selectedReports.length ===
                                                    reports.length &&
                                                reports.length > 0
                                            }
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Player</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Reporter</TableHead>
                                    <TableHead>Status</TableHead>
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
                                            <Checkbox
                                                checked={selectedReports.includes(
                                                    report.id,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleSelect(report.id)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/admin/players/${report.player.id}`}
                                                className="flex items-center gap-2 hover:underline"
                                            >
                                                <img
                                                    src={`https://mc-heads.net/avatar/${report.player.username}/24`}
                                                    alt={report.player.username}
                                                    className="size-6 rounded"
                                                />
                                                <span className="font-medium">
                                                    {report.player.username}
                                                </span>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {report.report_type_label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                                            {report.reason}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {report.reporter?.name || 'Unknown'}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge
                                                status={report.status}
                                            />
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(
                                                report.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
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

                        {reports.length === 0 && (
                            <div className="py-12 text-center text-muted-foreground">
                                <Flag className="mx-auto mb-4 size-12 opacity-50" />
                                <p>No reports found</p>
                            </div>
                        )}

                        {pagination.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Page {pagination.current_page} of{' '}
                                    {pagination.last_page}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.current_page === 1}
                                        onClick={() =>
                                            router.get('/admin/reports', {
                                                ...filters,
                                                page:
                                                    pagination.current_page - 1,
                                            })
                                        }
                                    >
                                        <ChevronLeft className="size-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            pagination.current_page ===
                                            pagination.last_page
                                        }
                                        onClick={() =>
                                            router.get('/admin/reports', {
                                                ...filters,
                                                page:
                                                    pagination.current_page + 1,
                                            })
                                        }
                                    >
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ReviewReportDialog
                report={selectedReport}
                open={!!selectedReport}
                onOpenChange={(open) => !open && setSelectedReport(null)}
                onSuccess={() => router.reload()}
            />
        </AppLayout>
    );
}
