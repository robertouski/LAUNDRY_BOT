require('dotenv').config();

const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const WebWhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp');
const MockAdapter = require('@bot-whatsapp/database/mock');
const loadFlows = require('./src/flows');
const AiService = require('./src/ai/ai.class.js');
const ServerHttp = require('./src/http/index.js');

const apiKey = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 4000;

const main = async () => {
  try {
    const ai = new AiService(apiKey);
    ai.on("gas_token", () => {});
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow(loadFlows);
    const adapterProvider = createProvider(WebWhatsappProvider);

    const configBot = {
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    };

    const configExtra = {
      extensions: {
        ai,
      },
      queue: {
        timeout: 30000,
        concurrencyLimit: 180,
      },
    };

    createBot(configBot, configExtra);

    const serverHttp = new ServerHttp(PORT, adapterProvider);

    // Inicializar el servidor HTTP
    serverHttp.initialization();
  } catch (error) {
    console.log('Error found on app.js:', error);
  }
};

main();
