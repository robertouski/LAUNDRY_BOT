const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const mainFlow = addKeyword(EVENTS.WELCOME)
.addAction(async(ctx, ctxFn)=>{
  const MESSAGE = 'Im alive'
  await ctxFn.flowDynamic(MESSAGE)
})

module.exports = mainFlow