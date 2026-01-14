import errorMessage from '../utils/errorMessage';
import CommandValidator from '../utils/commandValidator';
import rateLimiter from '../utils/rateLimiter';
import commandLogger from '../utils/commandLogger';

interface Context {
  from: {
    id: number;
  };
  reply: (text: string, options?: any) => Promise<any>;
}

async function twitterCommand(ctx: Context): Promise<void> {
  try {
    // Rate limiting
    if (rateLimiter.isLimited(ctx.from.id, 'twitter', 3, 60000)) {
      return ctx.reply('⏰ Çok hızlı! Lütfen biraz bekleyin.');
    }

    // Validate environment
    if (!process.env.TWITTER_URL) {
      commandLogger.logError(ctx as any, 'twitter', new Error('TWITTER_URL not configured'));
      return ctx.reply(`${errorMessage()} Twitter bağlantısı yapılandırılmamış.`);
    }

    // Validate URL
    try {
      CommandValidator.validateUrl(process.env.TWITTER_URL);
    } catch (error) {
      commandLogger.logError(ctx as any, 'twitter', error as Error);
      return ctx.reply(`${errorMessage()} Geçersiz Twitter URL'si.`);
    }

    await ctx.reply('🐦 Twitter Hesabımızı Takip Edin!', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🐦 Twitter Hesabımız',
              url: process.env.TWITTER_URL
            }
          ]
        ]
      }
    });

    commandLogger.logCommand(ctx as any, 'twitter', true);
  } catch (error) {
    commandLogger.logError(ctx as any, 'twitter', error as Error);
    ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
  }
}

export default twitterCommand;
