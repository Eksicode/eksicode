import { Prisma, PostStatus } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";
import { posts } from "../../postsData";

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

    const createdPosts = await this.processBatch(
      posts as PostData[],
      async (postData: PostData, tx) => {
        const { status, tags, categories, ...postInfo } = postData;
        
        const postInput = {
          ...postInfo,
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
