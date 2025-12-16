export type TrustLevel = 'trusted' | 'neutral' | 'suspect' | 'unknown';

export type ReportType =
    | 'cheating'
    | 'scamming'
    | 'toxicity'
    | 'suspicious_account';

export type ReportStatus = 'pending' | 'verified' | 'rejected' | 'resolved';

export interface Player {
    id: number;
    uuid: string;
    username: string;
    trust_level: TrustLevel;
    trust_level_label: string;
    has_reports: boolean;
    created_at: string;
    updated_at: string;
}

export interface PlayerSkinData {
    skin_url: string;
    cape_url: string | null;
    is_slim: boolean;
}

export interface UserReport {
    id: number;
    report_type: ReportType;
    status: ReportStatus;
}

export interface ReportTypeOption {
    value: ReportType;
    label: string;
    description: string;
}
