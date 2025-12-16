export interface Skin {
    id: number;
    uuid: string;
    username: string;
    skin_url: string;
    cape_url: string | null;
    skin_type: 'classic' | 'slim';
    is_slim: boolean;
    searched_at: string;
    created_at: string;
    updated_at: string;
}

export interface SkinSearch {
    id: number;
    username: string;
    uuid: string;
    searched_at: string;
}

export interface RecentSearches {
    recent: SkinSearch[];
    popular: SkinSearch[];
}
