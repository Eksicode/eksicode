import { PrismaClient, Source } from "@prisma/client";
import { prisma } from "../config/database";
import { HttpException } from "../exceptions/HttpException";

class SourceService {
    private prisma = prisma;

    public async getAllSources(skip?: number, limit?: number, approved?: boolean, all?: boolean) {
        try {
            const whereClause = all ? {} : (approved === undefined ? { approved: true } : { approved });
            const count = await this.prisma.source.count({ where: whereClause });
            const sources = await this.prisma.source.findMany({
                where: whereClause,
                skip: skip || 0,
                take: limit || undefined,
                include: {
                    tags: true
                },
                orderBy: {
                    title: 'desc',
                },
            });
            return { sources, count };
        } catch (error) {
            throw new HttpException(500, "Error fetching sources");
        };
    };

    public async getSourceById(id: number): Promise<Source | null> {
        try {
            const source = await this.prisma.source.findUnique({
                where: { id },
                include: {
                    tags: true
                },
            });
            return source;
        } catch (error) {
            throw new HttpException(500, "Error fetching source");
        }
    };

    public async searchSources(searchTerm: string, skip?: number, limit?: number, approved?: boolean) {
        try {
            const approvedFilter = approved === undefined ? { approved: true } : { approved };
            const whereClause = {
                ...approvedFilter,
                OR: [
                    {
                        title: {
                            contains: searchTerm,
                            mode: 'insensitive' as const,
                        }
                    },
                    {
                        description: {
                            contains: searchTerm,
                            mode: 'insensitive' as const,
                        }
                    }
                ]
            };
            const count = await this.prisma.source.count({ where: whereClause });
            const sources = await this.prisma.source.findMany({
                where: whereClause,
                skip: skip || 0,
                take: limit || undefined,
                include: {
                    tags: true
                },
                orderBy: {
                    title: 'desc',
                },
            });
            return { sources, count };
        } catch (error) {
            throw new HttpException(500, "Error searching sources");
        }
    }

    public async createSource(data: {
        title: string,
        description?: string,
        url: string,
        hashtags?: string[],
        thChannel?: string,
        tgUser?: string,
        active?: boolean,
        approved?: boolean,
    }) {
        try {
            const sourceTitle = await this.prisma.source.findUnique({
                where: { title: data.title },
            });
            if (sourceTitle) {
                throw new HttpException(409, "Source already exists");
            };
            const source = await this.prisma.source.create({
                data: {
                    title: data.title,
                    description: data.description,
                    url: data.url,
                    tgChannel: data.thChannel,
                    tgUser: data.tgUser,
                    active: data.active ?? true,
                    approved: data.approved ?? false,
                    tags: data.hashtags
                        ? { connect: data.hashtags.map((name => ({ name }))) }
                        : undefined
                },
                include: {
                    tags: true
                }
            });
            return source;
        } catch (error) {
            throw new HttpException(500, "Error creating source");
        }
    };

    public async updateSource(id: number, data: {
        title?: string,
        description?: string,
        url?: string,
        hastags?: string[],
        thChannel?: string,
        tgUser?: string,
        active?: boolean,
        approved?: boolean,
    }) {
        try {
            const source = await this.prisma.source.update({
                where: { id },
                data: {
                    ...(data.title !== undefined && { title: data.title }),
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.url !== undefined && { url: data.url }),
                    ...(data.thChannel !== undefined && { tgChannel: data.thChannel }),
                    ...(data.tgUser !== undefined && { tgUser: data.tgUser }),
                    ...(data.active !== undefined && { active: data.active }),
                    ...(data.approved !== undefined && { approved: data.approved }),
                    ...(data.hastags && { tags: { set: [], connect: data.hastags.map((name => ({ name }))) } }),
                },
                include: {
                    tags: true
                }
            });
            return source;
        } catch (error) {
            throw new HttpException(500, "Error updating source");
        }
    };

    public async deleteSource(id: number): Promise<Source> {
        try {
            const source = await this.prisma.source.delete({
                where: { id },
            });
            return source;
        } catch (error) {
            throw new HttpException(500, "Error deleting source");
        }
    };
}

export default SourceService;