// test/main.test.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import { describe, expect, test, mock, beforeEach } from 'bun:test';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    describe('Basics', () => {
        beforeEach(async () => {
            const { resetApiConfig } = await import('../src/main');
            resetApiConfig();
        });

        test('should make GET request', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({ data: 'test' }),
                text: async () => '{"data":"test"}',
                headers: new Headers({ 'content-type': 'application/json' }),
            })) as any;

            const response = await http.get('/api/test');

            expect(response.status).toBe(200);
            expect(response.data).toEqual({ data: 'test' });
        });

        test('should handle POST request with data', async () => {
            const { http } = await import('../src/main');

            const postData = { name: 'John' };
            let capturedBody: any;

            global.fetch = mock(async (url, options) => {
                capturedBody = JSON.parse(options?.body as string);
                return {
                    ok: true,
                    status: 201,
                    statusText: 'Created',
                    json: async () => postData,
                    text: async () => JSON.stringify(postData),
                    headers: new Headers({ 'content-type': 'application/json' }),
                };
            }) as any;

            await http.post('/api/users', postData);

            expect(capturedBody).toEqual(postData);
        });

        test('should handle API errors', async () => {
            const { api } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                json: async () => ({ error: 'Not found' }),
                text: async () => '{"error":"Not found"}',
                headers: new Headers({ 'content-type': 'application/json' }),
            })) as any;

            try {
                await api({ method: 'GET', url: '/api/missing' });
                expect(true).toBe(false);
            } catch (error: any) {
                expect(error.status).toBe(404);
            }
        });

        test('should apply request interceptors', async () => {
            const { configureApi, http, resetApiConfig } = await import('../src/main');

            const interceptor = mock((config) => {
                config.headers = { ...config.headers, 'X-Custom': 'test' };
                return config;
            });

            configureApi({
                interceptors: { request: interceptor, response: null, error: null }
            });

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({}),
                text: async () => '{}',
                headers: new Headers(),
            })) as any;

            await http.get('/test');

            expect(interceptor).toHaveBeenCalled();

            resetApiConfig();
        });
    });

    describe('Configuration', () => {
        test('should get current API configuration', async () => {
            const { configureApi, getApiConfig } = await import('../src/main');

            configureApi({
                baseURL: 'https://api.example.com',
                timeout: 5000,
            });

            const config = getApiConfig();
            expect(config.baseURL).toBe('https://api.example.com');
            expect(config.timeout).toBe(5000);
        });

        test('should reset API configuration', async () => {
            const { configureApi, resetApiConfig, getApiConfig } = await import('../src/main');

            configureApi({
                baseURL: 'https://api.example.com',
                timeout: 5000,
            });

            resetApiConfig();

            const config = getApiConfig();
            expect(config.baseURL).toBe('');
            expect(config.timeout).toBe(30000);
        });
    });

    describe('HTTP Methods', () => {
        test('should handle PUT request', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({ updated: true }),
                text: async () => '{"updated":true}',
                headers: new Headers({ 'content-type': 'application/json' }),
            })) as any;

            const response = await http.put('/api/users/1', { name: 'Jane' });
            expect(response.status).toBe(200);
        });

        test('should handle PATCH request', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({ patched: true }),
                text: async () => '{"patched":true}',
                headers: new Headers({ 'content-type': 'application/json' }),
            })) as any;

            const response = await http.patch('/api/users/1', { name: 'Jane' });
            expect(response.status).toBe(200);
        });

        test('should handle DELETE request', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 204,
                statusText: 'No Content',
                json: async () => ({}),
                text: async () => '',
                headers: new Headers(),
            })) as any;

            const response = await http.delete('/api/users/1');
            expect(response.status).toBe(204);
        });

        test('should handle HEAD request', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({}),
                text: async () => '',
                headers: new Headers(),
            })) as any;

            const response = await http.head('/api/users/1');
            expect(response.status).toBe(200);
        });

        test('should handle OPTIONS request', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({}),
                text: async () => '',
                headers: new Headers({ 'Allow': 'GET, POST, PUT, DELETE' }),
            })) as any;

            const response = await http.options('/api/users');
            expect(response.status).toBe(200);
        });
    });

    describe('Request Body Handling', () => {
        test('should handle FormData', async () => {
            const { http } = await import('../src/main');

            const formData = new FormData();
            formData.append('file', 'test');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({ success: true }),
                text: async () => '{"success":true}',
                headers: new Headers({ 'content-type': 'application/json' }),
            })) as any;

            const response = await http.post('/api/upload', formData);
            expect(response.status).toBe(200);
        });

        test('should handle Blob data', async () => {
            const { http } = await import('../src/main');

            const blob = new Blob(['test'], { type: 'text/plain' });

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({ success: true }),
                text: async () => '{"success":true}',
                headers: new Headers({ 'content-type': 'application/json' }),
            })) as any;

            const response = await http.post('/api/upload', blob);
            expect(response.status).toBe(200);
        });

        test('should handle string data', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({ success: true }),
                text: async () => '{"success":true}',
                headers: new Headers({ 'content-type': 'application/json' }),
            })) as any;

            const response = await http.post('/api/text', 'plain text');
            expect(response.status).toBe(200);
        });

        test('should handle non-JSON data without Content-Type', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({ success: true }),
                text: async () => '{"success":true}',
                headers: new Headers({ 'content-type': 'application/json' }),
            })) as any;

            const response = await http.post('/api/data', { test: 'data' }, {
                headers: {}
            });
            expect(response.status).toBe(200);
        });
    });

    describe('Response Handling', () => {
        test('should handle text response', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => { throw new Error(); },
                text: async () => 'plain text response',
                headers: new Headers({ 'content-type': 'text/plain' }),
            })) as any;

            const response = await http.get('/api/text');
            expect(response.data).toBe('plain text response');
        });

        test('should handle blob response (PDF)', async () => {
            const { http } = await import('../src/main');

            const blob = new Blob(['pdf content'], { type: 'application/pdf' });

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                blob: async () => blob,
                text: async () => '',
                headers: new Headers({ 'content-type': 'application/pdf' }),
            })) as any;

            const response = await http.get('/api/document.pdf');
            expect(response.data).toBeInstanceOf(Blob);
        });

        test('should handle octet-stream response', async () => {
            const { http } = await import('../src/main');

            const blob = new Blob(['binary content']);

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                blob: async () => blob,
                text: async () => '',
                headers: new Headers({ 'content-type': 'application/octet-stream' }),
            })) as any;

            const response = await http.get('/api/binary');
            expect(response.data).toBeInstanceOf(Blob);
        });

        test('should handle empty JSON response', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => null,
                text: async () => '',
                headers: new Headers({ 'content-type': 'application/json' }),
            })) as any;

            const response = await http.get('/api/empty');
            expect(response.data).toBeNull();
        });

        test('should fallback to text for unknown content type with invalid JSON', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                text: async () => 'not json',
                headers: new Headers({ 'content-type': 'application/unknown' }),
            })) as any;

            const response = await http.get('/api/unknown');
            expect(response.data).toBe('not json');
        });

        test('should parse JSON for unknown content type with valid JSON', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                text: async () => '{"valid":"json"}',
                headers: new Headers({ 'content-type': 'application/unknown' }),
            })) as any;

            const response = await http.get('/api/unknown');
            expect(response.data).toEqual({ valid: 'json' });
        });
    });

    describe('Query Parameters', () => {
        test('should handle query parameters', async () => {
            const { http } = await import('../src/main');

            let capturedUrl: string = '';

            global.fetch = mock(async (url) => {
                capturedUrl = url as string;
                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => ({}),
                    text: async () => '{}',
                    headers: new Headers({ 'content-type': 'application/json' }),
                };
            }) as any;

            await http.get('/api/search', {
                params: { q: 'test', page: 1, filter: null }
            });

            expect(capturedUrl).toContain('q=test');
            expect(capturedUrl).toContain('page=1');
            expect(capturedUrl).not.toContain('filter');
        });

        test('should append params to URL with existing query string', async () => {
            const { http, configureApi } = await import('../src/main');

            configureApi({ baseURL: 'https://api.example.com' });

            let capturedUrl: string = '';

            global.fetch = mock(async (url) => {
                capturedUrl = url as string;
                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => ({}),
                    text: async () => '{}',
                    headers: new Headers({ 'content-type': 'application/json' }),
                };
            }) as any;

            await http.get('/api/search?existing=param', {
                params: { new: 'param' }
            });

            expect(capturedUrl).toContain('existing=param');
            expect(capturedUrl).toContain('new=param');
            expect(capturedUrl).toContain('&');
        });
    });

    describe('Interceptors', () => {
        test('should apply response interceptor', async () => {
            const { configureApi, http } = await import('../src/main');

            const responseInterceptor = mock((response) => {
                response.data = { intercepted: true };
                return response;
            });

            configureApi({
                interceptors: { request: null, response: responseInterceptor, error: null }
            });

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({ original: true }),
                text: async () => '{"original":true}',
                headers: new Headers({ 'content-type': 'application/json' }),
            })) as any;

            const response = await http.get('/test');
            expect(response.data).toEqual({ intercepted: true });
        });

        test('should apply error interceptor', async () => {
            const { configureApi, http } = await import('../src/main');

            const errorInterceptor = mock((error) => {
                return { data: { handled: true }, status: 200, statusText: 'OK', headers: {} };
            });

            configureApi({
                interceptors: { request: null, response: null, error: errorInterceptor }
            });

            global.fetch = mock(async () => ({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
                json: async () => ({ error: true }),
                text: async () => '{"error":true}',
                headers: new Headers({ 'content-type': 'application/json' }),
            })) as any;

            const response = await http.get('/test');
            expect(response.data).toEqual({ handled: true });
        });

        test('should handle request interceptor failure', async () => {
            const { configureApi, http } = await import('../src/main');

            configureApi({
                interceptors: {
                    request: () => {
                        throw new Error('Interceptor failed');
                    },
                    response: null,
                    error: null
                }
            });

            try {
                await http.get('/test');
                expect(true).toBe(false);
            } catch (error: any) {
                expect(error.message).toBe('Request interceptor failed');
            }
        });

        test('should handle async request interceptor', async () => {
            const { configureApi, http } = await import('../src/main');

            configureApi({
                interceptors: {
                    request: async (config) => {
                        await new Promise(resolve => setTimeout(resolve, 10));
                        config.headers = { ...config.headers, 'X-Async': 'true' };
                        return config;
                    },
                    response: null,
                    error: null
                }
            });

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({}),
                text: async () => '{}',
                headers: new Headers(),
            })) as any;

            await http.get('/test');
            expect(global.fetch).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        test('should handle timeout error', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => {
                await new Promise((_, reject) => {
                    const error = new Error('Timeout');
                    error.name = 'AbortError';
                    setTimeout(() => reject(error), 10);
                });
                return {} as any;
            }) as any;

            try {
                await http.get('/api/slow', { timeout: 1 });
                expect(true).toBe(false);
            } catch (error: any) {
                expect(error.message).toBe('Request timeout');
            }
        });

        test('should handle network error', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => {
                throw new TypeError('Failed to fetch');
            }) as any;

            try {
                await http.get('/api/test');
                expect(true).toBe(false);
            } catch (error: any) {
                expect(error.message).toBe('Network error');
            }
        });

        test('should handle unknown error', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => {
                throw new Error('Unknown error');
            }) as any;

            try {
                await http.get('/api/test');
                expect(true).toBe(false);
            } catch (error: any) {
                expect(error.message).toBe('Unknown error');
            }
        });

        test('should handle error with no status text', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: false,
                status: 500,
                statusText: '',
                json: async () => ({}),
                text: async () => '{}',
                headers: new Headers(),
            })) as any;

            try {
                await http.get('/api/test');
                expect(true).toBe(false);
            } catch (error: any) {
                expect(error.message).toBe('Request failed');
            }
        });

        test('should handle error interceptor for network errors', async () => {
            const { configureApi, http } = await import('../src/main');

            const errorInterceptor = mock(() => {
                return { data: null, status: 0, statusText: '', headers: {} };
            });

            configureApi({
                interceptors: { request: null, response: null, error: errorInterceptor }
            });

            global.fetch = mock(async () => {
                throw new TypeError('Failed to fetch');
            }) as any;

            const response = await http.get('/api/test');
            expect(errorInterceptor).toHaveBeenCalled();
        });
    });

    describe('URL Handling', () => {
        test('should use absolute URLs as-is', async () => {
            const { http, configureApi } = await import('../src/main');

            configureApi({ baseURL: 'https://api.example.com' });

            let capturedUrl: string = '';

            global.fetch = mock(async (url) => {
                capturedUrl = url as string;
                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => ({}),
                    text: async () => '{}',
                    headers: new Headers(),
                };
            }) as any;

            await http.get('https://external.com/api/test');
            expect(capturedUrl).toBe('https://external.com/api/test');
        });

        test('should combine baseURL with relative URL', async () => {
            const { http, configureApi } = await import('../src/main');

            configureApi({ baseURL: 'https://api.example.com' });

            let capturedUrl: string = '';

            global.fetch = mock(async (url) => {
                capturedUrl = url as string;
                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => ({}),
                    text: async () => '{}',
                    headers: new Headers(),
                };
            }) as any;

            await http.get('/api/test');
            expect(capturedUrl).toBe('https://api.example.com/api/test');
        });
    });

    describe('Edge Cases', () => {
        test('should handle response with empty text that parses to empty string', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                text: async () => '',
                headers: new Headers({ 'content-type': 'application/unknown' }),
            })) as any;

            const response = await http.get('/api/empty');
            expect(response.data).toBe('');
        });

        test('should handle POST with JSON content-type header', async () => {
            const { http } = await import('../src/main');

            global.fetch = mock(async () => ({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: async () => ({ success: true }),
                text: async () => '{"success":true}',
                headers: new Headers({ 'content-type': 'application/json' }),
            })) as any;

            const response = await http.post('/api/test', { data: 'test' }, {
                headers: { 'Content-Type': 'application/json' }
            });
            expect(response.status).toBe(200);
        });

        test('should handle params with empty object', async () => {
            const { http } = await import('../src/main');

            let capturedUrl: string = '';

            global.fetch = mock(async (url) => {
                capturedUrl = url as string;
                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => ({}),
                    text: async () => '{}',
                    headers: new Headers(),
                };
            }) as any;

            await http.get('/api/test', { params: {} });
            expect(capturedUrl).not.toContain('?');
        });
    });

// ╚══════════════════════════════════════════════════════════════════════════════════════╝