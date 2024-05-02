const interpreter = async (body, AIresult) => {
  try {
    const ai = AIresult;
    const PromptResponse = generatePromptResponse(body);
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

module.exports = {interpreter}