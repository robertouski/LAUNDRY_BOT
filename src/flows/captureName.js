const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { registerUser } = require("../utils/handler/userDataHandler");

const captureName = addKeyword(EVENTS.ACTION)
.addAction({capture: true}, async(ctx, ctxFn)=>{
await ctxFn.state.update({name: ctx.body})
const currentState = await ctxFn.state.getMyState(); 
registerUser(currentState.name, ctx.from)
await ctxFn.flowDynamic(`Perfecto! ${currentState.name} en que puedo ayudarte? 👕🫧`)
return ctxFn.endFlow()
})

module.exports = captureName