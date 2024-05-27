const { handlerMessage } = require("../../chatwoot/index");
const { enqueueMessage } = require("../handler/messageHandler");
const { isVoiceNote } = require("../validator/voiceNoteValidator");
module.exports = async (ctx, ctxFn) => {
  let userMessage;
  let body;
  const ai = await ctxFn.extensions.ai;
  const chatwoot = await ctxFn.extensions.chatwoot;
  

  try {
    await handlerMessage({
      phone: ctx.from,
      name: "Roberto Moncayo",
      message: ctx.body,
      mode: 'incoming',
      attachment: [],
    }, chatwoot);
    console.log("Finishing with handlerMessage");
  } catch (error) {
    console.error("Error during handlerMessage:", error);
  }

  // create inbox
  // try{
  //   const inboxName = `LAUNDRY CHIC BOT`;
  //   await createInbox(inboxName);
  //   await createConversation(42006, ctx.from, 'TOY VIVO')
  // }catch(error){
  //   console.log('Error al crear createInbox:', error)
  // }
  // console.log("getInboxes:", await getInboxes())
  // //

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
};
