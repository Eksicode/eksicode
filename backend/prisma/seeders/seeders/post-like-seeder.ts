import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";

/**
 * Seeder for post likes
 */
export class PostLikeSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info("Seeding post likes...");

    // Get the admin user to use for likes
    const adminUser = await tx.user.findUnique({
      where: { email: SEED_CONFIG.defaultAdmin.email }
    });

    if (!adminUser) {
      throw new Error("Admin user not found - ensure UserSeeder runs before PostLikeSeeder");
    }

    // Get existing posts to create likes for
    const existingPosts = await tx.post.findMany({
      take: 10,
      orderBy: { id: 'asc' }
    });

    if (existingPosts.length === 0) {
      this.logger.warn("No posts found - skipping post like seeding");
      return;
    }

    // Create likes for some posts
    const likes = await this.processBatch(
      existingPosts.slice(0, 5), // Like first 5 posts
      async (post: any, tx) => {
        return await this.safeUpsert(
          () => tx.postLike.upsert({
            where: {
              userId_postId: {
                userId: adminUser.id,
                postId: post.id
              }
            },
            update: {}, // No updates needed
            create: {
              userId: adminUser.id,
              postId: post.id
            }
          }),
          'post like',
          `Like for post ${post.title}`
        );
      },
      10,
      tx
    );

    this.logger.success(`Created ${likes.length} post likes`);
  }
} 