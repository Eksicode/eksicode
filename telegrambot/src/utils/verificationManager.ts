/**
 * Human verification system for new group members with database persistence
 */

import { Telegram } from 'telegraf';
import { prisma } from './prisma-client';
import errorMessage from './errorMessage';
import commandLogger from './commandLogger';

interface UserInfo {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

interface VerificationData {
  chatId: number;
  messageId: number;
  timestamp: number;
  user: UserInfo;
}

interface Context {
  chat: { id: number };
  telegram: Telegram;
  from?: UserInfo;
  answerCbQuery: (text: string) => Promise<any>;
}

class VerificationManager {
  private pendingVerifications: Map<number, VerificationData>;
  private verificationTimeout: number;
  private cleanupInterval: number;
  private telegram?: Telegram;

  constructor() {
    this.pendingVerifications = new Map();
    this.verificationTimeout = 300000; // 5 minutes
    this.cleanupInterval = 60000; // 1 minute
    this.startCleanupTimer();
  }

  /**
   * Restore pending verifications from database on startup
   */
  async restorePendingVerifications(telegram: Telegram): Promise<void> {
    try {
      this.telegram = telegram;
      const now = new Date();
      
      // Get all non-expired verifications from database
      const verifications = await prisma.telegramVerification.findMany({
        where: {
          expiresAt: {
            gt: now
          }
        }
      });

      console.log(`Restoring ${verifications.length} pending verifications from database...`);

      for (const verification of verifications) {
        const timeLeft = verification.expiresAt.getTime() - now.getTime();
        
        if (timeLeft > 0) {
          // Restore to memory
          this.pendingVerifications.set(Number(verification.userId), {
            chatId: Number(verification.chatId),
            messageId: verification.messageId,
            timestamp: verification.createdAt.getTime(),
            user: {
              id: Number(verification.userId),
              first_name: verification.firstName || undefined,
              last_name: verification.lastName || undefined,
              username: verification.username || undefined
            }
          });

          // Set timeout for auto-removal
          setTimeout(() => {
            this.handleVerificationTimeout(Number(verification.userId));
          }, timeLeft);
        } else {
          // Already expired, clean up
          await this.handleVerificationTimeout(Number(verification.userId));
        }
      }

      console.log(`Successfully restored ${this.pendingVerifications.size} pending verifications`);
    } catch (error) {
      console.error('Error restoring pending verifications:', error);
    }
  }

  /**
   * Start verification process for a new user
   */
  async startVerification(ctx: Context, user: UserInfo): Promise<boolean> {
    try {
      const userId = user.id;
      const chatId = ctx.chat.id;
      
      // Check if user is already verified
      if (this.isUserVerified(userId, chatId)) {
        return false;
      }

      // Check if user is already pending verification
      if (this.pendingVerifications.has(userId)) {
        return false;
      }

      // Restrict user first
      await ctx.telegram.restrictChatMember(chatId, userId, {
        permissions: {
          can_send_messages: false,
          can_send_polls: false,
          can_send_other_messages: false,
          can_add_web_page_previews: false,
          can_change_info: false,
          can_invite_users: false,
          can_pin_messages: false
        }
      });

      // Send verification message
      const verificationMessage = await ctx.telegram.sendMessage(chatId, 
        `👋 **Hoş geldin ${user.first_name || user.username || 'Kullanıcı'}!**\\n\\n` +
        `🤖 Bu grupta spam ve bot koruması için doğrulama gereklidir.\\n\\n` +
        `✅ Aşağıdaki butona tıklayarak insan olduğunuzu doğrulayın:\\n\\n` +
        `⏰ **Süre:** 5 dakika\\n` +
        `❌ Süre dolduğunda otomatik olarak gruptan çıkarılacaksınız.`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '✅ İnsan Olduğumu Doğrula',
                  callback_data: `verify:${userId}`
                }
              ]
            ]
          }
        }
      );

      const expiresAt = new Date(Date.now() + this.verificationTimeout);

      // Store in database
      await prisma.telegramVerification.create({
        data: {
          userId: BigInt(userId),
          chatId: BigInt(chatId),
          messageId: verificationMessage.message_id,
          firstName: user.first_name || null,
          lastName: user.last_name || null,
          username: user.username || null,
          expiresAt
        }
      });

      // Store verification data in memory
      this.pendingVerifications.set(userId, {
        chatId,
        messageId: verificationMessage.message_id,
        timestamp: Date.now(),
        user: user
      });

      // Set timeout for auto-removal
      setTimeout(() => {
        this.handleVerificationTimeout(userId);
      }, this.verificationTimeout);

      commandLogger.logCommand(ctx as any, 'verification_start', true);
      return true;
    } catch (error) {
      commandLogger.logError(ctx as any, 'verification_start', error as Error);
      console.error('Verification start error:', error);
      return false;
    }
  }

  /**
   * Handle verification button click
   */
  async handleVerification(ctx: any, userId: string): Promise<void> {
    try {
      const userIdNum = parseInt(userId);
      const verificationData = this.pendingVerifications.get(userIdNum);
      
      if (!verificationData) {
        return ctx.answerCbQuery('❌ Doğrulama süresi dolmuş veya geçersiz!');
      }

      // Check if user is the one who clicked
      if (ctx.from.id !== userIdNum) {
        return ctx.answerCbQuery('❌ Bu doğrulama sizin için değil!');
      }

      // Remove restrictions
      await ctx.telegram.restrictChatMember(verificationData.chatId, userIdNum, {
        permissions: {
          can_send_messages: true,
          can_send_polls: true,
          can_send_other_messages: true,
          can_add_web_page_previews: true,
          can_change_info: false,
          can_invite_users: false,
          can_pin_messages: false
        }
      });

      // Update verification message
      await ctx.telegram.editMessageText(
        verificationData.chatId,
        verificationData.messageId,
        undefined,
        `✅ **Doğrulama Başarılı!**\\n\\n` +
        `Hoş geldin ${verificationData.user.first_name || verificationData.user.username || 'Kullanıcı'}! ` +
        `Artık grupta mesaj gönderebilirsin.`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: []
          }
        }
      );

      // Remove from database
      await prisma.telegramVerification.delete({
        where: {
          userId: BigInt(userIdNum)
        }
      }).catch(() => {}); // Ignore if already deleted

      // Remove from pending
      this.pendingVerifications.delete(userIdNum);

      await ctx.answerCbQuery('✅ Doğrulama başarılı! Artık mesaj gönderebilirsin.');
      commandLogger.logCommand(ctx, 'verification_success', true);
    } catch (error) {
      commandLogger.logError(ctx, 'verification_success', error as Error);
      console.error('Verification handle error:', error);
      await ctx.answerCbQuery('❌ Doğrulama sırasında hata oluştu!');
    }
  }

  /**
   * Handle verification timeout
   */
  async handleVerificationTimeout(userId: number): Promise<void> {
    try {
      const verificationData = this.pendingVerifications.get(userId);
      
      if (!verificationData && this.telegram) {
        // Try to get from database if not in memory
        const dbVerification = await prisma.telegramVerification.findUnique({
          where: { userId: BigInt(userId) }
        });

        if (dbVerification) {
          // Reconstruct verification data from database
          const chatId = Number(dbVerification.chatId);
          const messageId = dbVerification.messageId;

          // Try to kick user
          try {
            await this.telegram.kickChatMember(chatId, userId);
          } catch (kickError: any) {
            console.log('Could not kick user:', kickError.message);
          }

          // Update message
          try {
            await this.telegram.editMessageText(
              chatId,
              messageId,
              undefined,
              `⏰ **Doğrulama Süresi Doldu**\\n\\n` +
              `Kullanıcı 5 dakika içinde doğrulama yapmadığı için gruptan çıkarıldı.`,
              {
                parse_mode: 'Markdown',
                reply_markup: {
                  inline_keyboard: []
                }
              }
            );
          } catch (editError: any) {
            console.log('Could not edit message:', editError.message);
          }

          // Remove from database
          await prisma.telegramVerification.delete({
            where: { userId: BigInt(userId) }
          }).catch(() => {});
        }
      } else if (verificationData && this.telegram) {
        // Try to kick user
        try {
          await this.telegram.kickChatMember(verificationData.chatId, userId);
        } catch (kickError: any) {
          console.log('Could not kick user:', kickError.message);
        }

        // Update message
        try {
          await this.telegram.editMessageText(
            verificationData.chatId,
            verificationData.messageId,
            undefined,
            `⏰ **Doğrulama Süresi Doldu**\\n\\n` +
            `Kullanıcı 5 dakika içinde doğrulama yapmadığı için gruptan çıkarıldı.`,
            {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: []
              }
            }
          );
        } catch (editError: any) {
          console.log('Could not edit message:', editError.message);
        }

        // Remove from database
        await prisma.telegramVerification.delete({
          where: { userId: BigInt(userId) }
        }).catch(() => {});

        // Remove from pending
        this.pendingVerifications.delete(userId);
      }
    } catch (error) {
      console.error('Verification timeout error:', error);
    }
  }

  /**
   * Check if user is verified (placeholder for future database integration)
   */
  isUserVerified(userId: number, chatId: number): boolean {
    // For now, always return false to require verification
    // In the future, this could check a database
    return false;
  }

  /**
   * Get pending verifications count
   */
  getPendingCount(): number {
    return this.pendingVerifications.size;
  }

  /**
   * Get pending verifications for a specific chat
   */
  getPendingForChat(chatId: number): Array<{ userId: number } & VerificationData> {
    const pending: Array<{ userId: number } & VerificationData> = [];
    for (const [userId, data] of this.pendingVerifications) {
      if (data.chatId === chatId) {
        pending.push({ userId, ...data });
      }
    }
    return pending;
  }

  /**
   * Clean up expired verifications
   */
  startCleanupTimer(): void {
    setInterval(async () => {
      const now = Date.now();
      
      // Clean up memory
      for (const [userId, data] of this.pendingVerifications) {
        if (now - data.timestamp > this.verificationTimeout) {
          await this.handleVerificationTimeout(userId);
        }
      }

      // Clean up database
      try {
        await prisma.telegramVerification.deleteMany({
          where: {
            expiresAt: {
              lt: new Date()
            }
          }
        });
      } catch (error) {
        console.error('Error cleaning up expired verifications:', error);
      }
    }, this.cleanupInterval);
  }

  /**
   * Force verify a user (admin command)
   */
  async forceVerify(telegram: Telegram, chatId: number, userId: string): Promise<boolean> {
    try {
      const userIdNum = parseInt(userId);
      
      // Remove restrictions
      await telegram.restrictChatMember(chatId, userIdNum, {
        permissions: {
          can_send_messages: true,
          can_send_polls: true,
          can_send_other_messages: true,
          can_add_web_page_previews: true,
          can_change_info: false,
          can_invite_users: false,
          can_pin_messages: false
        }
      });

      // Remove from database
      await prisma.telegramVerification.delete({
        where: { userId: BigInt(userIdNum) }
      }).catch(() => {});

      // Remove from pending
      this.pendingVerifications.delete(userIdNum);
      return true;
    } catch (error) {
      console.error('Force verify error:', error);
      return false;
    }
  }

  /**
   * Get verification statistics
   */
  getStats(): { pendingCount: number; timeout: number; cleanupInterval: number } {
    return {
      pendingCount: this.pendingVerifications.size,
      timeout: this.verificationTimeout,
      cleanupInterval: this.cleanupInterval
    };
  }
}

export const verificationManager = new VerificationManager();
