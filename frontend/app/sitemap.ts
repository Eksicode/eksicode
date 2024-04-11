import getPosts from "@providers/getPosts";

export default async function sitemap() {
  const baseUrl = "https://eksicode.org";

  // get all posts
  const fetchedPosts = await getPosts("total");
  const postsUrls = fetchedPosts.map((post: any) => ({
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
