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
import type { ResourcePackFilters } from '@/types/resource-packs';
import { ChevronDown, Filter, Search, X } from 'lucide-react';
import { useState } from 'react';

interface ResourcePackFiltersComponentProps {
    filters: ResourcePackFilters;
    onFilterChange: (filters: Partial<ResourcePackFilters>) => void;
}

export function ResourcePackFiltersComponent({
    filters,
    onFilterChange,
}: ResourcePackFiltersComponentProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isOpen, setIsOpen] = useState(true);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ search: search || undefined });
    };

    const handleClearSearch = () => {
        setSearch('');
        onFilterChange({ search: undefined });
    };

    const handleClearFilters = () => {
        setSearch('');
        onFilterChange({
            search: undefined,
            version: undefined,
        });
    };

    const hasActiveFilters = filters.search || filters.version;

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search resource packs on Modrinth..."
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
                            value={filters.sort || 'downloads'}
                            onValueChange={(value) =>
                                onFilterChange({
                                    sort: value as ResourcePackFilters['sort'],
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
