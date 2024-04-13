interface Pages {
  title: string;
  content: string;
  header_image: string;
  slug: string;
  page_category: string;
}

async function getPages(count: string, cache: string | number = "no-store"): Promise<Pages[]> {
  const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages?count=${count}`, { cache: cache as RequestCache });
  if (res.ok) {
    const data: { data: Pages[] } = await res.json();
    console.log(data);
    return data.data;
  } else {
    console.error("Failed to fetch data");
    return [];
  }
}

export default getPages;
