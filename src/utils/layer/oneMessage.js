const { enqueueMessage } = require("../handler/messageHandler")
const { createInbox, createConversation, getInboxes } = require("../services/chatwootService")
const { isVoiceNote } = require("../validator/voiceNoteValidator")
module.exports = async(ctx, ctxFn) => {
  let userMessage 
  let body
  const ai = ctxFn.extensions.ai;
  const chatwoot = ctxFn.extensions.chatwoot;
  console.log("chatwoot on extensions", chatwoot);

  try {
    const inbox = await chatwoot.findOrCreateInbox({ name: 'LAUNDRY CHIC BOT' });
    console.log('Inbox:', inbox);
  } catch (error) {
    console.error('Error during findOrCreateInbox:', error);
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