import { HashTag } from "@prisma/client";
declare class HashtagService {
    private prisma;
    getAllHashtags(skip?: number, limit?: number): Promise<{
        hashTags: {
            name: string;
            id: number;
        }[];
        count: number;
    }>;
    getHashtagById(id: number): Promise<HashTag | null>;
    createHashtag(data: {
        name: string;
    }): Promise<HashTag>;
    updateHashtag(id: number, data: {
        name: string;
    }): Promise<HashTag>;
    deleteHashtag(id: number): Promise<HashTag>;
}
export default HashtagService;
