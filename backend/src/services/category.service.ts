import { PrismaClient, PostCategory } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";
import { prisma } from "../config/database";

class CategoryService {
    private prisma = prisma;

    public async getAllCategories(): Promise<PostCategory[]> {
        try {
            const categories = await this.prisma.postCategory.findMany({
                orderBy: { name: 'asc' }
            });
            return categories;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw new HttpException(500, "Error fetching categories");
        }
    }
}

export default CategoryService;
