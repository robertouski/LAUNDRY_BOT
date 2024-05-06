const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { informativeResponse } = require("../ai/responseIA");
const { typing } = require("../utils/tools/typing");
const cleanResponse = require("../utils/handler/cleanResponse");

const informativeFlow = addKeyword(EVENTS.ACTION)
.addAction(async (ctx, ctxFn) => {
  try {
    const ai = await ctxFn.extensions.ai;
    const messages = ai.getHistory(ctx.from);
    const onlyOneMessage = [...messages].reverse()[0];
    console.log("onlyOneMessage:", onlyOneMessage);
    const IAinformative = await informativeResponse(onlyOneMessage, ai, ctx.from);
    typing(ctx, ctxFn)
    const cleanIAResponse = cleanResponse(IAinformative)
    await ctxFn.flowDynamic(cleanIAResponse);
  } catch (error) {
    console.log("Error on informativeFlow:", error);
  }
});

module.exports = informativeFlow