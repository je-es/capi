// src/types.d.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗

    export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

    // Generic type for request data (can be JSON, FormData, Blob, or string)
    export type RequestData = Record<string, unknown> | FormData | Blob | string | null;

    // Generic type for params (string, number, boolean, or null)
    export type ParamValue = string | number | boolean | null | undefined;

    export interface ApiConfig<T = unknown> {
        baseURL         : string;
        timeout         : number;
        headers         : Record<string, string>;
        interceptors    : {
            request     : ((config: ApiOptions) => ApiOptions | Promise<ApiOptions>) | null;
            response    : (<R = T>(response: ApiResponse<R>) => ApiResponse<R> | Promise<ApiResponse<R>>) | null;
            error       : ((error: ApiError) => ApiResponse<T> | Promise<ApiResponse<T>>) | null;
        };
    }

    export interface ApiOptions {
        method?         : HttpMethod;
        url             : string;
        data?           : RequestData;
        headers?        : Record<string, string>;
        params?         : Record<string, ParamValue>;
        timeout?        : number;
    }

    export interface ApiResponse<T = unknown> {
        data            : T;
        status          : number;
        statusText      : string;
        headers         : Record<string, string>;
    }

    export interface ApiError<T = unknown> {
        message         : string;
        status          : number;
        data            : T | null;
    }

    export interface ApiInterceptors<T = unknown> {
        request?        : ((config: ApiOptions) => ApiOptions | Promise<ApiOptions>) | null;
        response?       : (<R = T>(response: ApiResponse<R>) => ApiResponse<R> | Promise<ApiResponse<R>>) | null;
        error?          : ((error: ApiError) => ApiResponse<T> | Promise<ApiResponse<T>>) | null;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝