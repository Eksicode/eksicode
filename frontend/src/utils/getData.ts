interface Data {
  [key: string]: any;
}
interface Meta {
  [key: string]: any;
}
async function getData(
  endPoint: string,
  summaryOnly?: boolean,
  limit?: number,
  pageSize?: number,
  page?: number,
  options: {
    cache?: RequestCache; // no-store, no-cache, must-revalidate, proxy-revalidate
    next?: { revalidate: number };
  } = { cache: "no-store" }
  // } = { cache: 'no-store', next: { revalidate: 0 } }
  // cache: RequestCache = "no-store",
): Promise<{ data: Data[]; meta: Meta[] }> {
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
      return { data: [], meta: [] };
    }

    const jsonResponse = (await response.json()) as {
      data: Data[];
      meta: Meta[];
    };
    return jsonResponse;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], meta: [] };
  }
}

export default getData;
