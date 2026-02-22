import { IPost } from "@/types/types";

interface CreatePostData {
    title: string;
    content: string;
    categoryId: number;
    tags?: string[];
    headerImage?: File; // Keep for backwards compatibility if needed
    headerImageId?: number;
}

interface UpdatePostData {
    title?: string;
    content?: string;
    categories?: number[];
    tags?: number[];
    status?: string;
    headerImageId?: number;
}

interface GetPostsParams {
    page?: number;
    limit?: number;
    authorId?: string; // or username depending on backend
    categorySlug?: string;
    tag?: string;
}

interface PostServiceResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    meta?: any;
}

class PostService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    }

    async createPost(formData: CreatePostData, token: string): Promise<PostServiceResponse<IPost>> {
        try {
            const payload: any = {
                title: formData.title,
                content: formData.content,
                categories: [formData.categoryId],
                tags: formData.tags || [],
            };

            if (formData.headerImageId) {
                payload.headerImageId = formData.headerImageId;
            }

            const response = await fetch(`${this.baseUrl}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.message || "Gönderi oluşturulurken bir hata oluştu",
                };
            }

            // Note: Second request for image upload was removed in favor of using Media Service directly

            return {
                success: true,
                message: "Gönderi başarıyla oluşturuldu",
                data: result.data,
            };
        } catch (error) {
            console.error("Create post error:", error);
            return {
                success: false,
                message: "Sunucu hatası oluştu",
            };
        }
    }

    /**
     * Fetches posts for the given author (current user's posts when passing user.id).
     * Backend filters by authorId.
     */
    async getUserPosts(authorId: number, page: number = 1, limit: number = 10): Promise<PostServiceResponse<IPost[]>> {
        try {
            const skip = (page - 1) * limit;
            const queryParams = new URLSearchParams({
                skip: skip.toString(),
                limit: limit.toString(),
                authorId: authorId.toString()
            });

            const fetchResponse = await fetch(`${this.baseUrl}/posts?${queryParams.toString()}`, {
                cache: 'no-store'
            });

            if (!fetchResponse.ok) {
                return {
                    success: false,
                    message: "Gönderiler alınamadı"
                };
            }

            const result = await fetchResponse.json();

            return {
                success: true,
                data: result.data,
                meta: result.meta,
                message: result.message
            };

        } catch (error) {
            console.error("Get user posts error:", error);
            return {
                success: false,
                message: "Gönderiler alınırken bir hata oluştu"
            };
        }
    }

    async getPostBySlug(slug: string): Promise<PostServiceResponse<IPost>> {
        try {
            const response = await fetch(`${this.baseUrl}/posts/${slug}`, {
                cache: 'no-store'
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.message || "Gönderi bulunamadı",
                };
            }

            return {
                success: true,
                data: result.data,
            };
        } catch (error) {
            console.error("Get post by slug error:", error);
            return {
                success: false,
                message: "Sunucu hatası oluştu",
            };
        }
    }

    async updatePost(id: number, data: UpdatePostData, token: string): Promise<PostServiceResponse<IPost>> {
        try {
            const response = await fetch(`${this.baseUrl}/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.message || "Gönderi güncellenirken bir hata oluştu",
                };
            }

            return {
                success: true,
                message: "Gönderi başarıyla güncellendi",
                data: result.data,
            };
        } catch (error) {
            console.error("Update post error:", error);
            return {
                success: false,
                message: "Sunucu hatası oluştu",
            };
        }
    }

    async getCategories() {
        try {
            const response = await fetch(`${this.baseUrl}/categories`, { cache: 'no-cache' });
            if (!response.ok) return [];
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error("Get categories error:", error);
            return [];
        }
    }
}

const postService = new PostService();
export default postService;
