interface ConfigType {
    port: number;
    proxy: {
        prefix: string;
        target: string;
    }[];
    login: {
        disable?: boolean;
        prefix?: string;
        url: string;
        target: string;
        method: string;
    };
    refreshToken: {
        disable?: boolean;
        method: string;
        url: string;
        target?: string;
        expiration: number;
    };
}
export declare const conf: ConfigType;
export {};
