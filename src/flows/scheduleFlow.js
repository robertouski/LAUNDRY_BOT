const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { freeCalendarSlots } = require("../utils/services/gcpCalendar");
const { getCurrentTime } = require("../utils/tools/currentDate");
const { scheduleResponse, scheduleDayResponse } = require("../ai/responseIA");
const { typing } = require("../utils/tools/typing");
const {
  extractDaysWithAvailableSlots,
} = require("../utils/handler/availableSlotsHandler");
const { captureDate } = require("./dataRecolectFlow");
const translateDateToSpanish = require("../utils/tools/dateConverter");
const getRandomMilliseconds = require("../utils/tools/randomMilisecondNumb");

const scheduleFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, ctxFn) => {
    const MESSAGE_1 =
      "Listo, comenzamos para ir a retirar tu ropa. ¿Podrías decirme qué día tienes disponible? Atendemos de lunes a sábado  👩🏻‍💻✨";
    const MESSAGE_2 =
      'Puedes escribir *"CANCELAR"* en cualquier momento para *no continuar*';
    typing(ctx, ctxFn);
    await ctxFn.flowDynamic([
      { body: MESSAGE_1, delay: getRandomMilliseconds() },
    ]);
    typing(ctx, ctxFn);
    await ctxFn.flowDynamic([{ body: MESSAGE_2, delay: 2000 }]);
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    await ctxFn.state.update({ imWorking: true });
    const ai = await ctxFn.extensions.ai;
    const answer = ctx.body;
    if (answer === "CANCELAR" || answer === "cancelar") {
      ai.addHistory(ctx.from, {
        role: "user",
        content: answer,
      });
      ai.addHistory(ctx.from, {
        role: "assistant",
        content: "Volvamoslo a intentar! En que te puedo ayudar?",
      });
      return await ctxFn.endFlow(
        "Volvamoslo a intentar! En que te puedo ayudar?"
      );
    }
    const currentTime = getCurrentTime();
    const availableSlots = await freeCalendarSlots();
    const onlyAvailableDays = extractDaysWithAvailableSlots(availableSlots);
    const IAschedule = await scheduleDayResponse(
      answer,
      ai,
      onlyAvailableDays,
      currentTime
    );
    console.log("IAschedule:", IAschedule);
    const regex = /"?\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b \w+ \d{2} \d{4}"?/;
    const match = IAschedule.match(regex);
    typing(ctx, ctxFn);
    if (match) {
      const extractedDate = match[0].replace(/"/g, "");
      const spanishDate = translateDateToSpanish(extractedDate);
      console.log(`Fecha capturada: ${extractedDate}`);
      await ctxFn.state.update({ scheduleDate: extractedDate });
      const MESSAGE_1 = `Estas queriendo agendar el: ${spanishDate}, es correcto?\nPor favor, responder *SI* o *NO*`;
      await ctxFn.flowDynamic([{ body: MESSAGE_1, delay: 4000 }]);
      await ctxFn.state.update({ imWorking: false });
      return await ctxFn.gotoFlow(captureDate);
    } else if (IAschedule === "NO_AVAILABLE") {
      return await ctxFn.fallBack(
        "Ese dia no tenemos disponible, por cierto, las reservaciones para agendar son con un maximo de una semana! 👩🏻‍💻🫧"
      );
    } else {
      return await ctxFn.fallBack(
        "¿Podrías indicarme el día que deseas? ¡Si puedes decirme el día, usando el día y su número de ese dia sería genial! 🫨🫧"
      );
    }
  });

module.exports = scheduleFlow;
