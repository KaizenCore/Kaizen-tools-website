export interface ServerStatusResponse {
    success: boolean;
    online: boolean;
    address: string;
    hostname?: string;
    port?: number;
    ip?: string;
    players?: {
        online: number;
        max: number;
        list?: string[];
    };
    version?: string;
    motd?: {
        raw: string[];
        clean: string[];
        html: string[];
    };
    icon?: string;
    software?: string;
    protocol?: {
        version: number;
        name: string;
    };
    error?: string;
}

export interface RecentServerSearch {
    address: string;
    timestamp: number;
    online: boolean;
}

export interface UuidConversion {
    uuid: string;
    username: string;
    uuid_formatted: string;
}

export interface ConversionHistory {
    input: string;
    result: UuidConversion;
    timestamp: number;
}
