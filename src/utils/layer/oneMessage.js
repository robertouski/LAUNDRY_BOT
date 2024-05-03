const { enqueueMessage } = require("../handler/messageHandler")
const { isVoiceNote } = require("../validator/voiceNoteValidator")
module.exports = async(ctx, ctxFn) => {
  let userMessage 
  let body
  const ai = await ctxFn.extensions.ai

  if(isVoiceNote(ctx.body)){
    return await ctxFn.fallBack('Por ahora no puedo escuchar tus mensajes de voz, escribemelo por favor')
  }
  else{
    userMessage = ctx.body  
  }

    body = await enqueueMessage(ctx.from, userMessage)

    ai.addHistory(ctx.from, {
      role: "user",
      content: body,
    });
    console.log(`[USER], [${ctx.from}]:`, body)

  }