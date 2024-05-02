const { enqueueMessage } = require("../handler/messageHandler")
const { isVoiceNote } = require("../validator/voiceNoteValidator")
module.exports = async(ctx, ctxFn) => {
  let userMessage 
  let body

  if(isVoiceNote(ctx.body)){
    return await ctxFn.fallBack('Por ahora no puedo escuchar tus mensajes de voz, escribemelo por favor')
  }
  else{
    userMessage = ctx.body  
  }

    body = await enqueueMessage(ctx.from, userMessage)
    console.log(`[USER], [${ctx.from}]:`, body)
    return await ctxFn.state.update({ answer: body });
  }