const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { typing } = require("../utils/tools/typing");
const cleanResponse = require("../utils/handler/cleanResponse");
const { informativeResponse } = require("../ai/responseIA");
const getRandomMilliseconds = require("../utils/tools/randomMilisecondNumb");

const informativeFlow = addKeyword(EVENTS.ACTION)
.addAction(async (ctx, ctxFn) => {
  try {
    const ai = await ctxFn.extensions.ai;
    const messages =  await generateConversation(await ai.getHistory(ctx.from));
    const IAinformative = await informativeResponse(messages, ai, ctx.from);
    typing(ctx, ctxFn)
    const cleanIAResponse = cleanResponse(IAinformative)
    await ctxFn.flowDynamic([{body:cleanIAResponse, delay: getRandomMilliseconds()}]);
  } catch (error) {
    console.log("Error on informativeFlow:", error);
  }
});


const generateConversation = (history) => {
  const parseTxt = [...history].reverse();
  const tmp = [];

  for (let index = 0; index < 6; index++) {
    const element = parseTxt[index];
    if (element?.role === "assistant"){
      tmp.push(`J:{${element.content}}`)
    }
    if (element?.role === "user"){
      tmp.push(`U:{${element.content}}`);
    }
  }

  return fullTxt = tmp.reverse().join("\n");

}
module.exports = informativeFlow