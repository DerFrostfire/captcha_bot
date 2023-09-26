import globalBot from './global'
import { Stage } from 'telegraf'
import agreement from './agreement.scene'
import captchaScene from './captcha.scene'

export default (bot) => {
    const stage = new Stage(
        [agreement, captchaScene],
        {
            ttl: 604_800,
        }
    )
    bot.use(stage.middleware())
    bot.use(globalBot)
}
