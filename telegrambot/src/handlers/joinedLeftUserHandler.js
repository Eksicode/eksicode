const { verificationManager } = require('../utils')
const commandLogger = require('../utils/commandLogger')

async function joinedLeftUserHandler(ctx) {
  try {
    // Handle new chat members
    if (ctx.message.new_chat_members) {
      for (const user of ctx.message.new_chat_members) {
        // Skip bots
        if (user.is_bot) {
          continue
        }

        // Start verification process
        await verificationManager.startVerification(ctx, user)
      }
    }

    // Handle left chat member
    if (ctx.message.left_chat_member) {
      const user = ctx.message.left_chat_member
      
      // Clean up any pending verification for this user
      if (verificationManager.pendingVerifications.has(user.id)) {
        verificationManager.pendingVerifications.delete(user.id)
        commandLogger.logCommand(ctx, 'verification_cleanup', true)
      }
    }

    // Delete the join/leave message (if bot has permission)
    try {
      await ctx.deleteMessage()
    } catch (deleteError) {
      // Ignore if bot doesn't have permission to delete messages
      console.log('Could not delete join/leave message (missing permission)')
    }
  } catch (error) {
    // commandLogger might be default export, handle gracefully
    try {
      if (commandLogger && typeof commandLogger.logError === 'function') {
        commandLogger.logError(ctx, 'join_leave_handler', error)
      } else if (commandLogger.default && typeof commandLogger.default.logError === 'function') {
        commandLogger.default.logError(ctx, 'join_leave_handler', error)
      }
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
    console.error("Hata: Giren/Çıkan kullanıcı handler'ında hata oluştu.")
    console.error(error)
  }
}

module.exports = joinedLeftUserHandler
