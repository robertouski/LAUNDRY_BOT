const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { registerUser } = require("../utils/handler/userDataHandler");
const { typing } = require("../utils/tools/typing");

const captureName = addKeyword(EVENTS.ACTION)
.addAction({capture: true}, 
  async(ctx, ctxFn)=>{
    const ai = await ctxFn.extensions.ai
    await ctxFn.state.update({name: ctx.body})
    ai.addHistory(ctx.from, {
      role: "user",
      content: ctx.body,
    });
    const currentState = await ctxFn.state.getMyState(); 
    registerUser(currentState.name, ctx.from)
    typing(ctx, ctxFn)
    const MESSAGE = `Perfecto! ${currentState.name} en que puedo ayudarte? 👕🫧`
    await ctxFn.flowDynamic([{body: MESSAGE, delay: 1000}])
    ai.addHistory(ctx.from, {
      role: "assistant",
      content: MESSAGE,
    });
    return ctxFn.endFlow()
  }
)


const captureDate = addKeyword(EVENTS.ACTION)
.addAction({capture:true}, async(ctx, ctxFn) => {
  const currentState = ctxFn.state.getMyState();
  const userAnswer = ctx.body
  
})

module.exports = 

module.exports = {captureName, captureDate}