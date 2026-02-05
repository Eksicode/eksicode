import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://eksicode.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/profile/",
          "/confirm-email/",
          "/posts/create",
        ],
      },
    ],
    sitemap: `${baseUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
