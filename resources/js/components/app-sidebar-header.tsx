import { Breadcrumbs } from '@/components/breadcrumbs';
import { CommandPalette } from '@/components/command-palette';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Command, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    // Global keyboard shortcut handler
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // ⌘K (Mac) or Ctrl+K (Windows/Linux)
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsCommandPaletteOpen((prev) => !prev);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <>
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur transition-all ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 supports-[backdrop-filter]:bg-background/60 md:px-4">
                <div className="flex flex-1 items-center gap-4">
                    <SidebarTrigger className="-ml-1 transition-transform hover:scale-110" />
                    <div className="h-6 w-px bg-border" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCommandPaletteOpen(true)}
                        className="h-9 gap-2 border-border/50 bg-background/50 transition-all hover:scale-[1.02] hover:border-primary/30 hover:bg-accent/50"
                    >
                        <Search className="size-4 text-muted-foreground" />
                        <span className="hidden text-muted-foreground md:inline">
                            Quick Search
                        </span>
                        <div className="hidden items-center gap-0.5 md:flex">
                            <kbd className="flex h-5 items-center gap-0.5 rounded border border-border/80 bg-muted/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                <Command className="size-2.5" />
                                <span>K</span>
                            </kbd>
                        </div>
                    </Button>
                </div>
            </header>

            <CommandPalette
                open={isCommandPaletteOpen}
                onOpenChange={setIsCommandPaletteOpen}
            />
        </>
    );
}
