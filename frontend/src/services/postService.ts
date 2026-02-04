import { IPost } from "@/types/types";

interface CreatePostData {
    title: string;
    content: string;
    categoryId: number;
    tags?: string[];
    headerImage?: File;
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
            const data = new FormData();
            data.append("title", formData.title);
            data.append("content", formData.content);
            data.append("categoryId", formData.categoryId.toString());

            if (formData.tags && formData.tags.length > 0) {
                // Assuming backend expects tags as a JSON string or individual fields
                // Adjust based on actual backend requirement. Usually for FormData multiple values:
                // formData.tags.forEach(tag => data.append("tags[]", tag));
                // Or if backend expects comma separated:
                data.append("tags", formData.tags.join(","));
            }

            if (formData.headerImage) {
                data.append("headerImage", formData.headerImage);
            }

            const response = await fetch(`${this.baseUrl}/posts`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Content-Type header is not set manually for FormData, browser sets it with boundary
                },
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.message || "Gönderi oluşturulurken bir hata oluştu",
                };
            }

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

    async getCategories() {
        try {
            const response = await fetch(`${this.baseUrl}/categories`, { cache: 'force-cache' });
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
