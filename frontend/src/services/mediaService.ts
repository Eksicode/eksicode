interface MediaUploadResponse {
    success: boolean;
    message?: string;
    data?: {
        url: string;
        filename: string;
        id: number;
        [key: string]: any;
    };
}

class MediaService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    }

    async uploadMedia(file: File, token: string): Promise<MediaUploadResponse> {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${this.baseUrl}/media/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.message || "Görsel yüklenirken bir hata oluştu",
                };
            }

            return {
                success: true,
                message: "Görsel başarıyla yüklendi",
                data: result.data,
            };
        } catch (error) {
            console.error("Upload media error:", error);
            return {
                success: false,
                message: "Sunucu hatası oluştu",
            };
        }
    }
}

const mediaService = new MediaService();
export default mediaService;
