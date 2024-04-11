interface Posts {
  title: string;
  post: string;
  image: File;
  slug: string;
  tags: string[];
  category_id: string;
  user_id: string;
  status: boolean;
}

async function getPosts(count: string, cache: string | number = "no-store"): Promise<Posts[]> {
  const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?count=${count}`,
      { cache: cache as RequestCache }
  );  if (res.ok) {
    const data: { data: Posts[] } = await res.json();
    return data.data;
  } else {
    console.error("Failed to fetch data");
    return [];
  }
}

export default getPosts;
