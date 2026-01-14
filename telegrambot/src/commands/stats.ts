import errorMessage from '../utils/errorMessage';
import rateLimiter from '../utils/rateLimiter';
import commandLogger from '../utils/commandLogger';

interface Context {
  from: {
    id: number;
    username?: string;
    first_name?: string;
  };
  reply: (text: string) => Promise<any>;
  replyWithMarkdown: (text: string) => Promise<any>;
}

async function statsCommand(ctx: Context): Promise<void> {
  try {
    // Rate limiting
    if (rateLimiter.isLimited(ctx.from.id, 'stats', 2, 60000)) {
      return ctx.reply('⏰ Çok hızlı! Lütfen biraz bekleyin.');
    }

    const stats = commandLogger.getStats();
    
    const uptime = process.uptime();
    const uptimeString = formatUptime(uptime);
    
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    
    const statsMessage = `📊 **Bot İstatistikleri**\\n\\n` +
      `🕐 **Çalışma Süresi:** ${uptimeString}\\n` +
      `💾 **Bellek Kullanımı:** ${memoryUsageMB} MB\\n` +
      `📈 **Toplam Komut:** ${stats.totalCommands}\\n` +
      `✅ **Başarılı:** ${stats.successfulCommands}\\n` +
      `❌ **Başarısız:** ${stats.failedCommands}\\n` +
      `📊 **Başarı Oranı:** %${stats.successRate}\\n\\n` +
      `🤖 **Bot Versiyonu:** 2.0.0\\n` +
      `⚡ **Node.js:** ${process.version}`;

    await ctx.replyWithMarkdown(statsMessage);
    commandLogger.logCommand(ctx as any, 'stats', true);
  } catch (error) {
    commandLogger.logError(ctx as any, 'stats', error as Error);
    ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}g ${hours}s ${minutes}d`;
  } else if (hours > 0) {
    return `${hours}s ${minutes}d`;
  } else {
    return `${minutes}d`;
  }
}

export default statsCommand;
