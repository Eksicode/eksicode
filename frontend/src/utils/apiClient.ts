import { getErrorFromStatus, normalizeError, type AppError } from "./errors";

interface ApiConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
}

/** Thrown by apiClient on non-ok responses. Has userMessage for display. */
export class ApiRequestError extends Error {
  readonly appError: AppError;

  constructor(appError: AppError) {
    super(appError.message);
    this.name = "ApiRequestError";
    this.appError = appError;
    Object.setPrototypeOf(this, ApiRequestError.prototype);
  }

  get userMessage(): string {
    return this.appError.userMessage;
  }

  get status(): number | undefined {
    return this.appError.status;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  async request<T>(endpoint: string, config: ApiConfig = {}, token?: string): Promise<T> {
    const { method = "GET", headers = {}, body } = config;

    if (!this.baseUrl) {
      const err = normalizeError(new Error("API URL is not defined in the environment variables."));
      throw new ApiRequestError(err);
    }

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
        const newHeaders = { ...headers };
        if (token) newHeaders.Authorization = `Bearer ${token}`;
        requestConfig.headers = newHeaders;
        requestConfig.body = body;
      } else {
        requestConfig.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, requestConfig);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const bodyMessage =
          typeof errorData?.message === "string"
            ? errorData.message
            : Array.isArray(errorData?.errors)
              ? errorData.errors[0]?.message
              : undefined;
        const appError = getErrorFromStatus(response.status, bodyMessage);
        throw new ApiRequestError(appError);
      }

      return response.json();
    } catch (err) {
      if (err instanceof ApiRequestError) throw err;
      const appError = normalizeError(err);
      throw new ApiRequestError(appError);
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, token);
  }

  async post<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body: data }, token);
  }

  async put<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body: data }, token);
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" }, token);
  }
}

const apiClient = new ApiClient();
export default apiClient;
