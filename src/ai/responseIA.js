const generatePromptInterpreter = require("./prompt/interpreter");
const {generatePromptSchedule, generatePromptScheduleInterpreter} = require("./prompt/schedule");

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

const scheduleResponse = async (body, AIresult, availableDays, currentDate) => {
  try {
    const ai = AIresult;
    const PromptResponse = generatePromptSchedule(body, availableDays, currentDate);
    const tmpMessages = [].concat({
      role: "system",
      content: PromptResponse,
    });
    const assistantMsg = await ai.createChat(tmpMessages);
    return String(assistantMsg);
  } catch (error) {
    console.log("ERROR", error);
  }
};
const scheduleDayResponse = async (body, AIresult, availableDays, currentDate) => {
  try {
    const ai = AIresult;
    const PromptResponse = generatePromptScheduleInterpreter(body, availableDays, currentDate);
    const tmpMessages = [].concat({
      role: "system",
      content: PromptResponse,
    });
    const assistantMsg = await ai.createChat(tmpMessages, 'gpt-4');
    return String(assistantMsg);
  } catch (error) {
    console.log("ERROR", error);
  }
};


module.exports = {
  interpreterResponse,
  informativeResponse,
  scheduleResponse,
  scheduleDayResponse,
};