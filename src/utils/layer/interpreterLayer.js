const {
  interpreterResponse,
  aclarationResponse,
} = require("../../ai/responseIA");
const { addToBlackList } = require("../handler/blacklistHandler.");
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
      await ctxFn.flowDynamic(
        "Pronto un agente se contactara contigo! Por favor escribenos y detallanos lo que sucede para una mejor atención! 👩🏻‍💻✨"
      );
      return await ctxFn.gotoFlow(require("../../flows/agentFlow"));
    } else if (IAinterpreter.includes("NO_SENSE")) {
      await ai.clearByFrom(ctx.from);
      const IAresponse = await aclarationResponse(messages, ai);
      typing(ctx, ctxFn);
      return await ctxFn.flowDynamic([{ body: IAresponse, delay: 1000 }]);
    }
  } catch (error) {
    console.log("Error Interpreter:", error);
  }
};
