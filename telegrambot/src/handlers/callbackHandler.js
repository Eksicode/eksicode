const { unbanCommand } = require('../commands')
const { verificationManager } = require('../utils')

module.exports = async function (ctx) {
  try {
    const callbackData = ctx.callbackQuery.data

    // Handle verification callbacks
    if (callbackData.startsWith('verify:')) {
      const userId = callbackData.split(':')[1]
      await verificationManager.handleVerification(ctx, userId)
      return
    }

    // Handle unban callbacks
    const matchedData = callbackData.match(/^(?<type>.+): (?<data>.+)$/)?.groups
    if (matchedData && matchedData.type === 'unban') {
      await unbanCommand(ctx, matchedData.data)
      await ctx.answerCbQuery()
    }
  } catch (error) {
    console.error('Callback handler error:', error)
    await ctx.answerCbQuery('❌ Bir hata oluştu!')
  }
}
