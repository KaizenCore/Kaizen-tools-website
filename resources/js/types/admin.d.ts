import type { ReportStatus, ReportType, TrustLevel } from './players';

export interface AdminPlayer {
    id: number;
    uuid: string;
    username: string;
    trust_level: TrustLevel;
    trust_level_label: string;
    trust_score: number;
    admin_override: boolean;
    admin_override_at: string | null;
    admin_override_by: {
        id: number;
        name: string;
    } | null;
    admin_notes: string | null;
    reports_count: number;
    verified_reports_count: number;
    created_at: string;
    updated_at: string;
}

export interface AdminReport {
    id: number;
    player: {
        id: number;
        username: string;
        uuid: string;
        trust_level: TrustLevel;
    };
    reporter: {
        id: number;
        name: string;
    } | null;
    report_type: ReportType;
    report_type_label: string;
    reason: string;
    evidence_url: string | null;
    status: ReportStatus;
    status_label: string;
    created_at: string;
}

export interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface ReportStats {
    pending: number;
    verified: number;
    rejected: number;
}
