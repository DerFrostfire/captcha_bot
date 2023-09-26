import { BaseScene, Markup } from 'telegraf'
import { sleep } from '../utils/sleep'

const agreement = new BaseScene('agreement')

const agreementKeyboard = (ctx) => {
    return Markup.inlineKeyboard([
        [Markup.callbackButton(ctx.loc._('START_GENERATING'), 'agree')],
    ])
}

agreement.enter(async (ctx) => {
    await ctx.replyWithHTML(
        ctx.loc._('AGREEMENT', ctx.session.first_name),
        {reply_markup: agreementKeyboard(ctx),}
    )
})

agreement.action('agree', async (ctx) => {
    try {
        await ctx.deleteMessage()
    } catch (e) {}

    ctx.session.agreement = true
    await sleep(1_000)
    await ctx.scene.enter('captchaScene')
})

export default agreement
