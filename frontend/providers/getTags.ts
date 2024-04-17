interface Tags {
    name: string;
    icon: string;
    description: string;
  }
  
  async function getTags(count: string, cache: string | number = "no-store"): Promise<Tags[]> {
    const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags?count=${count}`, { cache: cache as RequestCache });
    if (res.ok) {
      const data: { data: Tags[] } = await res.json();
      console.log(data);
      return data.data;
    } else {
      console.error("Failed to fetch data");
      return [];
    }
  }
  
  export default getTags;
  