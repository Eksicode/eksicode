interface Menus{
    name: string;
    main: string;
    icon: string;
}

async function getMenus(count: string, cache: string | number = "no-store"): Promise<Menus[]> {
    const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus?count=${count}`,
        { cache: cache as RequestCache }
    );  if (res.ok) {
      const data: { data: Menus[] } = await res.json();
      return data.data;
    } else {
      console.error("Failed to fetch data");
      return [];
    }
  }
  
  export default getMenus;
  