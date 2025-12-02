<!-- ╔══════════════════════════════ BEG ══════════════════════════════╗ -->

<br>
<div align="center">
    <p>
        <img src="./assets/img/logo.png" alt="logo" style="" height="80" />
    </p>
</div>

<div align="center">
    <img src="https://img.shields.io/badge/v-0.0.1-black"/>
    <a href="https://github.com/maysara-elshewehy">
    </a>
    <a href="https://github.com/je-es/capi#readme"> <img src="https://img.shields.io/badge/🔥-@je--es/capi-black"/> </a>
</div>
<br>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->



<!-- ╔══════════════════════════════ DOC ══════════════════════════════╗ -->

- ## Quick Start 🔥

    > _**A lightweight, type-safe HTTP client with interceptors, automatic retries, and comprehensive error handling.**_

    - #### Setup

        > install [`space`](https://github.com/solution-lib/space) first.

        ```bash
        # install
        space i @je-es/capi
        ```

        ```ts
        // import
        import { api, http, configureApi } from '@je-es/capi';
        ```

    <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

    - #### Usage

        - ##### Basic Requests
            ```ts
            // GET request
            const { data } = await http.get('/api/users');

            // POST request
            const response = await http.post('/api/users', {
                name    : 'John Doe',
                email   : 'john@example.com'
            });

            // Other methods
            await http.put      ('/api/users/1', userData);
            await http.patch    ('/api/users/1', { name: 'Jane' });
            await http.delete   ('/api/users/1');
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ##### Configuration
            ```ts
            // Set base URL and default headers
            configureApi({
                baseURL : 'https://api.example.com',
                timeout : 10000,
                headers : {
                    'Authorization': 'Bearer token123',
                    'Content-Type': 'application/json'
                }
            });
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ##### Query Parameters
            ```ts
            // Automatically handles URL encoding
            const { data } = await http.get('/api/search', {
                params: { q: 'typescript', page: 1, limit: 10 }
            });
            // → /api/search?q=typescript&page=1&limit=10
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ##### Request Interceptors
            ```ts
            configureApi({
                interceptors: {
                    request: (config) => {
                        // Add authentication token
                        config.headers['Authorization'] = `Bearer ${getToken()}`;
                        return config;
                    }
                }
            });
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ##### Response Interceptors
            ```ts
            configureApi({
                interceptors: {
                    response: (response) => {
                        // Transform response data
                        console.log('Response received:', response.status);
                        return response;
                    }
                }
            });
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ##### Error Handling
            ```ts
            configureApi({
                interceptors: {
                    error: (error) => {
                        if (error.status === 401) {
                            // Redirect to login
                            window.location.href = '/login';
                        }
                        throw error; // Re-throw if not handled
                    }
                }
            });

            // Or handle per-request
            try {
                const { data } = await http.get('/api/protected');
            } catch (error) {
                console.error('Request failed:', error.message);
            }
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ##### File Uploads
            ```ts
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('name', 'document.pdf');

            await http.post('/api/upload', formData);
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ##### TypeScript Support
            ```ts
            interface User {
                id      : number;
                name    : string;
                email   : string;
            }

            // Type-safe responses
            const { data } = await http.get<User[]>('/api/users');
            // data is typed as User[]

            const user = await http.post<User>('/api/users', {
                name    : 'John',
                email   : 'john@example.com'
            });
            // user.data is typed as User
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ##### Advanced Usage
            ```ts
            // Custom timeout per request
            await http.get('/api/slow', { timeout: 5000 });

            // Custom headers per request
            await http.get('/api/data', {
                headers: { 'X-Custom-Header': 'value' }
            });

            // Using the low-level api function
            const response = await api({
                method  : 'POST',
                url     : '/api/endpoint',
                data    : { key: 'value' },
                timeout : 15000
            });
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ##### Reset Configuration
            ```ts
            import { resetApiConfig } from '@je-es/capi';

            // Reset to defaults
            resetApiConfig();
            ```

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->



<!-- ╔══════════════════════════════ END ══════════════════════════════╗ -->

<br>

---

<div align="center">
    <a href="https://github.com/solution-lib/space"><img src="https://img.shields.io/badge/by-Space-black"/></a>
</div>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->