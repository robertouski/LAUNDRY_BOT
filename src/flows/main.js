const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const oneMessage = require("../utils/layer/oneMessage");
const alreadyClient = require("../utils/layer/alreadyClient");
const interpreterLayer = require("../utils/layer/interpreterLayer");
const muteBot = require("./muteBotFlow");

const mainFlow = addKeyword([EVENTS.WELCOME])
.addAction(oneMessage)
.addAction(muteBot)
.addAction(alreadyClient)
.addAction(interpreterLayer)

module.exports = mainFlow