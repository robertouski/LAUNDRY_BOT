const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { freeCalendarSlots } = require("../utils/services/gcpCalendar");
const { getCurrentTime } = require("../utils/tools/currentDate");
const { scheduleResponse, scheduleDayResponse } = require("../ai/responseIA");
const { typing } = require("../utils/tools/typing");
const {
  extractDaysWithAvailableSlots,
} = require("../utils/handler/availableSlotsHandler");
const translateDateToSpanish = require("../utils/handler/dateHandler");
const { captureDate } = require("./dataRecolectFlow");

const scheduleFlow = addKeyword(EVENTS.ACTION).addAction(
  { capture: true },
  async (ctx, ctxFn) => {
    await ctxFn.state.update({ imWorking: true });
    const ai = await ctxFn.extensions.ai;
    const answer = ctx.body;
    if (answer === "CANCELAR" || answer === "cancelar") {
      return await ctxFn.endFlow(
        "Volvamoslo a intentar! En que te puedo ayudar?"
      );
    }
    console.log("answer:", answer);
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
      await ctxFn.flowDynamic(
        `Estas queriendo agendar el: ${spanishDate}, es correcto?\nPor favor, responder *SI* o *NO*`
      );
      return await ctxFn.gotoFlow(captureDate);
    } else if (IAschedule === "NO_AVAILABLE") {
      await ctxFn.fallBack(
        "Ese dia no tenemos disponible, por cierto, las reservaciones para agendar son con un maximo de una semana! 👩🏻‍💻🫧"
      );
    } else {
      await ctxFn.fallBack(
        "¿Podrías indicarme el día que deseas? ¡Si puedes decirme el día, usando el día y su número de ese dia sería genial! 🫨🫧"
      );
    }
  }
);

module.exports = scheduleFlow;