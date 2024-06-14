const assistantHandler = async(message, ai)=>{
const assistantId = await ai.findOrCreateAssistant('ASSISTANT_CHIC')
const assistantResponse = await ai.talkToAssistant(assistantId, message)
return assistantResponse
}
module.exports = assistantHandler