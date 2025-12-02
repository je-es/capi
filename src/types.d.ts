// src/types.d.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗

    export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

    export interface ApiConfig {
        baseURL         : string;
        timeout         : number;
        headers         : Record<string, string>;
        interceptors    : {
            request     : ((config: ApiOptions) => ApiOptions | Promise<ApiOptions>) | null;
            response    : ((response: ApiResponse) => ApiResponse | Promise<ApiResponse>) | null;
            error       : ((error: ApiError) => any) | null;
        };
    }

    export interface ApiOptions {
        method?         : HttpMethod;
        url             : string;
        data?           : any;
        headers?        : Record<string, string>;
        params?         : Record<string, any>;
        timeout?        : number;
    }

    export interface ApiResponse<T = any> {
        data            : T;
        status          : number;
        statusText      : string;
        headers         : Record<string, string>;
    }

    export interface ApiError {
        message         : string;
        status?         : number;
        data?           : any;
    }

    export interface ApiInterceptors {
        request?        : ((config: ApiOptions) => ApiOptions | Promise<ApiOptions>) | null;
        response?       : ((response: ApiResponse) => ApiResponse | Promise<ApiResponse>) | null;
        error?          : ((error: ApiError) => any) | null;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝