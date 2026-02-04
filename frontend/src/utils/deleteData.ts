import { getSession } from "next-auth/react";
import { getErrorFromStatus, normalizeError, getUserFacingMessage } from "./errors";

interface DeleteResponse {
  success: boolean;
  message?: string;
  userMessage?: string;
  error?: string;
}

async function deleteData(
  endPoint: string,
  id: number,
  options: {
    cache?: RequestCache;
    next?: { revalidate: number };
  } = { cache: "no-store" }
): Promise<DeleteResponse> {
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

    const response = await fetch(`${apiUrl}/${endPoint}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: options.cache,
      next: options.next,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const bodyMessage = errorData?.message ?? errorData?.errors?.[0]?.message;
      const appError = getErrorFromStatus(response.status, bodyMessage);
      if (process.env.NODE_ENV === "development") {
        console.warn(`[deleteData] ${endPoint}/${id}: ${response.status}`, appError.userMessage);
      }
      return {
        success: false,
        message: appError.message,
        userMessage: appError.userMessage,
        error: appError.message,
      };
    }

    return { success: true, message: "Veri başarıyla silindi." };
  } catch (error) {
    const userMessage = getUserFacingMessage(error);
    if (process.env.NODE_ENV === "development") {
      console.error("[deleteData] Error deleting data:", error);
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "Veri silinirken hata oluştu.",
      userMessage,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export default deleteData;
