const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const WebWhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp')
const MockAdapter = require('@bot-whatsapp/database/mock')
const loadFlows = require('./src/flows')

const PORT = process.env.PORT || 3000
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow(loadFlows)
    const adapterProvider = createProvider(WebWhatsappProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb(PORT)
}

main()
