import { MenuCategory } from "@prisma/client";
declare class MenuCategoryService {
    private prisma;
    getAllMenuCategories(skip?: number, limit?: number): Promise<{
        categories: ({
            menus: {
                link: string;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                icon: string | null;
                subMenu: number;
            }[];
        } & {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
        count: number;
    }>;
    getMenuCategoryById(id: number): Promise<MenuCategory | null>;
    createMenuCategory(data: {
        name: string;
    }): Promise<MenuCategory>;
    updateMenuCategory(id: number, data: {
        name: string;
    }): Promise<MenuCategory>;
    deleteMenuCategory(id: number): Promise<MenuCategory>;
}
export default MenuCategoryService;
