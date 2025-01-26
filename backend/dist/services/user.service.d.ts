import { User, Prisma } from "@prisma/client";
declare class UserService {
    private prisma;
    /**
     * Get all users
     */
    getAllUsers(skip: number, limit: number, summaryOnly: boolean): Promise<{
        users: User[];
        count: number;
    }>;
    /**
     * Get user by ID
     */
    getUserById(id: number): Promise<User | null>;
    /**
     * Create a new user
     */
    createUser(data: Prisma.UserCreateInput): Promise<User>;
    /**
     * Update an existing user
     */
    updateUser(id: number, data: Partial<User>): Promise<User>;
    /**
     * Delete a user
     */
    deleteUser(id: number): Promise<User>;
}
export default UserService;
