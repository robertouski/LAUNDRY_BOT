
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { handlerMessage } = require("../chatwoot");

const agentFlow = addKeyword(EVENTS.ACTION).addAction(async(ctx, ctxFn)=>{
  const chatwoot = await ctxFn.extensions.chatwoot;
  const currentState = await ctxFn.state.getMyState();
  try {
    await handlerMessage({
      phone: ctx.from,
      name: 'Roberto Moncayo',
      message: ctx.body,
      mode: 'outgoing',
      attachment: [],
    }, chatwoot);
    console.log("Finishing with handlerMessage");
  } catch (error) {
    console.error("Error during handlerMessage:", error);
  }
})

module.exports = agentFlow
