import { getSession } from "next-auth/react";
import { getErrorFromStatus, normalizeError, getUserFacingMessage } from "./errors";

interface Data {
  [key: string]: unknown;
}

export interface UpdateDataResult {
  data: Data | null;
  error?: string;
  userMessage?: string;
}

async function updateData(
  endPoint: string,
  id: number,
  updatedData: Data
): Promise<UpdateDataResult> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const session = await getSession();

    if (!session) {
      const err = normalizeError(new Error("Session not found."));
      return { data: null, error: err.message, userMessage: err.userMessage };
    }

    if (!apiUrl) {
      const err = normalizeError(new Error("API URL is not defined in the environment variables."));
      return { data: null, error: err.message, userMessage: err.userMessage };
    }

    const response = await fetch(`${apiUrl}/${endPoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const bodyMessage = errorData?.message ?? errorData?.errors?.[0]?.message;
      const appError = getErrorFromStatus(response.status, bodyMessage);
      if (process.env.NODE_ENV === "development") {
        console.warn(`[updateData] ${endPoint}/${id}: ${response.status}`, appError.userMessage);
      }
      return {
        data: null,
        error: appError.message,
        userMessage: appError.userMessage,
      };
    }

    const data = (await response.json()) as Data;
    return { data };
  } catch (error) {
    const userMessage = getUserFacingMessage(error);
    if (process.env.NODE_ENV === "development") {
      console.error("[updateData] Error updating data:", error);
    }
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
      userMessage,
    };
  }
}

export default updateData;
