import { PrismaClient, Tag } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";

class HashtagService {
    private prisma = new PrismaClient();

    public async getAllHashtags(skip?: number, limit?: number) {
        try {
            const count = await this.prisma.tag.count();
            const hashTags = await this.prisma.tag.findMany({
                skip: skip || 0,
                take: limit || undefined,
                orderBy: {
                    name: 'desc',
                },
                include: {
                    _count: {
                        select: {
                            posts: true
                        }
                    }
                }
            });

            // Transform to include postCount
            const transformedHashTags = hashTags.map(tag => ({
                id: tag.id,
                name: tag.name,
                postCount: tag._count.posts
            }));

            return { hashTags: transformedHashTags, count };
        } catch (error) {
            throw new HttpException(500, "Error fetching hashtags");
        }
    }

    public async getHashtagById(id: number): Promise<any> {
        try {
            const hashTag = await this.prisma.tag.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            posts: true
                        }
                    }
                }
            });

            if (!hashTag) {
                throw new HttpException(404, "Hashtag not found");
            }

            // Transform to include postCount
            return {
                id: hashTag.id,
                name: hashTag.name,
                postCount: hashTag._count.posts
            };
        } catch (error) {
            throw new HttpException(500, "Error fetching hashtag");
        }
    }

    public async createHashtag(data: { name: string }): Promise<Tag> {
        try {

            const hashTagName = await this.prisma.tag.findUnique({
                where: { name: data.name },
            });

            if (hashTagName) {
                throw new HttpException(409, "Hashtag already exists");
            }
            
            const hashTag = await this.prisma.tag.create({
                data: {
                    name: data.name,
                },
            });

            return hashTag;
        } catch (error) {
            throw new HttpException(500, `Error creating hashtag: ${error.message}`);
        }
    }

    public async updateHashtag(id: number, data: { name: string }): Promise<Tag> {
        try {
            const hashTag = await this.prisma.tag.update({
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

    public async deleteHashtag(id: number): Promise<Tag> {
        try {
            const hashTag = await this.prisma.tag.delete({
                where: { id },
            });

            return hashTag;
        } catch (error) {
            throw new HttpException(500, "Error deleting hashtag");
        }
    }
}

export default HashtagService;