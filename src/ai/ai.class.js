const EventEmitter = require("events");
const {OpenAI} = require("openai");
const fs = require('fs');
const path = require('path');

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

  //A partir de aqui es relacionado para encontrar y usar al asistente IA creado

  /**
   * 
   * @param {string} assistantName Nombre de asistente que se desea buscar
   * @returns id del asistente por medio de su nombre
   */
  async findOrCreateAssistant(assistantName) {
    try {
      const assistants = await this.openai.beta.assistants.list();
      const assistant = assistants.data.find(assist => assist.name === assistantName);
  
      if (assistant) {
        return assistant.id;
      }
  
      const newAssistant = await this.openai.beta.assistants.create({
        instructions: 'Eres Jessica una asistente virtual IA, trabajas para la lavanderia: Lavanderia CHIC 🫧. Tu deber es usar la informacion de alguno de los dos documentos que se te compartio de la manera mas breve posible y que tenga contexto con lo ultimo conversado y con lo utlimo que menciona el usuario, en el documento LAVANDERIA_CHIC posees información general para responder a los clientes y en LISTA_PRECIOS son los precios de que corresponden a las prendas por si te preguntan por los precios y no te indica cual es... procedes a preguntarle en ningun momento mencionas que estas usando la informacion de ese documento. SOLO PROPORCIONALO. Procura usar emojis de ropa cuando respondas. Procura tener una manera educada y carismatica al comunicarte. Si el usuario se despide de ti, solo despidete, agregando emojis.',
        name: assistantName,
        tools: [{ type: "file_search" }],
        model: "gpt-3.5-turbo-0125",
      });
  
      return newAssistant.id;
    } catch (error) {
      console.error('Error al buscar o crear el asistente:', error);
      throw error;  // O maneja el error de acuerdo a la política de errores de tu aplicación
    }
  }

  async talkToAssistant(assistantId, message) {
    try {

      const filePathTxt = path.resolve(__dirname, "../../assets/LAVANDERIA_CHIC.txt");
      const filePathPdf = path.resolve(__dirname, "../../assets/LISTA_PRECIOS.pdf");

      const fileDataPdf = await this.openai.files.create({
          file: fs.createReadStream(filePathPdf),
          purpose: "assistants",
      });
      const fileDataTxt = await this.openai.files.create({
          file: fs.createReadStream(filePathTxt),
          purpose: "assistants",
      });

        // Crear un thread con el mensaje del usuario y los archivos adjuntos
        const thread = await this.openai.beta.threads.create({
          messages: [
              {
                  role: "user",
                  content: [
                      {
                          type: "text",  // Agregar esta línea para especificar el tipo de contenido
                          text: message
                      }
                  ],
                  attachments: [
                      { file_id: fileDataTxt.id, tools: [{ type: "file_search" }] },
                      { file_id: fileDataPdf.id, tools: [{ type: "file_search" }] },
                  ],
              },
          ],
      });
        // Crear y ejecutar el run del asistente utilizando el ID específico
        const run = await this.openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistantId,
        });

        // Esperar a que el run complete
        let completedRun;
        do {
            completedRun = await this.openai.beta.threads.runs.retrieve(
                thread.id,
                run.id
            );
        } while (
            completedRun.status !== "completed" &&
            completedRun.status !== "failed"
        );

        // Si el run falla, manejar el error
        if (completedRun.status === "failed") {
            console.error("Run failed:", completedRun.last_error);
            return null;
        }

        // Recuperar los mensajes después de que el run haya completado
        const messages = await this.openai.beta.threads.messages.list(thread.id);
        const assistantMessages = messages.data.filter(
            (m) => m.role === "assistant"
        );
        const lastMessage = assistantMessages[assistantMessages.length - 1];
        return lastMessage
            ? lastMessage.content[0].text.value
            : "No response from assistant";
    } catch (error) {
        console.error('Error talking to assistant:', error);
        return null;
    }
}
}

module.exports = EmployeesAddon;
