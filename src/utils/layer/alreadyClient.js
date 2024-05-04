const { checkUser } = require('../handler/userDataHandler')

module.exports = async (ctx, ctxFn) => {
  const userExists = await checkUser(ctx)
  console.log('userExists', userExists)
  if(!userExists){
  const ai = await ctxFn.extensions.ai

    const MESSAGE = 'Bienvenido a Lavanderia: Aroma Limpio 🫧'
    const MESSAGE_2 = '¿Cuál es tu nombre?'
    await ctxFn.flowDynamic([
      {
        body: MESSAGE,
        delay: 1000,
      },
    ])

    await ctxFn.flowDynamic([
      {
        body: MESSAGE_2,
        delay: 1000,
      },
    ]);
    ai.addHistory(ctx.from, {
      role: "assistant",
      content: MESSAGE + MESSAGE_2,
    });
  return await ctxFn.gotoFlow(require('../../flows/captureName'))
  }
}
  return

