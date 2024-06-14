const { addKeyword, EVENTS } = require("@bot-whatsapp/bot")
const { createEvent } = require("../utils/services/gcpCalendar");

const GoogleSheetService = require("../utils/services/gcpSheets");
const googleSheet = new GoogleSheetService(process.env.GOOGLE_SHEET_ID);

const scheduleDateFinalFlow = addKeyword([EVENTS.ACTION, EVENTS.LOCATION])
.addAction(async(ctx,ctxFn)=>{
  const currentState = ctxFn.state.getMyState();
  console.log('ctx:',ctx)
  if(!currentState?.cleanScheduleFlow){
    await ctxFn.endFlow([{body: 'Veo que me has enviado tu ubicación GPS, puedes consultarme lo que deseas o podemos agendar para retirar tu ropa 👩🏻‍💻', delay: 1000}])
  }
  await ctxFn.flowDynamic([{body: 'Comparteme la siguiente información para agendarte 👩🏻‍💻', delay: 1000}])
  return 
})
.addAction(async(ctx, ctxFn)=>{
  return await ctxFn.flowDynamic([{body: 'Enviame la ubicación GPS, para poder tener mas precisión al llegar! 📍', delay: 1000}])
})
.addAction({capture:true}, async(ctx, ctxFn)=>{
  await ctxFn.state.update({latitude:ctx.location.latitude, longitude:ctx.location.longitude})
  return await ctxFn.flowDynamic([{body: 'Dame una descripción del tipo de prenda o del tipo de ropa con la que trabajaremos 👕✨', delay: 1000}])
})
.addAction({capture:true}, async(ctx, ctxFn)=>{
  await ctxFn.state.update({description: ctx.body})
  const currentState = ctxFn.state.getMyState();
  console.log('currentState', currentState)
  const name = currentState.name
  const description = currentState.description
  const eventDate = currentState.iaResponseDate
  const mail = `${currentState.latitude}, ${currentState.longitude}`
  createEvent(name, description, eventDate, mail);
  await ctxFn.flowDynamic(
    `Perfecto ${name}, te registre exitosamente! Si tienes alguna pregunta adicional puedes consultarme. Ten un excelente dia 👋🏻`
  );
  return await ctxFn.endFlow()
})

module.exports = scheduleDateFinalFlow