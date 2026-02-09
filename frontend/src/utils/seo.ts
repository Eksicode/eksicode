/**
 * Strip HTML tags and truncate to a max length for meta descriptions.
 * Keeps plain text only for SEO (search snippets, OG, Twitter).
 */
export function plainTextExcerpt(html: string | null | undefined, maxLength = 160): string {
  if (!html || typeof html !== "string") return "";
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= maxLength) return plain;
  const truncated = plain.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > maxLength / 2 ? truncated.slice(0, lastSpace) : truncated) + "...";
}
