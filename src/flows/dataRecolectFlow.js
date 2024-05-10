const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { registerUser } = require("../utils/handler/userDataHandler");
const { typing } = require("../utils/tools/typing");
const { scheduleHourResponse } = require("../ai/responseIA");
const { getCurrentTime } = require("../utils/tools/currentDate");
const { freeCalendarSlots } = require("../utils/services/gcpCalendar");
const { availableSlotsHandler } = require("../utils/handler/availableSlotsHandler");
const scheduleDateFinalFlow = require("./finalFlowResults");

const captureName = addKeyword(EVENTS.ACTION).addAction(
  { capture: true },
  async (ctx, ctxFn) => {
    const ai = await ctxFn.extensions.ai;
    await ctxFn.state.update({ name: ctx.body });
    ai.addHistory(ctx.from, {
      role: "user",
      content: ctx.body,
    });
    const currentState = await ctxFn.state.getMyState();
    registerUser(currentState.name, ctx.from);
    typing(ctx, ctxFn);
    const MESSAGE = `Perfecto! ${currentState.name} en que puedo ayudarte? 👕🫧`;
    await ctxFn.flowDynamic([{ body: MESSAGE, delay: 1000 }]);
    ai.addHistory(ctx.from, {
      role: "assistant",
      content: MESSAGE,
    });
    return ctxFn.endFlow();
  }
);

const captureDate = addKeyword(EVENTS.ACTION).addAction(
  { capture: true },
  async (ctx, ctxFn) => {
    const userAnswer = ctx.body;
    if (userAnswer === "SI" || userAnswer === "si" || userAnswer === "Si") {
      await ctxFn.flowDynamic(
        "Perfecto! Podrias decirme la hora que deseas? Atendemos de 8 AM hasta las 4 PM 👩🏻‍💻🫧"
      );
      await ctxFn.flowDynamic('Puedes escribir *"CANCELAR"* en cualquier momento para *no continuar*')
      return
    } else if (
      userAnswer === "NO" ||
      userAnswer === "no" ||
      userAnswer === "No"
    ) {
      await ctxFn.flowDynamic(
        "Entiendo, volvamos a intentarlo. Me ayudarías bastante si también me das el día que quieres con el número del día 👩🏻‍💻🫧"
      );
      await ctxFn.gotoFlow(require("./scheduleFlow"));
    } else {
      return await ctxFn.fallBack(
        "Por favor, solo respondeme con un *SI* o un *NO* 👩🏻‍💻🫧"
      );
    }
  }
)
.addAction({capture: true}, async(ctx, ctxFn) => {
  const currentState = ctxFn.state.getMyState();
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
  const userAvailableDay = await currentState?.scheduleDate
  const availableTime = await availableSlotsHandler(availableSlots, userAvailableDay);
  console.log('availableTime:',  availableTime)
  const IAschedule = await scheduleHourResponse(
    answer,
    ai,
    availableTime,
    currentTime
  );
  console.log("IAschedule:", IAschedule);
  await ctxFn.state.update({iaResponseDate: IAschedule })
  await ctxFn.gotoFlow(scheduleDateFinalFlow)
})

module.exports = { captureName, captureDate };
