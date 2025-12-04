// src/types.d.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗

    type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

    // Generic type for request data (can be JSON, FormData, Blob, or string)
    type RequestData = Record<string, unknown> | FormData | Blob | string | null;

    // Generic type for params (string, number, boolean, or null)
    type ParamValue = string | number | boolean | null | undefined;

    interface ApiConfig<T = unknown> {
        baseURL         : string;
        timeout         : number;
        headers         : Record<string, string>;
        interceptors    : {
            request     : ((config: ApiOptions) => ApiOptions | Promise<ApiOptions>) | null;
            response    : (<R = T>(response: ApiResponse<R>) => ApiResponse<R> | Promise<ApiResponse<R>>) | null;
            error       : ((error: ApiError) => ApiResponse<T> | Promise<ApiResponse<T>>) | null;
        };
    }

    interface ApiOptions {
        method?         : HttpMethod;
        url             : string;
        data?           : RequestData;
        headers?        : Record<string, string>;
        params?         : Record<string, ParamValue>;
        timeout?        : number;
    }

    interface ApiResponse<T = unknown> {
        data            : T;
        status          : number;
        statusText      : string;
        headers         : Record<string, string>;
    }

    interface ApiError<T = unknown> {
        message         : string;
        status          : number;
        data            : T | null;
    }

    interface ApiInterceptors<T = unknown> {
        request?        : ((config: ApiOptions) => ApiOptions | Promise<ApiOptions>) | null;
        response?       : (<R = T>(response: ApiResponse<R>) => ApiResponse<R> | Promise<ApiResponse<R>>) | null;
        error?          : ((error: ApiError) => ApiResponse<T> | Promise<ApiResponse<T>>) | null;
    }

/**
 * Configure API client
 */
declare function configureApi(config: Partial<ApiConfig>): void;
/**
 * Get current API configuration
 */
declare function getApiConfig(): Readonly<ApiConfig>;
/**
 * Reset API configuration to defaults
 */
declare function resetApiConfig(): void;
/**
 * API client with improved error handling and type safety
 */
declare function api<T = unknown>(options: ApiOptions): Promise<ApiResponse<T>>;
/**
 * Convenience methods with improved typing
 */
declare const http: {
    get: <T = unknown>(url: string, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
    post: <T = unknown>(url: string, data?: RequestData, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
    put: <T = unknown>(url: string, data?: RequestData, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
    patch: <T = unknown>(url: string, data?: RequestData, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
    delete: <T = unknown>(url: string, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
    head: <T = unknown>(url: string, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
    options: <T = unknown>(url: string, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
};

export { type ApiConfig, type ApiError, type ApiInterceptors, type ApiOptions, type ApiResponse, type HttpMethod, type ParamValue, type RequestData, api, configureApi, getApiConfig, http, resetApiConfig };
