import { TrustBadge } from '@/components/players/trust-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import type { AdminPlayer, Pagination } from '@/types/admin';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search, Shield } from 'lucide-react';
import { useState } from 'react';

interface Props {
    players: AdminPlayer[];
    pagination: Pagination;
    filters: {
        search: string;
        trust_level: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Players', href: '/admin/players' },
];

export default function AdminPlayersIndex({
    players,
    pagination,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/players',
            { search, trust_level: filters.trust_level },
            { preserveState: true },
        );
    };

    const handleFilterChange = (trust_level: string) => {
        router.get(
            '/admin/players',
            {
                search: filters.search,
                trust_level: trust_level === 'all' ? '' : trust_level,
            },
            { preserveState: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Players - Admin" />

            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Players
                        </h1>
                        <p className="text-muted-foreground">
                            Manage player trust levels and view reports
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <form
                                onSubmit={handleSearch}
                                className="flex gap-2"
                            >
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search username..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="w-64 pl-10"
                                    />
                                </div>
                                <Button type="submit" variant="secondary">
                                    Search
                                </Button>
                            </form>

                            <Select
                                value={filters.trust_level || 'all'}
                                onValueChange={handleFilterChange}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Trust Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Levels
                                    </SelectItem>
                                    <SelectItem value="trusted">
                                        Trusted
                                    </SelectItem>
                                    <SelectItem value="neutral">
                                        Neutral
                                    </SelectItem>
                                    <SelectItem value="suspect">
                                        Suspect
                                    </SelectItem>
                                    <SelectItem value="unknown">
                                        No Reports
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Player</TableHead>
                                    <TableHead>Trust Level</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Reports</TableHead>
                                    <TableHead>Override</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {players.map((player) => (
                                    <TableRow key={player.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={`https://mc-heads.net/avatar/${player.username}/32`}
                                                    alt={player.username}
                                                    className="size-8 rounded"
                                                />
                                                <div>
                                                    <p className="font-medium">
                                                        {player.username}
                                                    </p>
                                                    <p className="font-mono text-xs text-muted-foreground">
                                                        {player.uuid.slice(
                                                            0,
                                                            8,
                                                        )}
                                                        ...
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <TrustBadge
                                                level={player.trust_level}
                                                size="sm"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-mono text-sm">
                                                {player.trust_score}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {player.reports_count}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {player.admin_override ? (
                                                <Badge
                                                    variant="outline"
                                                    className="border-purple-500/30 bg-purple-500/10 text-purple-600"
                                                >
                                                    <Shield className="mr-1 size-3" />
                                                    Override
                                                </Badge>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <Link
                                                    href={`/admin/players/${player.id}`}
                                                >
                                                    View
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {players.length === 0 && (
                            <div className="py-12 text-center text-muted-foreground">
                                No players found
                            </div>
                        )}

                        {pagination.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Page {pagination.current_page} of{' '}
                                    {pagination.last_page} ({pagination.total}{' '}
                                    total)
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.current_page === 1}
                                        onClick={() =>
                                            router.get('/admin/players', {
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
                                            router.get('/admin/players', {
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
        </AppLayout>
    );
}
