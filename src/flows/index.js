const captureName = require('./captureName.js')
const informativeFlow = require('./informativeFlow.js')
const mainFlow = require('./main.js')


const loadFlows = [
  mainFlow,
  captureName,
  informativeFlow
]

module.exports = loadFlows