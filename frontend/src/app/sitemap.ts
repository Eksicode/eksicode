import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://eksicode.org";
const origin = baseUrl.replace(/\/$/, "");
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/** Static routes to include in the sitemap */
const staticRoutes: MetadataRoute.Sitemap = [
  { url: origin, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  { url: `${origin}/posts`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  { url: `${origin}/etiketler`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${origin}/arama`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${origin}/kariyer`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${origin}/kaynaklar`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${origin}/kunye`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${origin}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${origin}/telegram-gruplari`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
];

async function fetchPostSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  if (!apiUrl) return [];
  try {
    const res = await fetch(
      `${apiUrl}/posts?summaryOnly=true&limit=5000&status=PUBLISHED&approved=true`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: { slug: string; updatedAt?: string }[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function fetchPageSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  if (!apiUrl) return [];
  try {
    const res = await fetch(
      `${apiUrl}/pages?summaryOnly=true&limit=500`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: { slug: string; updatedAt?: string }[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, pageSlugs] = await Promise.all([
    fetchPostSlugs(),
    fetchPageSlugs(),
  ]);

  const postEntries: MetadataRoute.Sitemap = postSlugs.map((p) => ({
    url: `${origin}/posts/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const pageEntries: MetadataRoute.Sitemap = pageSlugs.map((p) => ({
    url: `${origin}/sayfalar/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...postEntries, ...pageEntries];
}
