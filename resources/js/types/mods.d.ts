export interface Mod {
    id: number;
    name: string;
    slug: string;
    summary: string | null;
    author: string;
    icon_url: string | null;
    total_downloads: number;
    formatted_downloads: string;
    last_updated_at: string | null;
    categories: string[];
    sources: ModSource[];
    has_modrinth: boolean;
    has_curseforge: boolean;
}

export interface ModSource {
    id: number;
    platform: 'modrinth' | 'curseforge';
    external_id: string;
    external_slug: string;
    project_url: string;
    downloads: number;
    formatted_downloads: string;
    rating: number | null;
    latest_version: string | null;
    supported_versions: string[];
    supported_loaders: string[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    mods_count?: number;
}

export interface ModFilters {
    search?: string;
    category?: string;
    loader?: string;
    version?: string;
    sort?: 'downloads' | 'updated' | 'name';
    order?: 'asc' | 'desc';
}

export interface Paginated<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
        path: string;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}
