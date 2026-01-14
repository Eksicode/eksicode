const { errorMessage } = require('../utils')
const CommandValidator = require('../utils/commandValidator')
const rateLimiter = require('../utils/rateLimiter')
const commandLogger = require('../utils/commandLogger')

async function announcementCommand(ctx) {
  try {
    // Rate limiting
    if (rateLimiter.isLimited(ctx.from.id, 'announcement', 3, 60000)) {
      return ctx.reply('⏰ Çok hızlı! Lütfen biraz bekleyin.')
    }

    // Validate environment
    if (!process.env.ANNOUNCEMENT_CHANNEL_URL) {
      commandLogger.logError(ctx, 'announcement', new Error('ANNOUNCEMENT_CHANNEL_URL not configured'))
      return ctx.reply(`${errorMessage()} Duyuru kanalı yapılandırılmamış.`)
    }

    // Validate URL
    try {
      CommandValidator.validateUrl(process.env.ANNOUNCEMENT_CHANNEL_URL)
    } catch (error) {
      commandLogger.logError(ctx, 'announcement', error)
      return ctx.reply(`${errorMessage()} Geçersiz duyuru kanalı URL'si.`)
    }

    await ctx.reply('📢 Duyuru Kanalımıza Katılın!', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📣 Duyuru Kanalı',
              url: process.env.ANNOUNCEMENT_CHANNEL_URL
            }
          ]
        ]
      }
    })

    commandLogger.logCommand(ctx, 'announcement', true)
  } catch (error) {
    commandLogger.logError(ctx, 'announcement', error)
    ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`)
  }
}

module.exports = announcementCommand
