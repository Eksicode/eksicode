// Use import.meta.env for client-side, will be replaced at build time
// Backend works directly on root path, no /api prefix
const API_URL =
	import.meta.env.PUBLIC_API_URL || 'http://localhost:9000';

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	message?: string;
	errors?: string[];
}

class ApiClient {
	private baseUrl: string;

	constructor() {
		this.baseUrl = API_URL;
	}

	async request<T>(
		endpoint: string,
		config: RequestInit = {},
		token?: string
	): Promise<ApiResponse<T>> {
		const { method = 'GET', headers = {}, body } = config;

		const requestHeaders: HeadersInit = {
			'Content-Type': 'application/json',
			...headers,
			...(token && { Authorization: `Bearer ${token}` })
		};

		// Remove Content-Type for FormData
		if (body instanceof FormData) {
			delete (requestHeaders as any)['Content-Type'];
			if (token) {
				(requestHeaders as any).Authorization = `Bearer ${token}`;
			}
		}

		const requestConfig: RequestInit = {
			method,
			headers: requestHeaders,
			...(body && { body: body instanceof FormData ? body : JSON.stringify(body) })
		};

		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, requestConfig);

			if (!response.ok) {
				let errorData: any = {};
				const contentType = response.headers.get('content-type');
				
				if (contentType && contentType.includes('application/json')) {
					try {
						errorData = await response.json();
					} catch {
						// If JSON parsing fails, use default error
					}
				}

				const errorMessage = errorData.message || 
					errorData.error || 
					`HTTP error! status: ${response.status}`;

				return {
					success: false,
					message: errorMessage,
					errors: errorData.errors || errorData.error ? [errorData.error] : [errorMessage]
				};
			}

			const contentType = response.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				const data = await response.json();
				return {
					success: true,
					data,
					message: data.message
				};
			}

			// Handle non-JSON responses
			const text = await response.text();
			return {
				success: true,
				data: text as any,
				message: 'Success'
			};
		} catch (error: any) {
			const errorMessage = error.message || 'Network error occurred';
			return {
				success: false,
				message: errorMessage,
				errors: [errorMessage]
			};
		}
	}

	async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { method: 'GET' }, token);
	}

	async post<T>(endpoint: string, data: any, token?: string): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { method: 'POST', body: data }, token);
	}

	async put<T>(endpoint: string, data: any, token?: string): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { method: 'PUT', body: data }, token);
	}

	async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { method: 'DELETE' }, token);
	}
}

export const apiClient = new ApiClient();
