const { captureName } = require('../../flows/dataRecolectFlow')
const { typing } = require('../tools/typing')

const GoogleSheetService = require('../services/gcpSheets')
const googleSheetService  = new GoogleSheetService(process.env.GOOGLE_SHEET_ID)

module.exports = async (ctx, ctxFn) => {
  const userData = await googleSheetService.getClientInfoByNumber(ctx.from)
  const currentState = await ctxFn.state.getMyState();
  const chatwoot = await ctxFn.extensions.chatwoot;
  const contact = await chatwoot.findContact(
    ctx.from
  );
  console.log('contact en alreadyClient:', contact)
  if (!contact) throw new Error("Failed to find or create contact");
  console.log('userData:', userData)
  if(!userData && !currentState?.name && !contact){
  const ai = await ctxFn.extensions.ai

    const MESSAGE = 'Bienvenido a Lavanderia CHIC 🫧'
    const MESSAGE_2 = '¿Cuál es tu nombre y apellido?'
    typing(ctx,ctxFn)
    await ctxFn.flowDynamic([
      {
        body: MESSAGE,
        delay: 1000,
      },
    ])
    
    typing(ctx,ctxFn)
    await ctxFn.flowDynamic([
      {
        body: MESSAGE_2,
        delay: 500,
      },
    ]);
    ai.addHistory(ctx.from, {
      role: "assistant",
      content: MESSAGE + MESSAGE_2,
    });
  return await ctxFn.gotoFlow(captureName)
  }
  if(contact ||  userData){
    await ctxFn.state.update({ name: contact?.name || userData?.name });
    return
  }
}

  return

