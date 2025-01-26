"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const HttpException_1 = require("../exceptions/HttpException");
class MenuCategoryService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async getAllMenuCategories(skip, limit) {
        try {
            const count = await this.prisma.menuCategory.count();
            const categories = await this.prisma.menuCategory.findMany({
                skip: skip || 0,
                take: limit || undefined,
                include: {
                    menus: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return { categories, count };
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error fetching menu categories");
        }
    }
    async getMenuCategoryById(id) {
        try {
            const category = await this.prisma.menuCategory.findUnique({
                where: { id },
                include: {
                    menus: true,
                },
            });
            if (!category) {
                throw new HttpException_1.HttpException(404, "Menu category not found");
            }
            return category;
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error fetching menu category");
        }
    }
    async createMenuCategory(data) {
        try {
            const category = await this.prisma.menuCategory.create({
                data: {
                    name: data.name,
                },
            });
            return category;
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error creating menu category");
        }
    }
    async updateMenuCategory(id, data) {
        try {
            const category = await this.prisma.menuCategory.update({
                where: { id },
                data: {
                    name: data.name,
                },
            });
            return category;
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error updating menu category");
        }
    }
    async deleteMenuCategory(id) {
        try {
            const category = await this.prisma.menuCategory.delete({
                where: { id },
            });
            return category;
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error deleting menu category");
        }
    }
}
exports.default = MenuCategoryService;
//# sourceMappingURL=menu-category.service.js.map