import errorMessage, { CONFIG_ERROR_PREFIX } from '../utils/errorMessage';
import CommandValidator from '../utils/commandValidator';
import rateLimiter from '../utils/rateLimiter';
import commandLogger from '../utils/commandLogger';

interface Context {
  from: {
    id: number;
  };
  reply: (text: string, options?: any) => Promise<any>;
}

async function youtubeCommand(ctx: Context): Promise<void> {
  try {
    // Rate limiting
    if (rateLimiter.isLimited(ctx.from.id, 'youtube', 3, 60000)) {
      return ctx.reply('⏰ Çok hızlı! Lütfen biraz bekleyin.');
    }

    // Validate environment
    if (!process.env.YOUTUBE_URL) {
      commandLogger.logError(ctx as any, 'youtube', new Error('YOUTUBE_URL not configured'));
      return ctx.reply(`${CONFIG_ERROR_PREFIX}YouTube bağlantısı yapılandırılmamış.`);
    }

    // Validate URL
    try {
      CommandValidator.validateUrl(process.env.YOUTUBE_URL);
    } catch (error) {
      commandLogger.logError(ctx as any, 'youtube', error as Error);
      return ctx.reply(`${CONFIG_ERROR_PREFIX}Geçersiz YouTube URL'si.`);
    }

    await ctx.reply('📺 YouTube Kanalımıza Abone Olun!', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📺 YouTube Kanalımız',
              url: process.env.YOUTUBE_URL
            }
          ]
        ]
      }
    });

    commandLogger.logCommand(ctx as any, 'youtube', true);
  } catch (error) {
    commandLogger.logError(ctx as any, 'youtube', error as Error);
    ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
  }
}

export default youtubeCommand;
