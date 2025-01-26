import { Menu } from "@prisma/client";
declare class MenuService {
    private prisma;
    getAllMenus(skip?: number, limit?: number, summaryOnly?: boolean): Promise<{
        menus: ({
            categories: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
            link: string;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            subMenu: number;
        })[];
        count: number;
    }>;
    getMenuById(id: number): Promise<Menu | null>;
    createMenu(menuData: any): Promise<Menu>;
    updateMenu(id: number, menuData: any): Promise<Menu>;
    deleteMenu(id: number): Promise<Menu>;
    getMenusByCategory(categoryId: number, skip?: number, limit?: number): Promise<{
        menus: ({
            categories: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
            link: string;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            subMenu: number;
        })[];
        count: number;
    }>;
}
export default MenuService;
