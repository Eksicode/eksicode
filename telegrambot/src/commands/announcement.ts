import { errorMessage, CONFIG_ERROR_PREFIX } from '../utils';
import CommandValidator from '../utils/commandValidator';
import rateLimiter from '../utils/rateLimiter';
import commandLogger from '../utils/commandLogger';

interface Context {
  from: {
    id: number;
  };
  reply: (text: string, options?: any) => Promise<any>;
}

async function announcementCommand(ctx: Context): Promise<void> {
  try {
    // Rate limiting
    if (rateLimiter.isLimited(ctx.from.id, 'announcement', 3, 60000)) {
      await ctx.reply('⏰ Çok hızlı! Lütfen biraz bekleyin.');
      return;
    }

    // Validate environment
    if (!process.env.ANNOUNCEMENT_CHANNEL_URL) {
      commandLogger.logError(ctx as any, 'announcement', new Error('ANNOUNCEMENT_CHANNEL_URL not configured'));
      await ctx.reply(`${CONFIG_ERROR_PREFIX}Duyuru kanalı yapılandırılmamış.`);
      return;
    }

    // Validate URL
    try {
      CommandValidator.validateUrl(process.env.ANNOUNCEMENT_CHANNEL_URL);
    } catch (error) {
      commandLogger.logError(ctx as any, 'announcement', error as Error);
      await ctx.reply(`${CONFIG_ERROR_PREFIX}Geçersiz duyuru kanalı URL'si.`);
      return;
    }

    await ctx.reply('📢 Duyuru Kanalımıza Katılın!', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📣 Duyuru Kanalı',
              url: process.env.ANNOUNCEMENT_CHANNEL_URL
            }
          ]
        ]
      }
    });

    commandLogger.logCommand(ctx as any, 'announcement', true);
  } catch (error) {
    commandLogger.logError(ctx as any, 'announcement', error as Error);
    ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
  }
}

export default announcementCommand;
