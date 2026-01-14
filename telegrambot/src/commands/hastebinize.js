const { hastebinize, errorMessage } = require('../utils')
const CommandValidator = require('../utils/commandValidator')
const rateLimiter = require('../utils/rateLimiter')
const commandLogger = require('../utils/commandLogger')

async function hastebinizeCommand(ctx) {
  try {
    // Rate limiting
    if (rateLimiter.isLimited(ctx.from.id, 'hastebinize', 3, 60000)) {
      return ctx.reply('⏰ Çok hızlı! Lütfen biraz bekleyin.')
    }

    // Check if replying to a message
    if (!ctx.message.reply_to_message) {
      return ctx.reply('❌ Lütfen hastebinize etmek istediğiniz mesajı yanıtlayın.')
    }

    const replyToMessage = ctx.message.reply_to_message

    // Check if message has text
    if (!replyToMessage.text || replyToMessage.text.trim().length === 0) {
      return ctx.reply('❌ Yanıtlanan mesajda metin bulunamadı.')
    }

    // Check message length
    if (replyToMessage.text.length > 1000000) {
      return ctx.reply('❌ Mesaj çok uzun! Maksimum 1MB desteklenir.')
    }

    const userName = replyToMessage.from.username || 
                    replyToMessage.from.first_name || 
                    replyToMessage.from.last_name || 
                    'Bilinmeyen'

    const hastebinized = await hastebinize(replyToMessage.text)

    await ctx.replyWithMarkdown(`📝 **Hastebin:**\n\n[${userName}](tg://user?id=${replyToMessage.from.id}): ${hastebinized}`, {
      reply_to_message_id: ctx.message.message_id
    })

    // Delete original messages
    try {
      await ctx.telegram.deleteMessage(ctx.message.chat.id, replyToMessage.message_id)
      await ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
    } catch (deleteError) {
      console.log('Could not delete messages:', deleteError.message)
      // Continue execution even if deletion fails
    }

    commandLogger.logCommand(ctx, 'hastebinize', true)
  } catch (error) {
    commandLogger.logError(ctx, 'hastebinize', error)
    ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`)
  }
}

module.exports = hastebinizeCommand
