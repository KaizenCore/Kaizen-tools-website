import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-background p-6 md:p-10">
            {/* Gaming-inspired background pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            {/* Subtle gradient orbs */}
            <div className="pointer-events-none absolute top-1/4 left-1/4 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
            <div className="pointer-events-none absolute right-1/4 bottom-1/4 size-96 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/5 blur-3xl dark:bg-accent/10" />

            <div className="relative w-full max-w-sm animate-in duration-700 fade-in slide-in-from-bottom-4">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="group flex flex-col items-center gap-2 font-medium transition-transform duration-300 hover:scale-105"
                        >
                            <div className="mb-1 flex size-12 items-center justify-center rounded-xl bg-primary/5 shadow-sm ring-1 ring-border/50 transition-all duration-300 group-hover:bg-primary/10 group-hover:shadow-md group-hover:ring-primary/20 dark:bg-primary/10 dark:group-hover:bg-primary/20">
                                <AppLogoIcon className="size-7 fill-current text-primary transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border/50 bg-card/50 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-xl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
