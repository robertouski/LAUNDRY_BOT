const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const oneMessage = require("../utils/layer/oneMessage");
const alreadyClient = require("../utils/layer/alreadyClient");
const { interpreterResponse } = require("../ai/responseIA");

const mainFlow = addKeyword(EVENTS.WELCOME)
.addAction(oneMessage)
.addAction(alreadyClient)
.addAction(async(ctx, ctxFn)=>{
  try{
    const ai = await ctxFn.extensions.ai
  const messages = ai.getHistory(ctx.from)
  console.log(messages)
  const IAinterpreter = await interpreterResponse(messages, ai)

  console.log('AIinterpreter:', IAinterpreter)
  if(IAinterpreter === 'INFORMACION'){
    return await ctxFn.flowDynamic('Dejame te proporciono INFO')
  }
  if(IAinterpreter === 'AGENDAR'){
    return await ctxFn.flowDynamic('Espera que aun no puedo AGENDAR')
  }
  if(IAinterpreter === 'AGENTE'){
    return await ctxFn.flowDynamic('Ya te paso con un AGENTE')
  }
  if(IAinterpreter === 'JESSICA'){
    return await ctxFn.flowDynamic('Soy Jessica una chica sexy')
  }
  }
  catch(error){
    console.log('Error Interpreter:', error)
  }
  }
)

module.exports = mainFlow