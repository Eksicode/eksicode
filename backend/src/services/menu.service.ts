import { PrismaClient, Menu } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";

class MenuService {
  private prisma = new PrismaClient();

  public async getAllMenus(skip?: number, limit?: number, summaryOnly: boolean = false) {
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
    } catch (error) {
      throw new HttpException(500, "Error fetching menus");
    }
  }

  public async getMenuById(id: number): Promise<Menu | null> {
    try {
      const menu = await this.prisma.menu.findUnique({
        where: { id },
        include: {
          categories: true,
        },
      });

      if (!menu) {
        throw new HttpException(404, "Menu not found");
      }

      return menu;
    } catch (error) {
      throw new HttpException(500, "Error fetching menu");
    }
  }

  public async createMenu(menuData: any): Promise<Menu> {
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
    } catch (error) {
      throw new HttpException(500, "Error creating menu");
    }
  }

  public async updateMenu(id: number, menuData: any): Promise<Menu> {
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
    } catch (error) {
      throw new HttpException(500, "Error updating menu");
    }
  }

  public async deleteMenu(id: number): Promise<Menu> {
    try {
      const menu = await this.prisma.menu.delete({
        where: { id },
      });

      return menu;
    } catch (error) {
      throw new HttpException(500, "Error deleting menu");
    }
  }

  public async getMenusByCategory(categoryId: number, skip?: number, limit?: number) {
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
    } catch (error) {
      throw new HttpException(500, "Error fetching menus by category");
    }
  }
}

export default MenuService; 