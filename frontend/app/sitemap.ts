import getData from "@providers/getData";

export default async function sitemap() {
  const baseUrl = "https://eksicode.org";

  // get all posts
  const fetchedPosts = await getData("total", false);
  const postsUrls = fetchedPosts.data.map((post: any) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...postsUrls,
  ];
}
