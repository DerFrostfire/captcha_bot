import { BaseScene, Markup } from 'telegraf'
import captcha from 'trek-captcha'


const captchaScene = new BaseScene('captchaScene')

const captchaKeyboard = (ctx) => {
    return Markup.inlineKeyboard([
        [Markup.callbackButton(ctx.loc._('BTN_REFRESH'), 'newCaptcha')],
    ])
}

const failedCaptchaKeyboard = (ctx) => {
    return Markup.inlineKeyboard([
        [Markup.callbackButton(ctx.loc._('START_GENERATING'), 'newCaptcha')],
    ])
}

captchaScene.enter(async ctx => {
    const {buffer, token} = await captcha()
    ctx.session.captchaToken = token
    console.log(ctx.session.captchaToken)
    await ctx.replyWithPhoto({
        source: buffer
    },{
        caption: 'Введите код с картинки',
        reply_markup: captchaKeyboard(ctx)
    })
    
})

captchaScene.action('newCaptcha', async (ctx) => {
    try {
        await ctx.deleteMessage()
    } catch (e) {}
    
    const {buffer, token} = await captcha()
    ctx.session.captchaToken = token

    console.log(ctx.session.captchaToken)

    await ctx.replyWithPhoto({
        source: buffer
    },{
        caption: 'Введите код с картинки',
        reply_markup: captchaKeyboard(ctx)
    })
})

captchaScene.on('text', async (ctx) => {
    const text = ctx.message.text
    const captchaToken = ctx.session.captchaToken

    console.log(text, captchaToken)

    if (text == captchaToken){
        ctx.reply(ctx.loc._('PASSED_CAPTCHA'))
    }
    else{
        ctx.reply(ctx.loc._('FAILED_CAPTCHA'), {
            reply_markup: failedCaptchaKeyboard(ctx)
        })

    }
})

export default captchaScene