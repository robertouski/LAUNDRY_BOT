const { addKeyword, EVENTS } = require("@bot-whatsapp/bot")
const { createEvent } = require("../utils/services/gcpCalendar")


const scheduleDateFinalFlow = addKeyword(EVENTS.ACTION)
.addAction(async(_,ctxFn)=>{
  await ctxFn.flowDynamic('Comparteme la siguiente información para agendarte 👩🏻‍💻')
  return await ctxFn.flowDynamic([{body: 'Nombre y apellido, por favor', delay: 1000}])
})
.addAction({capture:true}, async(ctx, ctxFn)=>{
  await ctxFn.state.update({name: ctx.body})
  return await ctxFn.flowDynamic([{body: 'Cuál es tu dirección? si me puedes entregar algun detalle de la zona, mejor! 📍', delay: 1000}])
})
.addAction({capture:true}, async(ctx, ctxFn)=>{
  await ctxFn.state.update({ubication: ctx.body})
  return await ctxFn.flowDynamic([{body: 'Dame una descripción del tipo de prenda o del tipo de ropa con la que trabajaremos 👕✨', delay: 1000}])
})
.addAction({capture:true}, async(ctx, ctxFn)=>{
  await ctxFn.state.update({description: ctx.body})
  const currentState = ctxFn.state.getMyState();
  const name= currentState.name
  const description = currentState.description
  const eventDate = currentState.iaResponseDate
  const mail = currentState.ubication
  createEvent(name, description, eventDate, mail);
  await ctxFn.flowDynamic(
    `Perfecto ${name}, te registre exitosamente! Si tienes alguna pregunta adicional puedes consultarme. Ten un excelente dia 👋🏻`
  );
  return await ctxFn.endFlow()
})

module.exports = scheduleDateFinalFlow