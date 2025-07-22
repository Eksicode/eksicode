interface ApiConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  async request<T>(endpoint: string, config: ApiConfig = {}, token?: string): Promise<T> {
    const { method = "GET", headers = {}, body } = config;

    const requestConfig: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    if (body && method !== "GET") {
      if (body instanceof FormData) {
        // Remove Content-Type for FormData to let browser set it with boundary
        const newHeaders = { ...headers };
        if (token) newHeaders.Authorization = `Bearer ${token}`;
        requestConfig.headers = newHeaders;
        requestConfig.body = body;
      } else {
        requestConfig.body = JSON.stringify(body);
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, requestConfig);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Convenience methods
  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, token);
  }

  async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body: data }, token);
  }

  async put<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body: data }, token);
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" }, token);
  }
}

const apiClient = new ApiClient();
export default apiClient;
