// src/types.d.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗

    type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

    interface ApiOptions {
        method?: HttpMethod;
        url: string;
        data?: any;
        headers?: Record<string, string>;
        params?: Record<string, any>;
        timeout?: number;
    }

    interface ApiResponse<T = any> {
        data: T;
        status: number;
        statusText: string;
        headers: Record<string, string>;
    }

    interface ApiError$1 {
        message: string;
        status?: number;
        data?: any;
    }

type ApiError = ApiError$1;

/**
 * API Configuration with type safety
 */
interface ApiConfig {
    baseURL: string;
    timeout: number;
    headers: Record<string, string>;
    interceptors: {
        request: ((config: ApiOptions) => ApiOptions | Promise<ApiOptions>) | null;
        response: ((response: ApiResponse) => ApiResponse | Promise<ApiResponse>) | null;
        error: ((error: ApiError) => any) | null;
    };
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
declare function api<T = any>(options: ApiOptions): Promise<ApiResponse<T>>;
/**
 * Convenience methods with improved typing
 */
declare const http: {
    get: <T = any>(url: string, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
    post: <T = any>(url: string, data?: any, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
    put: <T = any>(url: string, data?: any, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
    patch: <T = any>(url: string, data?: any, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
    delete: <T = any>(url: string, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
    head: <T = any>(url: string, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
    options: <T = any>(url: string, options?: Partial<ApiOptions>) => Promise<ApiResponse<T>>;
};

export { type ApiError, type ApiOptions, type ApiResponse, api, configureApi, getApiConfig, http, resetApiConfig };
