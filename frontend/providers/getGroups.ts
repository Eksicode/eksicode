interface Group {
  id: number;
  name: string;
  logo: string;
  link: string;
}

async function getGroups(count?: string | number, page?: number, cache: string | number = "no-store"): Promise<Group[]> {
  const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups?count=${count}&page=${page}`,
      { cache: cache as RequestCache }
  );
  if (res.ok) {
    const data: { data: Group[] } = await res.json();
    const dataResults = data.data;
    return dataResults;
  } else {
    console.error("Failed to fetch data");
    return [];
  }
}

export default getGroups;
