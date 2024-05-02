const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const oneMessage = require("../utils/layer/oneMessage");
const alreadyClient = require("../utils/layer/alreadyClient");

const mainFlow = addKeyword(EVENTS.WELCOME)
.addAction(oneMessage)
.addAction(alreadyClient)
.addAction(async(ctx, ctxFn)=>{
  
  }
)

module.exports = mainFlow