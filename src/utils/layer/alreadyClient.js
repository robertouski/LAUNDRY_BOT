const { captureName } = require('../../flows/dataRecolectFlow')
const { typing } = require('../tools/typing')

const GoogleSheetService = require('../services/gcpSheets')
const googleSheetService  = new GoogleSheetService(process.env.GOOGLE_SHEET_ID)

module.exports = async (ctx, ctxFn) => {
  const userData = await googleSheetService.getClientInfoByNumber(ctx.from)
  const currentState = await ctxFn.state.getMyState();
  console.log('userData:', userData)
  console.log('currentState.name:', currentState?.name)
  if(!userData && !currentState?.name){
  const ai = await ctxFn.extensions.ai

    const MESSAGE = 'Bienvenido a Lavanderia: Aroma Limpio 🫧'
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
        delay: 1000,
      },
    ]);
    ai.addHistory(ctx.from, {
      role: "assistant",
      content: MESSAGE + MESSAGE_2,
    });
  return await ctxFn.gotoFlow(captureName)
  }
}
  return

