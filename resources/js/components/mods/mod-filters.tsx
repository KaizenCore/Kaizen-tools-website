import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Category, ModFilters } from '@/types/mods';
import { ChevronDown, Filter, Search, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface ModFiltersComponentProps {
    filters: ModFilters;
    categories: Category[];
    onFilterChange: (filters: Partial<ModFilters>) => void;
}

export function ModFiltersComponent({
    filters,
    categories,
    onFilterChange,
}: ModFiltersComponentProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isOpen, setIsOpen] = useState(true);

    const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ search: search || undefined });
    }, [search, onFilterChange]);

    const handleClearSearch = useCallback(() => {
        setSearch('');
        onFilterChange({ search: undefined });
    }, [onFilterChange]);

    const handleClearFilters = useCallback(() => {
        setSearch('');
        onFilterChange({
            search: undefined,
            category: undefined,
            loader: undefined,
            version: undefined,
        });
    }, [onFilterChange]);

    const hasActiveFilters = useMemo(
        () =>
            filters.search ||
            filters.category ||
            filters.loader ||
            filters.version,
        [filters.search, filters.category, filters.loader, filters.version],
    );

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search mods across Modrinth & CurseForge..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-11 pr-20 pl-10 text-base"
                />
                {search && (
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={handleClearSearch}
                        className="absolute top-1/2 right-12 size-7 -translate-y-1/2 rounded-full"
                    >
                        <X className="size-4" />
                    </Button>
                )}
                <Button
                    type="submit"
                    size="sm"
                    className="absolute top-1/2 right-1.5 -translate-y-1/2"
                >
                    Search
                </Button>
            </form>

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Filter className="size-4" />
                            <span className="font-medium">Filters</span>
                            <ChevronDown
                                className={`size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </Button>
                    </CollapsibleTrigger>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                        >
                            <X className="mr-1.5 size-4" />
                            Clear all
                        </Button>
                    )}
                </div>

                <CollapsibleContent className="overflow-hidden transition-all duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
                    <div className="flex flex-wrap gap-3 pt-3">
                        <Select
                            value={filters.category || 'all'}
                            onValueChange={(value) =>
                                onFilterChange({
                                    category:
                                        value === 'all' ? undefined : value,
                                })
                            }
                        >
                            <SelectTrigger className="w-full sm:w-44">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                {(categories ?? []).map((cat) => (
                                    <SelectItem key={cat.slug} value={cat.slug}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.loader || 'all'}
                            onValueChange={(value) =>
                                onFilterChange({
                                    loader: value === 'all' ? undefined : value,
                                })
                            }
                        >
                            <SelectTrigger className="w-full sm:w-36">
                                <SelectValue placeholder="Loader" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Loaders</SelectItem>
                                <SelectItem value="forge">Forge</SelectItem>
                                <SelectItem value="fabric">Fabric</SelectItem>
                                <SelectItem value="quilt">Quilt</SelectItem>
                                <SelectItem value="neoforge">
                                    NeoForge
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.sort || 'downloads'}
                            onValueChange={(value) =>
                                onFilterChange({
                                    sort: value as ModFilters['sort'],
                                })
                            }
                        >
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="downloads">
                                    Most Downloads
                                </SelectItem>
                                <SelectItem value="updated">
                                    Recently Updated
                                </SelectItem>
                                <SelectItem value="name">Name (A-Z)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
