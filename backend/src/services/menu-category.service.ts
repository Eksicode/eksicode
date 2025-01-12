import { PrismaClient, MenuCategory } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";

class MenuCategoryService {
  private prisma = new PrismaClient();

  public async getAllMenuCategories(skip?: number, limit?: number) {
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
    } catch (error) {
      throw new HttpException(500, "Error fetching menu categories");
    }
  }

  public async getMenuCategoryById(id: number): Promise<MenuCategory | null> {
    try {
      const category = await this.prisma.menuCategory.findUnique({
        where: { id },
        include: {
          menus: true,
        },
      });

      if (!category) {
        throw new HttpException(404, "Menu category not found");
      }

      return category;
    } catch (error) {
      throw new HttpException(500, "Error fetching menu category");
    }
  }

  public async createMenuCategory(data: { name: string }): Promise<MenuCategory> {
    try {
      const category = await this.prisma.menuCategory.create({
        data: {
          name: data.name,
        },
      });

      return category;
    } catch (error) {
      throw new HttpException(500, "Error creating menu category");
    }
  }

  public async updateMenuCategory(id: number, data: { name: string }): Promise<MenuCategory> {
    try {
      const category = await this.prisma.menuCategory.update({
        where: { id },
        data: {
          name: data.name,
        },
      });

      return category;
    } catch (error) {
      throw new HttpException(500, "Error updating menu category");
    }
  }

  public async deleteMenuCategory(id: number): Promise<MenuCategory> {
    try {
      const category = await this.prisma.menuCategory.delete({
        where: { id },
      });

      return category;
    } catch (error) {
      throw new HttpException(500, "Error deleting menu category");
    }
  }
}

export default MenuCategoryService; 