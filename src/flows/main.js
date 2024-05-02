const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const {checkUser} = require("../layer/registerUser");

const mainFlow = addKeyword(EVENTS.WELCOME)
.addAction(
  async (ctx, ctxFn) => {

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
    return await ctxFn.gotoFlow(require('./captureName'))
    }
    else{
      await ctxFn.flowDynamic([
        {
          body: 'Quer?!?!!',
          delay: 1000,
        },
      ]);
    }
  //   if(userExists){
  //     const MESSAGE = 'Bienvenido a Lavanderia: Aroma Limpio 🫧'
  //     const MESSAGE_2 = 'Soy Jessica la asistente IA 👩🏻‍💻, estoy lista para atender cualquier duda que tengas o agendar tu registro'
  //     await ctxFn.flowDynamic([
  //       {
  //         body: MESSAGE_2,
  //         delay: 1000,
  //       },
  //     ]);
  //   }
    
  //   const MESSAGE_2 = 'Soy Jessica la asistente IA 👩🏻‍💻, estoy lista para atender cualquier duda que tengas o agendar tu registro'
    
    
  }
)

module.exports = mainFlow