const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { handlerMessage } = require("../chatwoot/index");

const agentFlow = addKeyword(EVENTS.ACTION).addAction(
  { capture: true },
  async (ctx, ctxFn) => {
    const chatwoot = await ctxFn.extensions.chatwoot;
    const currentState = await ctxFn.state.getMyState();
    try {
      await handlerMessage(
        {
          phone: ctx.from,
          name: currentState?.name,
          message: ctx.body,
          mode: "incoming",
          attachment: [],
        },
        chatwoot
      );
    } catch (error) {
      console.error("Error during handlerMessage:", error);
    }
  }
);

module.exports = agentFlow;
