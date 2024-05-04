const generatePromptInterpreter = require("./prompt/interpreter");

const assistantId = process.env.ASSISTANT_ID
const interpreterResponse = async (body, AIresult) => {
  try {
    const ai = AIresult;
    const PromptResponse = generatePromptInterpreter(body);
    const tmpMessages = [].concat({
      role: "system",
      content: PromptResponse,
    });
    const assistantMsg = await ai.createChat(tmpMessages);
    return String(assistantMsg);
  } catch (error) {
    console.log('ERROR', error);
  }
}
const informativeResponse = async (body, AIresult, idPhone) => {
  try {
    const ai = AIresult;
    const assistantResponse = await ai.talkToAssistant(assistantId, body);
    ai.addHistory(idPhone, {
      role: "assistant",
      content: assistantResponse,
    });
    return String(assistantResponse);
  } catch (error) {
    console.log('ERROR', error);
  }
}

module.exports = {interpreterResponse, informativeResponse}