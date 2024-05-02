require('dotenv').config()

const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const WebWhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp')
const MockAdapter = require('@bot-whatsapp/database/mock')

const loadFlows = require('./src/flows')
const AiService = require ('./src/ai/ai.class.js')

const apiKey= process.env.OPENAI_API_KEY
const PORT = process.env.PORT || 3000
const main = async () => {
    try{

        const ai = new AiService(apiKey);
        ai.on("gas_token", () => {});

        const adapterDB = new MockAdapter()
        const adapterFlow = createFlow(loadFlows)
        const adapterProvider = createProvider(WebWhatsappProvider)
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
						concurrencyLimit: 180
					}
				};
		
        await createBot(configBot, configExtra)
    
        await QRPortalWeb(PORT)
    }catch(error){

    }

}

main()