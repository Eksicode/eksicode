interface BaseResponse<T, M> {
  data: T[];
  meta: M;
  message: string;
}

async function getData<T = any, M = any>(
  endPoint: string,
  summaryOnly?: boolean,
  limit?: number,
  pageSize?: number,
  page?: number,
  options: {
    cache?: RequestCache;
    next?: { revalidate: number };
  } = { cache: "no-store" }
): Promise<BaseResponse<T, M>> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API URL is not defined in the environment variables.");
    }

    const queryParams = new URLSearchParams({
      summaryOnly: String(summaryOnly),
      ...(limit !== undefined && { limit: String(limit) }),
      ...(page !== undefined && { page: String(page) }),
      ...(pageSize !== undefined && { pageSize: String(pageSize) }),
    });

    console.log("queryParams", queryParams);

    const response = await fetch(
      `${apiUrl}/${endPoint}?${queryParams.toString()}`,
      {
        cache: options.cache,
        next: options.next,
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
      return { data: [], meta: {} as M, message: "" };
    }

    const jsonResponse = await response.json() as BaseResponse<T, M>;
    return jsonResponse;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], meta: {} as M, message: "" };
  }
}

export default getData;