"use server";

import { IPost } from "@/types/types";

export async function searchPosts(term: string): Promise<IPost[]> {
  if (!term.trim()) return [];
  const query = encodeURIComponent(term.toLowerCase());
  try {
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/search/${query}`
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return response.json();

  } catch (error) {
    console.error("Error searching posts:", error);
    throw new Error("Failed to search posts");
  }
}
