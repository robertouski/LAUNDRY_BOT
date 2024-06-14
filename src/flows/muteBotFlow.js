const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { isInBlackList } = require("../utils/handler/blacklistHandler.");

const muteBot = addKeyword(EVENTS.ACTION)
.addAction(async(ctx, ctxFn)=>{
  if(isInBlackList(ctx.from)){
    console.log('[BOTMUTED]')
    return await ctxFn.endFlow()
  }
  else{
    return
  }
})

module.exports= muteBot