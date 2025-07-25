import { Prisma, PostStatus } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";
import { posts } from "../datas/postsData";

type PostData = {
  title: string;
  slug: string;
  content: string;
  headerImage?: string;
  status: string;
  approved: boolean;
  authorId: number;
  tags: number[];
  categories: number[];
};

/**
 * Seeder for posts
 */
export class PostSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${posts.length} posts...`);

    // Find the admin user to get the correct authorId
    const adminUser = await tx.user.findUnique({
      where: { email: "admin@example.com" }
    });

    if (!adminUser) {
      throw new Error("Admin user not found - ensure UserSeeder runs before PostSeeder");
    }

    const createdPosts = await this.processBatch(
      posts as PostData[],
      async (postData: PostData, tx) => {
        const { status, tags, categories, headerImage, ...postInfo } = postData;
        
        const postInput = {
          ...postInfo,
          authorId: adminUser.id, // Use the actual admin user ID
          headerImageId: null, // Will be set when media seeder is implemented
          status: status as PostStatus,
          categories: {
            connect: categories.map(id => ({ id }))
          },
          tags: {
            connect: tags.map(id => ({ id }))
          }
        };

        return await this.safeUpsert(
          () => tx.post.upsert({
            where: { slug: postData.slug },
            update: postInput,
            create: postInput
          }),
          'post',
          postData.slug
        );
      },
      SEED_CONFIG.batchSizes.posts,
      tx
    );

    this.logger.success(`Created/updated ${createdPosts.length} posts`);
  }
}
