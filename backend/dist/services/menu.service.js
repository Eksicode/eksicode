"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const HttpException_1 = require("../exceptions/HttpException");
class MenuService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async getAllMenus(skip, limit, summaryOnly = false) {
        try {
            const count = await this.prisma.menu.count();
            const menus = await this.prisma.menu.findMany({
                skip: skip || 0,
                take: limit || undefined,
                include: {
                    categories: summaryOnly ? {
                        select: {
                            id: true,
                            name: true,
                        }
                    } : true,
                },
                orderBy: {
                    // order by id in ascending order
                    id: 'asc',
                },
            });
            return { menus, count };
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error fetching menus");
        }
    }
    async getMenuById(id) {
        try {
            const menu = await this.prisma.menu.findUnique({
                where: { id },
                include: {
                    categories: true,
                },
            });
            if (!menu) {
                throw new HttpException_1.HttpException(404, "Menu not found");
            }
            return menu;
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error fetching menu");
        }
    }
    async createMenu(menuData) {
        try {
            const menu = await this.prisma.menu.create({
                data: {
                    name: menuData.name,
                    link: menuData.link,
                    subMenu: menuData.subMenu || 0,
                    icon: menuData.icon,
                },
            });
            return menu;
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error creating menu");
        }
    }
    async updateMenu(id, menuData) {
        try {
            const menu = await this.prisma.menu.update({
                where: { id },
                data: {
                    name: menuData.name,
                    link: menuData.link,
                    subMenu: menuData.subMenu,
                    icon: menuData.icon,
                },
            });
            return menu;
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error updating menu");
        }
    }
    async deleteMenu(id) {
        try {
            const menu = await this.prisma.menu.delete({
                where: { id },
            });
            return menu;
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error deleting menu");
        }
    }
    async getMenusByCategory(categoryId, skip, limit) {
        try {
            const count = await this.prisma.menu.count({
                where: {
                    categories: {
                        some: {
                            id: categoryId
                        }
                    }
                }
            });
            const menus = await this.prisma.menu.findMany({
                where: {
                    categories: {
                        some: {
                            id: categoryId
                        }
                    }
                },
                skip: skip || 0,
                take: limit || undefined,
                include: {
                    categories: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return { menus, count };
        }
        catch (error) {
            throw new HttpException_1.HttpException(500, "Error fetching menus by category");
        }
    }
}
exports.default = MenuService;
//# sourceMappingURL=menu.service.js.map