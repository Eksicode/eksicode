import { Prisma, MediaType } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";

// Sample media data for seeding
const mediaData = [
  {
    originalName: "default-profile.jpg",
    filename: "profile-default-001.jpg",
    url: "/uploads/profiles/default-profile.jpg",
    mimeType: "image/jpeg",
    size: 24576, // 24KB
    altText: "Default profile picture",
    type: MediaType.IMAGE
  },
  {
    originalName: "post-header-1.jpg",
    filename: "post-header-001.jpg",
    url: "/uploads/posts/post-header-1.jpg",
    mimeType: "image/jpeg",
    size: 51200, // 50KB
    altText: "Technology post header image",
    type: MediaType.IMAGE
  },
  {
    originalName: "company-logo-1.svg",
    filename: "company-logo-001.svg",
    url: "/uploads/companies/company-logo-1.svg",
    mimeType: "image/svg+xml",
    size: 2048, // 2KB
    altText: "Company logo",
    type: MediaType.IMAGE
  },
  {
    originalName: "page-header-1.jpg",
    filename: "page-header-001.jpg",
    url: "/uploads/pages/page-header-1.jpg",
    mimeType: "image/jpeg",
    size: 30720, // 30KB
    altText: "Page header image",
    type: MediaType.IMAGE
  }
];

/**
 * Seeder for media files
 */
export class MediaSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${mediaData.length} media files...`);

    const media = await this.processBatch(
      mediaData,
      async (mediaItem: any, tx) => {
        return await this.safeUpsert(
          () => tx.media.upsert({
            where: { filename: mediaItem.filename },
            update: mediaItem,
            create: mediaItem
          }),
          'media',
          mediaItem.filename
        );
      },
      10,
      tx
    );

    this.logger.success(`Created/updated ${media.length} media files`);
  }
} 