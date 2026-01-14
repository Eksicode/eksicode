const { errorMessage } = require('../utils')
const CommandValidator = require('../utils/commandValidator')
const rateLimiter = require('../utils/rateLimiter')
const commandLogger = require('../utils/commandLogger')

async function discordCommand(ctx) {
  try {
    // Rate limiting
    if (rateLimiter.isLimited(ctx.from.id, 'discord', 3, 60000)) {
      return ctx.reply('⏰ Çok hızlı! Lütfen biraz bekleyin.')
    }

    // Validate environment
    if (!process.env.DISCORD_URL) {
      commandLogger.logError(ctx, 'discord', new Error('DISCORD_URL not configured'))
      return ctx.reply(`${errorMessage()} Discord bağlantısı yapılandırılmamış.`)
    }

    // Validate URL
    try {
      CommandValidator.validateUrl(process.env.DISCORD_URL)
    } catch (error) {
      commandLogger.logError(ctx, 'discord', error)
      return ctx.reply(`${errorMessage()} Geçersiz Discord URL'si.`)
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
    })

    commandLogger.logCommand(ctx, 'discord', true)
  } catch (error) {
    commandLogger.logError(ctx, 'discord', error)
    ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`)
  }
}

module.exports = discordCommand
