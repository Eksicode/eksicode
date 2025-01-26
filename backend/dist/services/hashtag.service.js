"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const HttpException_1 = require("../exceptions/HttpException");
class HashtagService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async getAllHashtags(skip, limit) {
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
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error fetching hashtags");
        }
    }
    async getHashtagById(id) {
        try {
            const hashTag = await this.prisma.hashTag.findUnique({
                where: { id },
            });
            if (!hashTag) {
                throw new HttpException_1.HttpException(404, "Hashtag not found");
            }
            return hashTag;
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error fetching hashtag");
        }
    }
    async createHashtag(data) {
        try {
            const hashTagName = await this.prisma.hashTag.findUnique({
                where: { name: data.name },
            });
            if (hashTagName) {
                throw new HttpException_1.HttpException(409, "Hashtag already exists");
            }
            const hashTag = await this.prisma.hashTag.create({
                data: {
                    name: data.name,
                },
            });
            return hashTag;
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, `Error creating hashtag: ${error.message}`);
        }
    }
    async updateHashtag(id, data) {
        try {
            const hashTag = await this.prisma.hashTag.update({
                where: { id },
                data: {
                    name: data.name,
                },
            });
            return hashTag;
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error updating hashtag");
        }
    }
    async deleteHashtag(id) {
        try {
            const hashTag = await this.prisma.hashTag.delete({
                where: { id },
            });
            return hashTag;
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error deleting hashtag");
        }
    }
}
exports.default = HashtagService;
//# sourceMappingURL=hashtag.service.js.map