require('dotenv').config();

const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const WebWhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp');
const MockAdapter = require('@bot-whatsapp/database/mock');
const loadFlows = require('./src/flows/index.js');
const AiService = require('./src/ai/ai.class.js');
const ServerHttp = require('./src/http/index.js');
const ChatwootService = require('./src/chatwoot/chatwoot.class.js')

const apiKey = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 3000;

const chatwootConfig = {
  account: process.env.CHATWOOT_ACCOUNT_ID,
  token: process.env.CHATWOOT_API_TOKEN,
  endpoint: process.env.CHATWOOT_API_URL_2
};

const main = async () => {
  try {
    const chatwoot = new ChatwootService(chatwootConfig)
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
        chatwoot
      },
      queue: {
        timeout: 30000,
        concurrencyLimit: 180,
      },
    };

    
    const bot = createBot(configBot, configExtra);

    bot.then(initializedBot => {
      const serverHttp = new ServerHttp(PORT, adapterProvider);
      serverHttp.initialization(initializedBot);
    }).catch(error => {
      console.log('Error during bot initialization:', error);
    });


    
  } catch (error) {
    console.log('Error found on app.js:', error);
  }
};

main();
