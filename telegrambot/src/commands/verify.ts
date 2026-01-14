import errorMessage from '../utils/errorMessage';
import { verificationManager } from '../utils/verificationManager';
import rateLimiter from '../utils/rateLimiter';
import commandLogger from '../utils/commandLogger';

interface Context {
  from: {
    id: number;
  };
  chat: {
    id: number;
  };
  message: {
    text: string;
  };
  reply: (text: string) => Promise<any>;
  replyWithMarkdown: (text: string) => Promise<any>;
  telegram: any;
}

async function verifyCommand(ctx: Context): Promise<void> {
  try {
    // Rate limiting
    if (rateLimiter.isLimited(ctx.from.id, 'verify', 5, 60000)) {
      return ctx.reply('⏰ Çok hızlı! Lütfen biraz bekleyin.');
    }

    const args = ctx.message.text.split(' ').slice(1);
    const subCommand = args[0];

    switch (subCommand) {
      case 'stats':
      case 'istatistik':
        await handleStats(ctx);
        break;
      
      case 'pending':
      case 'bekleyen':
        await handlePending(ctx);
        break;
      
      case 'force':
      case 'zorla':
        await handleForceVerify(ctx, args[1]);
        break;
      
      case 'help':
      case 'yardim':
        await handleHelp(ctx);
        break;
      
      default:
        await handleHelp(ctx);
    }

    commandLogger.logCommand(ctx as any, 'verify', true);
  } catch (error) {
    commandLogger.logError(ctx as any, 'verify', error as Error);
    ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
  }
}

async function handleStats(ctx: Context): Promise<void> {
  const stats = verificationManager.getStats();
  const pendingForChat = verificationManager.getPendingForChat(ctx.chat.id);
  
  const message = `📊 **Doğrulama İstatistikleri**\\n\\n` +
    `⏳ **Bekleyen Doğrulama:** ${stats.pendingCount}\\n` +
    `📱 **Bu Grupta Bekleyen:** ${pendingForChat.length}\\n` +
    `⏰ **Süre Limiti:** ${Math.round(stats.timeout / 60000)} dakika\\n` +
    `🔄 **Temizlik Aralığı:** ${Math.round(stats.cleanupInterval / 1000)} saniye`;

  await ctx.replyWithMarkdown(message);
}

async function handlePending(ctx: Context): Promise<void> {
  const pendingForChat = verificationManager.getPendingForChat(ctx.chat.id);
  
  if (pendingForChat.length === 0) {
    return ctx.reply('✅ Bu grupta bekleyen doğrulama yok.');
  }

  let message = `⏳ **Bekleyen Doğrulamalar (${pendingForChat.length}):**\\n\\n`;
  
  for (const pending of pendingForChat) {
    const user = pending.user;
    const timeLeft = Math.round((300000 - (Date.now() - pending.timestamp)) / 1000);
    const name = user.first_name || user.username || 'Bilinmeyen';
    
    message += `👤 **${name}**\\n`;
    message += `🆔 ID: \`${pending.userId}\`\\n`;
    message += `⏰ Kalan Süre: ${timeLeft > 0 ? `${timeLeft}s` : 'Süre Doldu'}\\n\\n`;
  }

  await ctx.replyWithMarkdown(message);
}

async function handleForceVerify(ctx: Context, userId: string): Promise<void> {
  if (!userId) {
    return ctx.reply('❌ Kullanım: `/verify force <user_id>`');
  }

  try {
    const success = await verificationManager.forceVerify(ctx.telegram, ctx.chat.id, userId);
    
    if (success) {
      await ctx.reply(`✅ Kullanıcı \`${userId}\` zorla doğrulandı.`);
    } else {
      await ctx.reply(`❌ Kullanıcı \`${userId}\` doğrulanamadı.`);
    }
  } catch (error: any) {
    await ctx.reply(`❌ Zorla doğrulama sırasında hata: ${error.message}`);
  }
}

async function handleHelp(ctx: Context): Promise<void> {
  const message = `🔐 **Doğrulama Komutları**\\n\\n` +
    `📊 \`/verify stats\` - Doğrulama istatistikleri\\n` +
    `⏳ \`/verify pending\` - Bekleyen doğrulamalar\\n` +
    `⚡ \`/verify force <user_id>\` - Zorla doğrula\\n` +
    `❓ \`/verify help\` - Bu yardım mesajı\\n\\n` +
    `**Not:** Bu komutlar sadece yöneticiler tarafından kullanılabilir.`;

  await ctx.replyWithMarkdown(message);
}

export default verifyCommand;
