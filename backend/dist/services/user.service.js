"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class UserService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    /**
     * Get all users
     */
    async getAllUsers(skip, limit, summaryOnly) {
        const [users, count] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                select: summaryOnly
                    ? {
                        id: true,
                        email: true,
                        password: true,
                        firstName: true,
                        lastName: true,
                        username: true,
                        profilePicture: true,
                        birthday: true,
                        telegramId: true,
                        phoneNumber: true,
                        linkedin: true,
                        website: true,
                        github: true,
                        twitter: true,
                        instagram: true,
                        facebook: true,
                        verified: true,
                        emailVerified: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                    : undefined,
            }),
            this.prisma.user.count(),
        ]);
        return { users, count };
    }
    /**
     * Get user by ID
     */
    async getUserById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    /**
     * Create a new user
     */
    async createUser(data) {
        return this.prisma.user.create({
            data,
        });
    }
    /**
     * Update an existing user
     */
    async updateUser(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a user
     */
    async deleteUser(id) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map