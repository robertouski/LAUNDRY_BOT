const { captureName, captureDate } = require('./dataRecolectFlow.js')
const informativeFlow = require('./informativeFlow.js')
const mainFlow = require('./main.js')
const scheduleFlow = require('./scheduleFlow.js')


const loadFlows = [
  mainFlow,
  captureName,
  informativeFlow,
  scheduleFlow,
  captureDate
]

module.exports = loadFlows