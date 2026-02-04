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

async function discordCommand(ctx: Context): Promise<void> {
  try {
    // Rate limiting
    if (rateLimiter.isLimited(ctx.from.id, 'discord', 3, 60000)) {
      await ctx.reply('⏰ Çok hızlı! Lütfen biraz bekleyin.');
      return;
    }

    // Validate environment
    if (!process.env.DISCORD_URL) {
      commandLogger.logError(ctx as any, 'discord', new Error('DISCORD_URL not configured'));
      await ctx.reply(`${CONFIG_ERROR_PREFIX}Discord bağlantısı yapılandırılmamış.`);
      return;
    }

    // Validate URL
    try {
      CommandValidator.validateUrl(process.env.DISCORD_URL);
    } catch (error) {
      commandLogger.logError(ctx as any, 'discord', error as Error);
      await ctx.reply(`${CONFIG_ERROR_PREFIX}Geçersiz Discord URL'si.`);
      return;
    }

    await ctx.reply('🎙 Discord Sunucumuza Katılın!', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🎙 Discord Sunucumuz',
              url: process.env.DISCORD_URL
            }
          ]
        ]
      }
    });

    commandLogger.logCommand(ctx as any, 'discord', true);
  } catch (error) {
    commandLogger.logError(ctx as any, 'discord', error as Error);
    ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
  }
}

export default discordCommand;
