const { interpreterResponse, aclarationResponse } = require("../../ai/responseIA");
const { typing } = require("../tools/typing");

module.exports = async(ctx, ctxFn)=>{
  try{
    const ai = await ctxFn.extensions.ai
  const messages = ai.getHistory(ctx.from)
  const IAinterpreter = await interpreterResponse(messages, ai)

  console.log('AIinterpreter:', IAinterpreter)
  if(IAinterpreter.includes('INFORMACION')){
    return await ctxFn.gotoFlow(require('../../flows/informativeFlow'))
  }
  else if(IAinterpreter.includes( 'AGENDAR')){
    return await ctxFn.gotoFlow(require('../../flows/scheduleFlow'))

  }
  else if(IAinterpreter.includes('AGENTE')){
    return await ctxFn.flowDynamic('Espera que aun no puedo AGENTE')
  }
  else if(IAinterpreter.includes('NO_SENSE')){
    const ai = await ctxFn.extensions.ai;
    const messages = ai.getHistory(ctx.from);
    const IAresponse = await aclarationResponse(messages, ai);
    typing(ctx, ctxFn)
    return await ctxFn.flowDynamic([{body:IAresponse, delay: 1000}])
  }
  }
  catch(error){
    console.log('Error Interpreter:', error)
  }
}