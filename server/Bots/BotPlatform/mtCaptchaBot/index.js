import Telegraf from 'telegraf'
import handlers from './handlers'
import { session } from './utils/session'
import { LocalisationObject } from './utils/localisation'
import { FileIdService } from './utils/fileId'
import { ChannelObject } from './utils/channel'

export const setupCaptchaBot = async (botObject) => {
    const { _id, token, username, locale, channel } = botObject

    const bot = new Telegraf(token)

    // DB-driven session
    bot.use(session(botObject))

    // Bot object (обязательно)
    bot.context.botObject = botObject

    // Localisation (обязательно)
    bot.context.loc = new LocalisationObject(locale)

    // FileId service (если нужно)
    bot.context.fileId = new FileIdService(botObject)

    // Channel (обязательно)
    bot.context.channel = new ChannelObject(channel)

    // Сцены и хэндлеры
    try {
        handlers(bot)
    } catch (e) {
        console.error(e)
    }

    // Запуск серверных роутов для вебхука (нужно для продакшена)
    WebApp.connectHandlers.use(bot.webhookCallback(`/core/${_id}`))

    if (Meteor.isProduction) {
        // Если продакшн, то запускаем вебхук
        await bot.telegram.setWebhook(
            `${process.env.BOT_URL}/core/${_id}`,
            undefined,
            20,
            ['message', 'callback_query']
        )
        await bot.startWebhook(`${process.env.BOT_URL}/core/${_id}`)
    } else {
        // Если не продакшн, то запускаем поллинг
        await bot.telegram.deleteWebhook()
        await bot.startPolling()
    }

    // Возвращаем бота для дальнейших манипуляций
    return bot
}
