const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { createEvent } = require("../utils/services/gcpCalendar");

const GoogleSheetService = require("../utils/services/gcpSheets");
const { typing } = require("../utils/tools/typing");
const googleSheet = new GoogleSheetService(process.env.GOOGLE_SHEET_ID);

const scheduleDateFinalFlow = addKeyword([EVENTS.ACTION])
  .addAction(async (ctx, ctxFn) => {
    const currentState = ctxFn.state.getMyState();
    if (!currentState?.cleanScheduleFlow) {
      await ctxFn.endFlow([
        {
          body: "Veo que me has enviado tu ubicación GPS, puedes consultarme lo que deseas o podemos agendar para retirar tu ropa 👩🏻‍💻",
          delay: 2000,
        },
      ]);
    }
    typing(ctx, ctxFn);
    await ctxFn.flowDynamic([
      {
        body: "Comparteme la siguiente información para agendarte 👩🏻‍💻",
        delay: 1000,
      },
    ]);
    return;
  })
  .addAction(async (ctx, ctxFn) => {
    typing(ctx, ctxFn);
    return await ctxFn.flowDynamic([
      {
        body: "Escribeme tu ubicación (dame instrucciones de como llegar) o mandame tu ubicación GPS 📍",
        delay: 2000,
      },
    ]);
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    console.log("ctx:", ctx);
    if (ctx.location) {
      await ctxFn.state.update({
        latitude: ctx.location.latitude,
        longitude: ctx.location.longitude,
      });
    } else {
      await ctxFn.state.update({ location: ctx.body });
    }
    typing(ctx, ctxFn);
    return await ctxFn.flowDynamic([
      {
        body: "Dame una descripción del tipo de prenda o del tipo de ropa con la que trabajaremos 👕✨",
        delay: 2000,
      },
    ]);
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    await ctxFn.state.update({ description: ctx.body });
    let location
    const currentState = ctxFn.state.getMyState();
    const name = currentState.name;
    const description = currentState.description;
    const eventDate = currentState.iaResponseDate;
    if (currentState.latitude && currentState.longitude) {
      location = `${currentState.latitude}, ${currentState.longitude}`;
    } else {
      location = currentState.location;
    }
    createEvent(name, description, eventDate, location);
    typing(ctx, ctxFn);
    await ctxFn.flowDynamic([
      {
        body: `Perfecto ${name}, te registre exitosamente! Si tienes alguna pregunta adicional puedes consultarme. Ten un excelente dia 👋🏻`,
        delay: 2000,
      },
    ]);

    return await ctxFn.endFlow();
  });

module.exports = scheduleDateFinalFlow;
