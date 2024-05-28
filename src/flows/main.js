const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const oneMessage = require("../utils/layer/oneMessage");
const alreadyClient = require("../utils/layer/alreadyClient");
const interpreterLayer = require("../utils/layer/interpreterLayer");

const mainFlow = addKeyword([EVENTS.WELCOME])
.addAction(oneMessage)
.addAction(alreadyClient)
.addAction(interpreterLayer)

module.exports = mainFlow