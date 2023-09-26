import {setupCaptchaBot} from "./Bots/BotPlatform/mtCaptchaBot";

BotsPool = {}; // {botId: bot}


Meteor.startup(async function () {

    
    Bots.remove({})
    Localisations.remove({})
    TelegramChannels.remove({})
    SmartLink.remove({})
    BotUsers.remove({})
    // Создаем тестовую локализацию
    const insertedLocaleId = Localisations.insert({
        name: 'Test',
        ...CaptchaLocale
    })
    // Создаем тестовый канал
    const insertedChannelId = TelegramChannels.insert({
        title: 'Test channel',
        link: '',
        channelId: '',
    })
    // Создаем тестового бота
    const bot = {
        token: '',
        username: 'mtCaptchaBot',
        locale: insertedLocaleId,
        channel: insertedChannelId,
    }
    bot._id = Bots.insert(bot)

    BotsPool[bot._id] = await setupCaptchaBot(bot)

    // const bot = Bots.findOne()
    // BotsPool[bot._id] = await setupCaptchalBot(bot)
})
