const agentFlow = require('./agentFlow.js')
const { captureName, captureDate } = require('./dataRecolectFlow.js')
const scheduleDateFinalFlow = require('./finalFlowResults.js')
const informativeFlow = require('./informativeFlow.js')
const mainFlow = require('./main.js')
const scheduleFlow = require('./scheduleFlow.js')


const loadFlows = [
  mainFlow,
  captureName,
  informativeFlow,
  scheduleFlow,
  captureDate,
  scheduleDateFinalFlow,
  agentFlow
]

module.exports = loadFlows