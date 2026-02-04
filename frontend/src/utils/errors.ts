/**
 * Centralized error handling and user-facing messages.
 * Use these for consistent, definitive error and warning messages across the app.
 */

export type ErrorCode =
  | "NETWORK_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "SESSION_EXPIRED"
  | "API_URL_MISSING"
  | "UNKNOWN";

export type WarningCode =
  | "RETRYING"
  | "OFFLINE"
  | "SLOW_RESPONSE"
  | "PARTIAL_DATA"
  | "CACHE_READ_FAILED";

export interface AppError {
  code: ErrorCode;
  message: string;
  userMessage: string;
  status?: number;
  original?: unknown;
}

export interface AppWarning {
  code: WarningCode;
  message: string;
  userMessage: string;
}

/** User-facing messages (Turkish) for each error code */
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  NETWORK_ERROR:
    "Bağlantı hatası. İnternet bağlantınızı kontrol edip tekrar deneyin.",
  UNAUTHORIZED:
    "Oturum açmanız gerekiyor. Lütfen giriş yapıp tekrar deneyin.",
  FORBIDDEN:
    "Bu işlem için yetkiniz bulunmuyor.",
  NOT_FOUND:
    "İstenen kaynak bulunamadı.",
  VALIDATION_ERROR:
    "Girilen bilgiler geçersiz. Lütfen kontrol edip tekrar deneyin.",
  SERVER_ERROR:
    "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.",
  SESSION_EXPIRED:
    "Oturumunuz sona erdi. Lütfen tekrar giriş yapın.",
  API_URL_MISSING:
    "Uygulama yapılandırma hatası. Lütfen daha sonra tekrar deneyin.",
  UNKNOWN:
    "Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.",
};

/** User-facing messages (Turkish) for warnings */
const WARNING_MESSAGES: Record<WarningCode, string> = {
  RETRYING: "Bağlantı kuruluyor, yeniden deneniyor…",
  OFFLINE: "İnternet bağlantısı yok. Çevrimdışı olabilirsiniz.",
  SLOW_RESPONSE: "Yanıt gecikiyor. Lütfen bekleyin.",
  PARTIAL_DATA: "Bazı veriler yüklenemedi.",
  CACHE_READ_FAILED: "Önbellek okunamadı. Ayarlar varsayılana dönebilir.",
};

/**
 * Map HTTP status to ErrorCode and get a definitive user message.
 */
export function getErrorFromStatus(status: number, bodyMessage?: string): AppError {
  let code: ErrorCode = "UNKNOWN";
  if (status === 401) code = "UNAUTHORIZED";
  else if (status === 403) code = "FORBIDDEN";
  else if (status === 404) code = "NOT_FOUND";
  else if (status >= 400 && status < 500) code = "VALIDATION_ERROR";
  else if (status >= 500) code = "SERVER_ERROR";

  const userMessage =
    bodyMessage && bodyMessage.trim().length > 0
      ? sanitizeApiMessage(bodyMessage)
      : ERROR_MESSAGES[code];

  return {
    code,
    message: bodyMessage || `HTTP ${status}`,
    userMessage,
    status,
  };
}

/**
 * Create AppError from a generic caught value (Error, string, unknown).
 */
export function normalizeError(err: unknown): AppError {
  if (isAppError(err)) return err;

  const message = err instanceof Error ? err.message : String(err ?? "Unknown error");
  const lower = message.toLowerCase();

  if (
    lower.includes("network") ||
    lower.includes("fetch") ||
    lower.includes("connection") ||
    lower.includes("failed to fetch")
  ) {
    return {
      code: "NETWORK_ERROR",
      message,
      userMessage: ERROR_MESSAGES.NETWORK_ERROR,
      original: err,
    };
  }
  if (lower.includes("session") || lower.includes("token") || lower.includes("unauthorized")) {
    return {
      code: "UNAUTHORIZED",
      message,
      userMessage: ERROR_MESSAGES.UNAUTHORIZED,
      original: err,
    };
  }
  if (lower.includes("api url") || lower.includes("not defined")) {
    return {
      code: "API_URL_MISSING",
      message,
      userMessage: ERROR_MESSAGES.API_URL_MISSING,
      original: err,
    };
  }

  return {
    code: "UNKNOWN",
    message,
    userMessage: ERROR_MESSAGES.UNKNOWN,
    original: err,
  };
}

/**
 * Get a single user-facing message for display (toast, inline, error page).
 */
export function getUserFacingMessage(err: unknown): string {
  if (isAppError(err)) return err.userMessage;
  return normalizeError(err).userMessage;
}

/**
 * Get warning user message by code.
 */
export function getWarningMessage(code: WarningCode): string {
  return WARNING_MESSAGES[code];
}

export function isAppError(value: unknown): value is AppError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "userMessage" in value &&
    typeof (value as AppError).userMessage === "string"
  );
}

/** Whether the error is typically retryable (network, 5xx). */
export function isRetryableError(err: unknown): boolean {
  if (isAppError(err)) {
    return err.code === "NETWORK_ERROR" || err.code === "SERVER_ERROR";
  }
  const message = err instanceof Error ? err.message : String(err ?? "");
  const lower = message.toLowerCase();
  return (
    lower.includes("network") ||
    lower.includes("fetch") ||
    lower.includes("500") ||
    lower.includes("502") ||
    lower.includes("503")
  );
}

/** Sanitize API error message for display (avoid exposing internals). */
function sanitizeApiMessage(msg: string): string {
  const trimmed = msg.trim();
  if (trimmed.length > 200) return trimmed.slice(0, 197) + "...";
  return trimmed;
}

/** Create an AppWarning for UI. */
export function createWarning(code: WarningCode, technicalMessage?: string): AppWarning {
  return {
    code,
    message: technicalMessage ?? code,
    userMessage: WARNING_MESSAGES[code],
  };
}
