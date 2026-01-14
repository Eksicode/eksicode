import errorMessage from '../utils/errorMessage';
import CommandValidator from '../utils/commandValidator';
import rateLimiter from '../utils/rateLimiter';
import commandLogger from '../utils/commandLogger';

interface Context {
  from: {
    id: number;
  };
  chat: {
    id: number;
  };
  reply: (text: string) => Promise<any>;
  replyWithMarkdown: (text: string) => Promise<any>;
  telegram: {
    getChatAdministrators: (chatId: number) => Promise<any[]>;
  };
}

async function reportCommand(ctx: Context): Promise<void> {
  try {
    // Rate limiting
    if (rateLimiter.isLimited(ctx.from.id, 'report', 2, 300000)) { // 2 reports per 5 minutes
      return ctx.reply('⏰ Çok sık rapor gönderiyorsunuz! Lütfen 5 dakika bekleyin.');
    }

    // Validate chat type
    try {
      CommandValidator.validateChatType(ctx as any, ['group', 'supergroup']);
    } catch (error) {
      return ctx.reply('❌ Bu komut sadece gruplarda kullanılabilir.');
    }

    const admins = await ctx.telegram.getChatAdministrators(ctx.chat.id);
    
    if (!admins || admins.length === 0) {
      return ctx.reply('❌ Bu grupta yönetici bulunamadı.');
    }

    const adminMentions = admins
      .filter((admin: any) => admin.user && !admin.user.is_bot) // Filter out bots
      .map((admin: any) => {
        const name = admin.user.username || admin.user.first_name || admin.user.last_name || 'Bilinmeyen';
        return `[${name}](tg://user?id=${admin.user.id})`;
      })
      .join(' ');

    if (adminMentions.length === 0) {
      return ctx.reply('❌ Bu grupta aktif yönetici bulunamadı.');
    }

    await ctx.replyWithMarkdown(`🚨 **Yöneticileri Etiketleme:**\\n\\n${adminMentions}`);
    commandLogger.logCommand(ctx as any, 'report', true);
  } catch (error) {
    commandLogger.logError(ctx as any, 'report', error as Error);
    ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
  }
}

export default reportCommand;
