// Simula que el ChatBot esta escribiendo.. dura 25 segs 
async function typing(ctx, ctxFn) {
  try {
    const client = ctxFn.provider.getInstance ? ctxFn.provider.getInstance() : null;
    if (!client) {
      console.error("Failed to access the WhatsApp client instance.");
      return;
    }
    const chatId = ctx._data.from
    // Obtener el chat usando el ID del chat
    const chat = await client.getChatById(chatId);
    if (chat) {
      await chat.sendStateTyping(); // Simular que el bot está escribiendo
    } else {
      console.error("Chat not found:", chatId);
    }
  } catch (error) {
    console.error("Error simulating typing state:", error);
  }
}

module.exports = { typing };
