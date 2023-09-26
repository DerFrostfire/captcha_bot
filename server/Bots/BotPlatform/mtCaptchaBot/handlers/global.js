import { Composer } from 'telegraf'


let globalBot = new Composer()

globalBot.start(async (ctx) => {
    if (ctx.session.agreement) {
        try {
            if (ctx.session.wordMessageId) {
                await ctx.deleteMessage(ctx.session.wordMessageId)
                delete ctx.session.wordMessageId
            }
            if (ctx.session.counterMessageId) {
                await ctx.deleteMessage(ctx.session.counterMessageId)
                delete ctx.session.counterMessageId
            }
        } catch (e) {}
        await ctx.scene.enter('captchaScene')
    }
    await BotUsers.update(
        { id: ctx.from.id, bot: ctx.botObject._id },
        { $set: { id: ctx.from.id, bot: ctx.botObject._id } },
        { upsert: true }
    )
    ctx.session = {
        ...ctx.session,
        ...ctx.from,
        captchaToken: '',
    }

    await ctx.scene.enter('agreement')
    })

export default globalBot
