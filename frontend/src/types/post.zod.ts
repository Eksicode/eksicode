import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Başlık gereklidir") // Title is required
    .max(100, "Başlık çok uzun") // Title is too long
    .min(5, "Başlık en az 5 karakter olmalıdır"), // Title must be at least 5 chars
  content: z
    .string()
    .min(1, "İçerik gereklidir") // Content is required
    .min(20, "İçerik en az 20 karakter olmalıdır"), // Content must be at least 20 chars
  categoryId: z.number({ required_error: "Kategori seçilmelidir" }).min(1, "Kategori seçilmelidir"),
  tags: z.string().optional(), // Comma separated tags or similar
  headerImage: z.any().optional(), // File object or URL
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
