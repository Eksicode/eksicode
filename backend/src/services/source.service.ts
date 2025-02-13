import { PrismaClient, Source } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";

class SourceService {
    private prisma = new PrismaClient();

    public async getAllSources(skip?: number, limit?: number) {
        try {
            const count = await this.prisma.source.count();
            const sources = await this.prisma.source.findMany({
                skip: skip || 0,
                take: limit || undefined,
                include: {
                    hashtags: true
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
                    hashtags: true
                },
            });
            return source;
        } catch (error) {
            throw new HttpException(500, "Error fetching source");
        }
    };

    public async createSource(data: {
        title: string,
        description?: string,
        url: string,
        hashtags?: string[]
        thChannel?: string,
        tgUser?: string,
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
                    ...data,
                    hashtags: data.hashtags
                        ? { connect: data.hashtags.map((name => ({ name }))) }
                        : undefined
                },
                include: {
                    hashtags: true
                }
            });
            return source;
        } catch (error) {
            throw new HttpException(500, "Error creating source");
        }
    };

    public async updateSource(id: number, data: {
        title: string,
        description?: string,
        url: string,
        hastags?: string[]
        thChannel?: string,
        tgUser?: string,
    }) {
        try {
            const source = await this.prisma.source.update({
                where: { id },
                data: {
                    ...data,
                    hashtags: data.hastags
                        ? { set: [], connect: data.hastags.map((name => ({ name }))) }
                        : undefined
                },
                include: {
                    hashtags: true
                }
            });
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