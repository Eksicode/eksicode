import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";

// Sample comment data for seeding
const commentData = [
  {
    content: "Great article! Very informative and well-written.",
    authorId: 1, // Will be replaced with actual user ID
    postId: 1,   // Will be replaced with actual post ID
  },
  {
    content: "Thanks for sharing this knowledge. Looking forward to more posts like this.",
    authorId: 1,
    postId: 1,
  },
  {
    content: "This is exactly what I was looking for. Very helpful!",
    authorId: 1,
    postId: 2,
  },
  {
    content: "Interesting perspective. I learned a lot from this post.",
    authorId: 1,
    postId: 2,
  },
  {
    content: "Well explained! The examples really helped me understand the concept.",
    authorId: 1,
    postId: 3,
  }
];

/**
 * Seeder for comments
 */
export class CommentSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${commentData.length} comments...`);

    // Get the admin user to use as author
    const adminUser = await tx.user.findUnique({
      where: { email: "admin@example.com" }
    });

    if (!adminUser) {
      throw new Error("Admin user not found - ensure UserSeeder runs before CommentSeeder");
    }

    // Get existing posts to use for comments
    const existingPosts = await tx.post.findMany({
      take: 5,
      orderBy: { id: 'asc' }
    });

    if (existingPosts.length === 0) {
      this.logger.warn("No posts found - skipping comment seeding");
      return;
    }

    const comments = await this.processBatch(
      commentData,
      async (commentItem: any, tx) => {
        // Get a random post for this comment
        const randomPostIndex = Math.floor(Math.random() * existingPosts.length);
        const post = existingPosts[randomPostIndex];

        const commentInput = {
          content: commentItem.content,
          authorId: adminUser.id,
          postId: post.id,
        };

        return await this.safeUpsert(
          () => tx.comment.create({
            data: commentInput
          }),
          'comment',
          `Comment on post ${post.title}`
        );
      },
      10,
      tx
    );

    this.logger.success(`Created ${comments.length} comments`);
  }
} 