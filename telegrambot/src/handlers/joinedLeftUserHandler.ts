import { verificationManager } from '../utils';
import commandLogger from '../utils/commandLogger';

interface UserInfo {
  id: number;
  is_bot: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
}

interface Message {
  new_chat_members?: UserInfo[];
  left_chat_member?: UserInfo;
}

interface Context {
  message: Message;
  deleteMessage: () => Promise<any>;
}

async function joinedLeftUserHandler(ctx: Context): Promise<void> {
  try {
    // Handle new chat members
    if (ctx.message.new_chat_members) {
      for (const user of ctx.message.new_chat_members) {
        // Skip bots
        if (user.is_bot) {
          continue;
        }

        // Start verification process
        await verificationManager.startVerification(ctx as any, user);
      }
    }

    // Handle left chat member
    if (ctx.message.left_chat_member) {
      const user = ctx.message.left_chat_member;

      // Clean up any pending verification for this user
      const pendingVerifications = (verificationManager as any).pendingVerifications;
      if (pendingVerifications && pendingVerifications.has(user.id)) {
        pendingVerifications.delete(user.id);
        commandLogger.logCommand(ctx as any, 'verification_cleanup', true);
      }
    }

    // Delete the join/leave message (if bot has permission)
    try {
      await ctx.deleteMessage();
    } catch (deleteError) {
      // Ignore if bot doesn't have permission to delete messages
      console.log('Could not delete join/leave message (missing permission)');
    }
  } catch (error) {
    commandLogger.logError(ctx as any, 'join_leave_handler', error as Error);
    console.error("Hata: Giren/Çıkan kullanıcı handler'ında hata oluştu.");
    console.error(error);
  }
}

export default joinedLeftUserHandler;
