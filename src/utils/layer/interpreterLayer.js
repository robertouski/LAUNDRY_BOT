const {
  interpreterResponse,
  aclarationResponse,
} = require("../../ai/responseIA");
const { handlerMessage } = require("../../chatwoot/index");
const { addToBlackList } = require("../handler/blacklistHandler.");
const getRandomMilliseconds = require("../tools/randomMilisecondNumb");
const { typing } = require("../tools/typing");

module.exports = async (ctx, ctxFn) => {
  try {
    const ai = await ctxFn.extensions.ai;
    const messages = ai.getHistory(ctx.from);
    const IAinterpreter = await interpreterResponse(messages, ai);

    console.log(`AIinterpreter-[${ctx.from}]:`, IAinterpreter);
    if (IAinterpreter.includes("INFORMACION")) {
      return await ctxFn.gotoFlow(require("../../flows/informativeFlow"));
    } else if (IAinterpreter.includes("AGENDAR")) {
      await ai.clearByFrom(ctx.from);
      return await ctxFn.gotoFlow(require("../../flows/scheduleFlow"));
    } else if (IAinterpreter.includes("AGENTE")) {
      await ai.clearByFrom(ctx.from);
      addToBlackList(ctx.from);
      const MESSAGE = "Pronto un agente se contactara contigo! Por favor escribenos y detallanos lo que sucede para una mejor atención! 👩🏻‍💻✨"
      await ctxFn.flowDynamic([{body: MESSAGE, delay: getRandomMilliseconds()}]);
      const chatwoot = await ctxFn.extensions.chatwoot;
      const currentState = await ctxFn.state.getMyState();
        await handlerMessage(
          {
            phone: ctx.from,
            name: currentState?.name,
            message: MESSAGE,
            mode: "outgoing",
            attachment: [],
          },
          chatwoot
        );
      return await ctxFn.gotoFlow(require("../../flows/agentFlow"));
    } else if (IAinterpreter.includes("NO_SENSE")) {
      await ai.clearByFrom(ctx.from);
      const IAresponse = await aclarationResponse(messages, ai);
      typing(ctx, ctxFn);
      return await ctxFn.flowDynamic([{ body: IAresponse, delay: getRandomMilliseconds() }]);
    }
  } catch (error) {
    console.log("Error Interpreter:", error);
  }
};
