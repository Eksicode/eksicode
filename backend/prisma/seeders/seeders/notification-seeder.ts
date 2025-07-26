import { Prisma, NotificationTypeEnum } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";

// Sample notification data for seeding
const notificationData = [
  {
    title: "Hoş geldiniz!",
    content: "Eksicode platformuna hoş geldiniz. İlk gönderinizi oluşturmaya başlayabilirsiniz.",
    type: NotificationTypeEnum.ADMIN,
    read: false
  },
  {
    title: "Yeni gönderi onaylandı",
    content: "Gönderiniz başarıyla onaylandı ve yayınlandı.",
    type: NotificationTypeEnum.POST,
    read: false
  },
  {
    title: "Yeni yorum",
    content: "Gönderinize yeni bir yorum yapıldı.",
    type: NotificationTypeEnum.COMMENT,
    read: true
  },
  {
    title: "Sistem güncellemesi",
    content: "Platform güncellemeleri tamamlandı. Yeni özellikleri keşfedin.",
    type: NotificationTypeEnum.SYSTEM,
    read: false
  },
  {
    title: "Mesajınız var",
    content: "Size yeni bir mesaj gönderildi.",
    type: NotificationTypeEnum.MESSAGE,
    read: false
  }
];

/**
 * Seeder for notifications
 */
export class NotificationSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${notificationData.length} notifications...`);

    // Get the admin user to use as both user and sender
    const adminUser = await tx.user.findUnique({
      where: { email: SEED_CONFIG.defaultAdmin.email }
    });

    if (!adminUser) {
      throw new Error("Admin user not found - ensure UserSeeder runs before NotificationSeeder");
    }

    const notifications = await this.processBatch(
      notificationData,
      async (notificationItem: any, tx) => {
        const notificationInput = {
          ...notificationItem,
          userId: adminUser.id,
          senderId: adminUser.id, // For now, admin is both user and sender
        };

        return await this.safeUpsert(
          () => tx.notification.create({
            data: notificationInput
          }),
          'notification',
          notificationItem.title
        );
      },
      10,
      tx
    );

    this.logger.success(`Created ${notifications.length} notifications`);
  }
} 