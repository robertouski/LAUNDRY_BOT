const { addToBlackList, removeFromBlackList } = require('../utils/handler/blacklistHandler.');


const handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    console.log('event:', event)
    const client = req.providerWs; 
    const bot = req.bot
    switch (event.event) {
      case 'conversation_created':
        await handleConversationCreated(event);
        break;
      case 'message_created' :
        await handleMessageCreated(event, client, bot);
        break;
      case 'conversation_updated' :
        await handleconversationUpdated(event);
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

const handleconversationUpdated = async (event) => {
  try {
    const phone_number = event?.meta?.sender?.phone_number.replace("+", "");
    if (event.status === "resolved") {
      return removeFromBlackList(phone_number);
    } else {
      return;
    }
  } catch (error) {
    console.log("Error handleconversationUpdated:", error);
  }
};

const handleMessageCreated = async (event, client, bot) => {
  try {
    const { content, sender, conversation, message_type } = event;
    const { name } = sender;
    const { id: conversation_id, meta } = conversation;
    const idAssigned = conversation?.meta?.assignee
    const  phone_number  = meta?.sender?.phone_number.replace('+', '');

    const conversationStatus = conversation.status
    if (idAssigned && conversationStatus) {
    if (message_type !== "outgoing") {
      console.log(`Ignoring non-outgoing message type: ${message_type}`);
      return; // Ignora si no es un mensaje saliente
    }

    if(idAssigned && conversationStatus ==='open'){
      addToBlackList(phone_number)
      console.log("Number added to MuteBot");
    }else{
      removeFromBlackList(phone_number)
      console.log("Number removed to MuteBot");
    }
  }
    console.log(`Message created with content: ${content}, from: ${name} (${phone_number})`);
    console.log("event.priveate", event.private)
    if (phone_number && idAssigned && conversationStatus ==='open' && !event.private) {
      const chatId = phone_number.includes('@c.us') ? phone_number : `${phone_number}@c.us`;
      await client.getInstance().sendMessage(chatId, content);
      console.log(`Message sent to WhatsApp: ${phone_number}`);
    } else {
      console.log('Phone number is not available for sender.');
    }
  } catch (error) {
    console.error('Error in handleMessageCreatedInput:', error);
  }
};

module.exports = {
  handleWebhook,
};
