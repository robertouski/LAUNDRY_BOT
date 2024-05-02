const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { registerUser } = require("../layer/registerUser");

const captureName = addKeyword(EVENTS.ACTION)
.addAction({capture: true}, async(ctx, ctxFn)=>{
await ctxFn.state.update({name: ctx.body})
const currentState = await ctxFn.state.getMyState(); 
await ctxFn.flowDynamic(`Perfecto! ${currentState.name}`)
registerUser(currentState.name, ctx.from)
})

module.exports = captureName