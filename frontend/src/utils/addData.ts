import { getSession } from "next-auth/react";
import { getErrorFromStatus, normalizeError, getUserFacingMessage } from "./errors";

interface AddResponse {
  success: boolean;
  message?: string;
  userMessage?: string;
  error?: string;
}

interface Data {
  [key: string]: unknown;
}

async function addData(
  endPoint: string,
  data: Data,
  options: {
    cache?: RequestCache;
    next?: { revalidate: number };
  } = { cache: "no-store" }
): Promise<AddResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const session = await getSession();

    if (!session) {
      const err = normalizeError(new Error("Session not found."));
      return { success: false, message: err.message, userMessage: err.userMessage, error: err.message };
    }

    if (!apiUrl) {
      const err = normalizeError(new Error("API URL is not defined in the environment variables."));
      return { success: false, message: err.message, userMessage: err.userMessage, error: err.message };
    }

    const response = await fetch(`${apiUrl}/${endPoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
      cache: options.cache,
      next: options.next,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const bodyMessage = errorData?.message ?? errorData?.errors?.[0]?.message;
      const appError = getErrorFromStatus(response.status, bodyMessage);
      if (process.env.NODE_ENV === "development") {
        console.warn(`[addData] ${endPoint}: ${response.status}`, appError.userMessage);
      }
      return {
        success: false,
        message: appError.message,
        userMessage: appError.userMessage,
        error: appError.message,
      };
    }

    const result = await response.json().catch(() => ({}));
    return {
      success: true,
      message: result?.message ?? "Veri başarıyla eklendi.",
    };
  } catch (error) {
    const userMessage = getUserFacingMessage(error);
    if (process.env.NODE_ENV === "development") {
      console.error("[addData] Error adding data:", error);
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "Veri eklenirken hata oluştu.",
      userMessage,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export default addData;
