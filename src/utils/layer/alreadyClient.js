const { checkUser } = require('../handler/userDataHandler')

module.exports = async (ctx, ctxFn) => {

  const userExists = await checkUser(ctx)
  console.log('userExists', userExists)
  if(!userExists){
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
  return await ctxFn.gotoFlow(require('../../flows/captureName'))
  }
  return
//   else{
//     const MESSAGE = `Hola , en que te puedo ayudarte? 👕🫧 `
//     const ai = await ctxFn.extensions.ai;
//     ai.addHistory(ctx.from, {
//       role: "assistant",
//       content: MESSAGE,
//     });

//     await ctxFn.flowDynamic([
//       {
//         body: MESSAGE,
//         delay: 1000,
//       },
//     ]);
//     await ctxFn.state.update({initDone: true})
//   }
// }
}