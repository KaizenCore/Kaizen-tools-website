import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="flex min-h-[calc(100vh-4rem)] flex-col">
                    <main className="flex-1 animate-in duration-300 fade-in slide-in-from-bottom-2">
                        {children}
                    </main>
                    <footer className="mt-auto border-t bg-muted/30 px-6 py-6 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-center text-sm text-muted-foreground">
                                Mod data provided by{' '}
                                <a
                                    href="https://modrinth.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-green-600 transition-colors hover:text-green-700 hover:underline dark:text-green-500 dark:hover:text-green-400"
                                >
                                    Modrinth
                                </a>
                                {' & '}
                                <a
                                    href="https://curseforge.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-orange-500 transition-colors hover:text-orange-600 hover:underline dark:text-orange-400 dark:hover:text-orange-300"
                                >
                                    CurseForge
                                </a>
                            </p>
                            <p className="text-center text-xs text-muted-foreground/70">
                                Kaizen Tools | Powered by Minecraft community
                            </p>
                        </div>
                    </footer>
                </div>
            </AppContent>
        </AppShell>
    );
}
