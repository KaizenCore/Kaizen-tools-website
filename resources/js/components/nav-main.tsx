import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({
    title,
    items = [],
}: {
    title: string;
    items: NavItem[];
}) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                {title}
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const href = resolveUrl(item.href);
                    const currentPath = page.url.split('?')[0]; // Remove query string
                    // Exact match only (prevents parent routes from matching child routes)
                    const isActive = currentPath === href;
                    const isDisabled = item.href === '#';

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild={!isDisabled}
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className="transition-all duration-200 hover:translate-x-1"
                                disabled={isDisabled}
                            >
                                {isDisabled ? (
                                    <div className="flex cursor-not-allowed items-center gap-2 opacity-50">
                                        {item.icon && (
                                            <item.icon className="size-4" />
                                        )}
                                        <span>{item.title}</span>
                                    </div>
                                ) : (
                                    <Link href={item.href} prefetch>
                                        {item.icon && (
                                            <item.icon className="size-4 transition-transform duration-200 group-hover:scale-110" />
                                        )}
                                        <span>{item.title}</span>
                                    </Link>
                                )}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
