const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { informativeResponse } = require("../ai/responseIA");

const informativeFlow = addKeyword(EVENTS.ACTION)
.addAction(async (ctx, ctxFn) => {
  try {
    const ai = await ctxFn.extensions.ai;
    const messages = ai.getHistory(ctx.from);
    const onlyOneMessage = [...messages].reverse()[0];
    console.log("onlyOneMessage:", onlyOneMessage);
    const IAinformative = await informativeResponse(onlyOneMessage, ai, ctx.from);
    await ctxFn.flowDynamic(IAinformative);
  } catch (error) {
    console.log("Error on informativeFlow:", error);
  }
});

module.exports = informativeFlow