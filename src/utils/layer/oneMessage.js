const { handlerMessage } = require("../../chatwoot/index");
const { isInBlackList } = require("../handler/blacklistHandler.");
const { enqueueMessage } = require("../handler/messageHandler");
const { isVoiceNote } = require("../validator/voiceNoteValidator");
module.exports = async (ctx, ctxFn) => {
  let userMessage;
  let body;
  const ai = await ctxFn.extensions.ai;
  const chatwoot = await ctxFn.extensions.chatwoot;
  const currentState = await ctxFn.state.getMyState();
  if(isInBlackList(ctx.from)){
    try {
      return await handlerMessage({
        phone: ctx.from,
        name: currentState?.name,
        message: ctx.body,
        mode: 'incoming',
        attachment: [],
      }, chatwoot);
    } catch (error) {
      console.error("Error during handlerMessage-OneMessage:", error);
    }
  }

  if (isVoiceNote(ctx.body)) {
    return await ctxFn.fallBack(
      "Por ahora no puedo escuchar tus mensajes de voz, escribemelo por favor"
    );
  } else {
    userMessage = ctx.body;
  }

  body = await enqueueMessage(ctx.from, userMessage);

  ai.addHistory(ctx.from, {
    role: "user",
    content: body,
  });
  console.log(`[USER], [${ctx.from}]:`, body);
  return
};
