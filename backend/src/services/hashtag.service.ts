import { PrismaClient, HashTag } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";

class HashtagService {
    private prisma = new PrismaClient();

    public async getAllHashtags(skip?: number, limit?: number) {
        try {
            const count = await this.prisma.hashTag.count();
            const hashTags = await this.prisma.hashTag.findMany({
                skip: skip || 0,
                take: limit || undefined,
                orderBy: {
                    name: 'desc',
                },
            });

            return { hashTags, count };
        } catch (error) {
            throw new HttpException(500, "Error fetching hashtags");
        }
    }

    public async getHashtagById(id: number): Promise<HashTag | null> {
        try {
            const hashTag = await this.prisma.hashTag.findUnique({
                where: { id },
            });

            if (!hashTag) {
                throw new HttpException(404, "Hashtag not found");
            }

            return hashTag;
        } catch (error) {
            throw new HttpException(500, "Error fetching hashtag");
        }
    }

    public async createHashtag(data: { name: string }): Promise<HashTag> {
        try {

            const hashTagName = await this.prisma.hashTag.findUnique({
                where: { name: data.name },
            });

            if (hashTagName) {
                throw new HttpException(409, "Hashtag already exists");
            }
            
            const hashTag = await this.prisma.hashTag.create({
                data: {
                    name: data.name,
                },
            });

            return hashTag;
        } catch (error) {
            throw new HttpException(500, `Error creating hashtag: ${error.message}`);
        }
    }

    public async updateHashtag(id: number, data: { name: string }): Promise<HashTag> {
        try {
            const hashTag = await this.prisma.hashTag.update({
                where: { id },
                data: {
                    name: data.name,
                },
            });

            return hashTag;
        } catch (error) {
            throw new HttpException(500, "Error updating hashtag");
        }
    }

    public async deleteHashtag(id: number): Promise<HashTag> {
        try {
            const hashTag = await this.prisma.hashTag.delete({
                where: { id },
            });

            return hashTag;
        } catch (error) {
            throw new HttpException(500, "Error deleting hashtag");
        }
    }
}

export default HashtagService;