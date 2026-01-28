import { unbanCommand } from '../commands';
import { verificationManager } from '../utils';

interface CallbackQuery {
  data: string;
}

interface Context {
  callbackQuery: CallbackQuery;
  answerCbQuery: (text?: string) => Promise<any>;
}

async function callbackHandler(ctx: Context): Promise<void> {
  try {
    const callbackData = ctx.callbackQuery.data;

    // Handle verification callbacks
    if (callbackData.startsWith('verify:')) {
      const userId = callbackData.split(':')[1];
      await verificationManager.handleVerification(ctx, userId);
      return;
    }

    // Handle unban callbacks
    const matchedData = callbackData.match(/^(?<type>.+): (?<data>.+)$/)?.groups;
    if (matchedData && matchedData.type === 'unban') {
      await unbanCommand(ctx as any, matchedData.data);
      await ctx.answerCbQuery();
    }
  } catch (error) {
    console.error('Callback handler error:', error);
    await ctx.answerCbQuery('❌ Bir hata oluştu!');
  }
}

export default callbackHandler;
