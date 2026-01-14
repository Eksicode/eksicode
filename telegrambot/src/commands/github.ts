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

async function githubCommand(ctx: Context): Promise<void> {
  try {
    // Rate limiting
    if (rateLimiter.isLimited(ctx.from.id, 'github', 3, 60000)) {
      return ctx.reply('⏰ Çok hızlı! Lütfen biraz bekleyin.');
    }

    // Validate environment
    if (!process.env.GITHUB_URL) {
      commandLogger.logError(ctx as any, 'github', new Error('GITHUB_URL not configured'));
      return ctx.reply(`${errorMessage()} GitHub bağlantısı yapılandırılmamış.`);
    }

    // Validate URL
    try {
      CommandValidator.validateUrl(process.env.GITHUB_URL);
    } catch (error) {
      commandLogger.logError(ctx as any, 'github', error as Error);
      return ctx.reply(`${errorMessage()} Geçersiz GitHub URL'si.`);
    }

    await ctx.reply('💻 GitHub Hesabımıza Göz Atın!', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '💻 GitHub Hesabımız',
              url: process.env.GITHUB_URL
            }
          ]
        ]
      }
    });

    commandLogger.logCommand(ctx as any, 'github', true);
  } catch (error) {
    commandLogger.logError(ctx as any, 'github', error as Error);
    ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
  }
}

export default githubCommand;
