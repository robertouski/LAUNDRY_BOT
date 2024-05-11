const EventEmitter = require("events");
const {OpenAI} = require("openai");

const OPEN_AI_MODEL = process.env.OPEN_AI_MODEL || 'gpt-3.5-turbo-16k';

const IMessages = []
class EmployeesAddon extends EventEmitter {
  constructor(apiKey) {
    super();
    this.openai = new OpenAI({ apiKey, timeout: 15000 });
    if (!apiKey || apiKey.length === 0) {
      throw new Error("OPEN_AI_KEY is missing");
    }
    this.chatHistory = new Map(IMessages);
  }

  addHistory(from, keyValue) {
    try{
    const currentStateByFrom = this.chatHistory.get(from) || [];
    currentStateByFrom.push(keyValue);
    this.chatHistory.set(from, currentStateByFrom);
    }
    catch(error){
      console.log('AddHistory', error)
    }
  }

  getHistory(from, rows = 25) {
    const history = this.chatHistory.get(from) || [];
    return history.slice(-rows);
  }

  clearHistory() {
    this.chatHistory.clear();
  }

  clearByFrom(from) {
    this.chatHistory.set(from, []);
  }

async talkToAssistant (assistantId, message = {}) {
  try {
    const thread = await this.openai.beta.threads.create();

    // Crear el mensaje inicial del usuario
    await this.openai.beta.threads.messages.create(
      thread.id,
      message
    );

    // Crear y ejecutar el run del asistente
    const run = await this.openai.beta.threads.runs.create(
      thread.id,
      {assistant_id: assistantId}
    );

    // Esperar a que el run complete
    let completedRun;
    do {
      completedRun = await this.openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
    } while (completedRun.status !== 'completed' && completedRun.status !== 'failed');

    // Si el run falla, manejar el error
    if (completedRun.status === 'failed') {
      console.error("Run failed:", completedRun.last_error);
      return null;
    }

    // Recuperar los mensajes después de que el run haya completado
    const messages = await this.openai.beta.threads.messages.list(
      thread.id
    );

    // Filtrar para obtener solo respuestas del asistente
    const assistantMessages = messages.data.filter(m => m.role === 'assistant');
    const lastMessage = assistantMessages[assistantMessages.length - 1];

    return lastMessage ? lastMessage.content[0].text.value : "No response from assistant";
  } catch (error) {
    console.error('Error talking to assistant:', error);
    return null;
  }
}


  async createChat(messages, model, temperature = 0) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model || OPEN_AI_MODEL,
        messages,
        temperature,
        max_tokens: 4096,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      this.emit("gas_token", {
        amount: completion.usage.total_tokens || 0,
      });
      return completion.choices[0].message.content;
    } catch (err) {
      console.error(err);
      return "ERROR";
    }
  }
}

module.exports = EmployeesAddon;
