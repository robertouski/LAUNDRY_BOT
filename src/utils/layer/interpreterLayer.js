const { interpreterResponse } = require("../../ai/responseIA");

module.exports = async(ctx, ctxFn)=>{
  try{
    const ai = await ctxFn.extensions.ai
  const messages = ai.getHistory(ctx.from)
  console.log("getHistory:", messages)
  const IAinterpreter = await interpreterResponse(messages, ai)

  console.log('AIinterpreter:', IAinterpreter)
  if(IAinterpreter === 'INFORMACION'){
    return await ctxFn.flowDynamic('Dejame te proporciono INFO')
  }
  if(IAinterpreter === 'AGENDAR'){
    return await ctxFn.flowDynamic('Espera que aun no puedo AGENDAR')
  }
  if(IAinterpreter === 'AGENTE'){
    return await ctxFn.flowDynamic('Espera que aun no puedo AGENTE')
  }
  if(IAinterpreter === 'JESSICA'){
    return await ctxFn.flowDynamic('Espera que aun no puedo ponerte a Jessica')
  }
  }
  catch(error){
    console.log('Error Interpreter:', error)
  }
  }