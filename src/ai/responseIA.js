const generatePromptAclaration = require("./prompt/aclaration");
const generatePromptInterpreter = require("./prompt/interpreter");
const {
  generatePromptSchedule,
  generatePromptScheduleDayInterpreter,
  generatePromptScheduleHourInterpreter,
} = require("./prompt/schedule");

const assistantHandler = require("../ai/handler/assistantHandler");

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
    console.log("ERROR", error);
  }
};
const aclarationResponse = async (body, AIresult) => {
  try {
    const ai = AIresult;
    const PromptResponse = generatePromptAclaration(body);
    const tmpMessages = [].concat({
      role: "system",
      content: PromptResponse,
    });
    const assistantMsg = await ai.createChat(tmpMessages,  'gpt-3.5-turbo-16k', 1 );
    await ai.clearHistory();
    return String(assistantMsg.replace('J:', ''));
  } catch (error) {
    console.log("ERROR", error);
  }
};
const informativeResponse = async (body, AIresult, idPhone) => {
  try {
    const ai = AIresult;
    const assistantResponse = await assistantHandler(body, ai);
    ai.addHistory(idPhone, {
      role: "assistant",
      content: assistantResponse,
    });
    return String(assistantResponse);
  } catch (error) {
    console.log("ERROR", error);
  }
};

const scheduleResponse = async (body, AIresult, availableDays, currentDate) => {
  try {
    const ai = AIresult;
    const PromptResponse = generatePromptSchedule(
      body,
      availableDays,
      currentDate
    );
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
const scheduleDayResponse = async (
  body,
  AIresult,
  availableDays,
  currentDate
) => {
  try {
    const ai = AIresult;
    const PromptResponse = generatePromptScheduleDayInterpreter(
      body,
      availableDays,
      currentDate
    );
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
const scheduleHourResponse = async (
  body,
  AIresult,
  availableDays,
  currentDate
) => {
  try {
    const ai = AIresult;
    const PromptResponse = generatePromptScheduleHourInterpreter(
      body,
      availableDays,
      currentDate
    );
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

module.exports = {
  interpreterResponse,
  informativeResponse,
  scheduleResponse,
  scheduleDayResponse,
  scheduleHourResponse,
  aclarationResponse
};
