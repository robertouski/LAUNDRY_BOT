const { interpreterResponse, aclarationResponse } = require("../../ai/responseIA");
const { createInbox } = require("../services/chatwootService");
const { typing } = require("../tools/typing");

module.exports = async(ctx, ctxFn)=> {
  try{
    const ai = await ctxFn.extensions.ai
  const messages = ai.getHistory(ctx.from)
  const IAinterpreter = await interpreterResponse(messages, ai)

  console.log('AIinterpreter:', IAinterpreter)
  if(IAinterpreter.includes('INFORMACION')){
    return await ctxFn.gotoFlow(require('../../flows/informativeFlow'))
  }
  else if(IAinterpreter.includes('AGENDAR')){
    return await ctxFn.gotoFlow(require('../../flows/scheduleFlow'))

  }
  if (IAinterpreter.includes('AGENTE')) {
    const inboxName = `Inbox for ${ctx.from}`;
    try {
      const inbox = await createInbox(inboxName);
      console.log('Inbox created:', inbox);
      return await ctxFn.flowDynamic('Un agente se pondrá en contacto contigo pronto. Hasta entonces escribeme una descripción de lo que sucede para que se atienda de la mejora manera 👩🏻‍💻🫧');
    } catch (error) {
      console.error('Error creating inbox:', error);
      return await ctxFn.flowDynamic('Hubo un error al crear el inbox para el agente.');
    }
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