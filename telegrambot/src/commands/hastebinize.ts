import { hastebinize, errorMessage } from '../utils';
import rateLimiter from '../utils/rateLimiter';
import commandLogger from '../utils/commandLogger';

interface UserInfo {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface Message {
  message_id: number;
  chat: { id: number };
  text?: string;
  from: UserInfo;
  reply_to_message?: Message;
}

interface Context {
  from: UserInfo;
  message: Message;
  reply: (text: string, options?: any) => Promise<any>;
  replyWithMarkdown: (text: string, options?: any) => Promise<any>;
  telegram: {
    deleteMessage: (chatId: number, messageId: number) => Promise<any>;
  };
}

async function hastebinizeCommand(ctx: Context): Promise<void> {
  try {
    // Rate limiting
    if (rateLimiter.isLimited(ctx.from.id, 'hastebinize', 3, 60000)) {
      await ctx.reply('⏰ Çok hızlı! Lütfen biraz bekleyin.');
      return;
    }

    // Check if replying to a message
    if (!ctx.message.reply_to_message) {
      await ctx.reply('❌ Lütfen hastebinize etmek istediğiniz mesajı yanıtlayın.');
      return;
    }

    const replyToMessage = ctx.message.reply_to_message;

    // Check if message has text
    if (!replyToMessage.text || replyToMessage.text.trim().length === 0) {
      await ctx.reply('❌ Yanıtlanan mesajda metin bulunamadı.');
      return;
    }

    // Check message length
    if (replyToMessage.text.length > 1000000) {
      await ctx.reply('❌ Mesaj çok uzun! Maksimum 1MB desteklenir.');
      return;
    }

    const userName = replyToMessage.from.username ||
                    replyToMessage.from.first_name ||
                    replyToMessage.from.last_name ||
                    'Bilinmeyen';

    const hastebinized = await hastebinize(replyToMessage.text);

    await ctx.replyWithMarkdown(`📝 **Hastebin:**\n\n[${userName}](tg://user?id=${replyToMessage.from.id}): ${hastebinized}`, {
      reply_to_message_id: ctx.message.message_id
    });

    // Delete original messages
    try {
      await ctx.telegram.deleteMessage(ctx.message.chat.id, replyToMessage.message_id);
      await ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
    } catch (deleteError: any) {
      console.log('Could not delete messages:', deleteError.message);
      // Continue execution even if deletion fails
    }

    commandLogger.logCommand(ctx as any, 'hastebinize', true);
  } catch (error) {
    commandLogger.logError(ctx as any, 'hastebinize', error as Error);
    ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
  }
}

export default hastebinizeCommand;
