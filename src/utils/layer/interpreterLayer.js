const { interpreterResponse } = require("../../ai/responseIA");

module.exports = async(ctx, ctxFn)=>{
  try{
    const ai = await ctxFn.extensions.ai
  const messages = ai.getHistory(ctx.from)
  console.log("getHistory:", messages)
  const IAinterpreter = await interpreterResponse(messages, ai)

  console.log('AIinterpreter:', IAinterpreter)
  if(IAinterpreter.includes('INFORMACION')){
    return await ctxFn.gotoFlow(require('../../flows/informativeFlow'))
  }
  if(IAinterpreter.includes( 'AGENDAR')){
    await ctxFn.flowDynamic('¿Podrías decirme qué día tienes disponible? Atendemos de Lunes a Viernes a partir de las 8 AM👩🏻‍💻✨')
    await ctxFn.flowDynamic('Puedes escribir *"CANCELAR"* en cualquier momento para *no continuar*')
    return await ctxFn.gotoFlow(require('../../flows/scheduleFlow'))

  }
  if(IAinterpreter.includes('AGENTE')){
    return await ctxFn.flowDynamic('Espera que aun no puedo AGENTE')
  }
  if(IAinterpreter.includes('JESSICA')){
    return await ctxFn.flowDynamic('Espera que aun no puedo ponerte a Jessica')
  }
  }
  catch(error){
    console.log('Error Interpreter:', error)
  }
  }