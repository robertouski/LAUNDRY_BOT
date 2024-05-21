const chatwootService = require('../utils/services/chatwootService');



const createInbox = async (req, res) => {
  const { name } = req.body;
  try {
    const inbox = await chatwootService.createInbox(name);
    res.status(201).json(inbox);
  } catch (error) {
    console.error('Error in createInbox:', error);
    res.status(500).json({ error: error.message });
  }
};

const createConversation = async (req, res) => {
  const { inboxId, contact, content } = req.body;
  console.log("req.body:", req.body)
  try {
    const conversation = await chatwootService.createConversation(inboxId, contact, content);
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error in createConversation:', error);
    res.status(500).json({ error: error.message });
  }
};

const createConversationInLaundryChicBotInbox = async (req, res) => {
  const { contact, message } = req.body;
  try {
    const inboxId = await chatwootService.getInboxIdByName('LAUNDRY CHIC BOT');
    const messageContent = message[0]?.content;
    const conversation = await chatwootService.createConversation(null, inboxId, contact, messageContent);
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error in createConversationInLaundryChicBotInbox:', error);
    res.status(500).json({ error: error.message });
  }
};


const handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    const client = req.providerWs.getInstance(); 
    switch (event.event) {
      case 'conversation_created':
        await handleConversationCreated(event);
        break;
      case 'message_created':
        await handleMessageCreated(event, client);
        break;
      default:
        console.log('Event not handled:', event.event);
    }

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error in handleWebhook:', error);
    res.status(500).json({ error: error.message });
  }
};

const handleConversationCreated = async (event) => {
  try {
    const { contact_inbox, inbox_id } = event;
    const { contact_id } = contact_inbox;

    console.log(`Conversation created with contact ID: ${contact_id}, inbox ID: ${inbox_id}`);
  } catch (error) {
    console.error('Error in handleConversationCreated:', error);
  }
};

const handleMessageCreated = async (event, client) => {
  try {
    const { content, sender, conversation } = event;
    const { name } = sender;
    const { id: conversation_id, meta } = conversation;
    console.log("meta.sender.phone_number fo check:", meta.sender.phone_number)
    const  phone_number  = meta?.sender?.phone_number.replace('+', '');

    console.log(`Message created with content: ${content}, from: ${name} (${phone_number})`);

    if (phone_number) {
      const chatId = phone_number.includes('@c.us') ? phone_number : `${phone_number}@c.us`;
      await client.sendMessage(chatId, content);
      console.log(`Message sent to WhatsApp: ${phone_number}`);
    } else {
      console.log('Phone number is not available for sender.');
    }
  } catch (error) {
    console.error('Error in handleMessageCreated:', error);
  }
};

module.exports = {
  createConversation,
  handleWebhook,
  createInbox,
  createConversationInLaundryChicBotInbox
};
