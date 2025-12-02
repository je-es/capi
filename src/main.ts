// src/main.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type { ApiOptions, ApiResponse, ApiError, ApiConfig } from './types.d';
    export * from './types.d';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    let apiConfig: ApiConfig = {
        baseURL         : '',
        timeout         : 30000,
        headers         : {},
        interceptors    : {
            request     : null,
            response    : null,
            error       : null,
        },
    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

    /**
     * Configure API client
     */
    export function configureApi(config: Partial<ApiConfig>): void {
        apiConfig = {
            ...apiConfig,
            ...config,
            headers: { ...apiConfig.headers, ...config.headers },
            interceptors: { ...apiConfig.interceptors, ...config.interceptors },
        };
    }

    /**
     * Get current API configuration
     */
    export function getApiConfig(): Readonly<ApiConfig> {
        return { ...apiConfig };
    }

    /**
     * Reset API configuration to defaults
     */
    export function resetApiConfig(): void {
        apiConfig = {
            baseURL: '',
            timeout: 30000,
            headers: {},
            interceptors: {
                request: null,
                response: null,
                error: null,
            },
        };
    }

    /**
     * API client with improved error handling and type safety
     */
    export async function api<T = any>(options: ApiOptions): Promise<ApiResponse<T>> {
        // Merge with default config
        let config: ApiOptions = {
            method: options.method || 'GET',
            url: options.url,
            data: options.data,
            headers: { ...apiConfig.headers, ...options.headers },
            params: options.params,
            timeout: options.timeout ?? apiConfig.timeout,
        };

        // Apply request interceptor
        if (apiConfig.interceptors.request) {
            try {
                config = await Promise.resolve(apiConfig.interceptors.request(config));
            } catch (error) {
                throw createApiError('Request interceptor failed', 0, error);
            }
        }

        // Build URL
        let url = config.url.startsWith('http')
            ? config.url
            : `${apiConfig.baseURL}${config.url}`;

        // Add query params
        if (config.params && Object.keys(config.params).length > 0) {
            const queryString = new URLSearchParams(
                Object.entries(config.params).reduce((acc, [key, value]) => {
                    if (value != null) {
                        acc[key] = String(value);
                    }
                    return acc;
                }, {} as Record<string, string>)
            ).toString();

            if (queryString) {
                url += (url.includes('?') ? '&' : '?') + queryString;
            }
        }

        // Prepare fetch options
        const fetchOptions: RequestInit = {
            method: config.method,
            headers: config.headers,
            signal: createAbortSignal(config.timeout || 30000),
        };

        // Add body for non-GET requests
        if (config.data && config.method !== 'GET' && config.method !== 'HEAD') {
            const contentType = config.headers?.['Content-Type'] || config.headers?.['content-type'];

            if (contentType?.includes('application/json')) {
                fetchOptions.body = JSON.stringify(config.data);
            } else if (config.data instanceof FormData) {
                fetchOptions.body = config.data;
                // Let browser set Content-Type with boundary for FormData
                delete fetchOptions.headers;
                fetchOptions.headers = { ...config.headers };
                delete (fetchOptions.headers as any)['Content-Type'];
            } else if (config.data instanceof Blob) {
                fetchOptions.body = config.data;
            } else if (typeof config.data === 'string') {
                fetchOptions.body = config.data;
            } else {
                // Default to JSON
                fetchOptions.body = JSON.stringify(config.data);
                if (!contentType) {
                    (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
                }
            }
        }

        try {
            // Make request
            const response = await fetch(url, fetchOptions);

            // Parse response
            let data: T;
            const contentType = response.headers.get('Content-Type') || '';

            if (contentType.includes('application/json')) {
                const text = await response.text();
                data = text ? JSON.parse(text) : null;
            } else if (contentType.includes('text/')) {
                data = await response.text() as any;
            } else if (contentType.includes('application/octet-stream') || contentType.includes('application/pdf')) {
                data = await response.blob() as any;
            } else {
                // Try to parse as JSON first, fall back to text
                const text = await response.text();
                try {
                    data = text ? JSON.parse(text) : text as any;
                } catch {
                    data = text as any;
                }
            }

            // Check for HTTP errors
            if (!response.ok) {
                const error = createApiError(
                    response.statusText || 'Request failed',
                    response.status,
                    data
                );

                // Apply error interceptor
                if (apiConfig.interceptors.error) {
                    return apiConfig.interceptors.error(error);
                }

                throw error;
            }

            // Create response object
            const apiResponse: ApiResponse<T> = {
                data,
                status: response.status,
                statusText: response.statusText,
                headers: {},
            };

            // Convert headers to object
            response.headers.forEach((value, key) => {
                apiResponse.headers[key] = value;
            });

            // Apply response interceptor
            if (apiConfig.interceptors.response) {
                return await Promise.resolve(apiConfig.interceptors.response(apiResponse));
            }

            return apiResponse;

        } catch (error: any) {
            // Handle different error types
            let apiError: ApiError;

            if (error.name === 'AbortError') {
                apiError = createApiError('Request timeout', 0, null);
            } else if (error instanceof TypeError && error.message.includes('fetch')) {
                apiError = createApiError('Network error', 0, null);
            } else if (error.message && error.status !== undefined) {
                // Already an ApiError
                apiError = error;
            } else {
                apiError = createApiError(
                    error.message || 'Unknown error',
                    error.status || 0,
                    error.data || null
                );
            }

            // Apply error interceptor
            if (apiConfig.interceptors.error) {
                return apiConfig.interceptors.error(apiError);
            }

            throw apiError;
        }
    }

    /**
     * Convenience methods with improved typing
     */
    export const http = {
        get: <T = any>(url: string, options?: Partial<ApiOptions>): Promise<ApiResponse<T>> =>
            api<T>({ ...options, method: 'GET', url }),

        post: <T = any>(url: string, data?: any, options?: Partial<ApiOptions>): Promise<ApiResponse<T>> =>
            api<T>({ ...options, method: 'POST', url, data }),

        put: <T = any>(url: string, data?: any, options?: Partial<ApiOptions>): Promise<ApiResponse<T>> =>
            api<T>({ ...options, method: 'PUT', url, data }),

        patch: <T = any>(url: string, data?: any, options?: Partial<ApiOptions>): Promise<ApiResponse<T>> =>
            api<T>({ ...options, method: 'PATCH', url, data }),

        delete: <T = any>(url: string, options?: Partial<ApiOptions>): Promise<ApiResponse<T>> =>
            api<T>({ ...options, method: 'DELETE', url }),

        head: <T = any>(url: string, options?: Partial<ApiOptions>): Promise<ApiResponse<T>> =>
            api<T>({ ...options, method: 'HEAD', url }),

        options: <T = any>(url: string, options?: Partial<ApiOptions>): Promise<ApiResponse<T>> =>
            api<T>({ ...options, method: 'OPTIONS', url }),
    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ HELP ════════════════════════════════════════╗

    /**
     * Create AbortSignal with timeout
     */
    function createAbortSignal(timeout: number): AbortSignal {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), timeout);
        return controller.signal;
    }

    /**
     * Create standardized API error
     */
    function createApiError(message: string, status: number, data: any): ApiError {
        return {
            message,
            status,
            data,
        };
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝