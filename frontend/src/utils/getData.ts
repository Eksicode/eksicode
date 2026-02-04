import { getErrorFromStatus, normalizeError, getUserFacingMessage } from "./errors";

interface BaseResponse<T, M> {
  data: T[];
  meta: M;
  message: string;
}

export interface GetDataResult<T, M> {
  data: T[];
  meta: M;
  message: string;
  error?: string;
  userMessage?: string;
}

async function getData<T = unknown, M = unknown>(
  endPoint: string,
  summaryOnly?: boolean,
  limit?: number,
  page?: number,
  skip?: number,
  options: {
    cache?: RequestCache;
    next?: { revalidate: number };
  } = { cache: "no-store" }
): Promise<GetDataResult<T, M>> {
  const empty = { data: [], meta: {} as M, message: "" };

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      const err = normalizeError(new Error("API URL is not defined in the environment variables."));
      return { ...empty, error: err.message, userMessage: err.userMessage };
    }

    const queryParams = new URLSearchParams(
      Object.fromEntries(
        [
          summaryOnly !== undefined && ["summaryOnly", String(summaryOnly)],
          limit !== undefined && ["limit", String(limit)],
          page !== undefined && ["page", String(page)],
          skip !== undefined && ["skip", String(skip)],
        ].filter((entry): entry is [string, string] => Boolean(entry))
      )
    );

    const response = await fetch(`${apiUrl}/${endPoint}?${queryParams.toString()}`, {
      cache: options.cache,
      next: options.next,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const bodyMessage = errorData?.message ?? errorData?.errors?.[0]?.message;
      const appError = getErrorFromStatus(response.status, bodyMessage);
      if (process.env.NODE_ENV === "development") {
        console.warn(`[getData] ${endPoint}: ${response.status}`, appError.userMessage);
      }
      return {
        ...empty,
        error: appError.message,
        userMessage: appError.userMessage,
      };
    }

    const jsonResponse = (await response.json()) as BaseResponse<T, M>;
    return jsonResponse;
  } catch (error) {
    const userMessage = getUserFacingMessage(error);
    if (process.env.NODE_ENV === "development") {
      console.error("[getData] Error fetching data:", error);
    }
    return {
      ...empty,
      error: error instanceof Error ? error.message : String(error),
      userMessage,
    };
  }
}

export default getData;
