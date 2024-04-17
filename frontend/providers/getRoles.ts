interface Roles{
    name: string;
    description: string;
}

async function getRoles(count: string, cache: string | number = "no-store"): Promise<Roles[]> {
    const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`,
        { cache: cache as RequestCache }
    );  if (res.ok) {
      const data: { data: Roles[] } = await res.json();
      return data.data;
    } else {
      console.error("Failed to fetch data");
      return [];
    }
  }
  
  export default getRoles;
  