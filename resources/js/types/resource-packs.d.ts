export interface ResourcePack {
    id: string;
    slug: string;
    name: string;
    summary: string | null;
    body: string | null;
    author: string;
    icon_url: string | null;
    downloads: number;
    formatted_downloads: string;
    followers: number;
    updated_at: string | null;
    published_at: string | null;
    categories: string[];
    game_versions: string[];
    gallery: GalleryImage[];
    project_url: string | null;
}

export interface GalleryImage {
    url: string;
    featured: boolean;
    title?: string;
    description?: string;
}

export interface ResourcePackVersion {
    id: string;
    name: string;
    version_number: string;
    game_versions: string[];
    downloads: number;
    date_published: string | null;
    files: VersionFile[];
}

export interface VersionFile {
    url: string;
    filename: string;
    primary: boolean;
    size: number;
}

export interface ResourcePackFilters {
    search?: string;
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
