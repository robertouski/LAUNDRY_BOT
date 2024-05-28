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
  try {
    const conversation = await chatwootService.createConversation(inboxId, contact, content);
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error in createConversation:', error);
    res.status(500).json({ error: error.message });
  }
};


const handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    console.log('event:', event)
    const bot = req.providerWs; 
    console.log('bot', bot)
    switch (event.event) {
      case 'conversation_created':
        await handleConversationCreated(event);
        break;
      case 'message_created':
        await handleMessageCreatedInput(event, bot);
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

const handleMessageCreatedInput = async (event, bot) => {
  try {
    console.log("Esto es el event:", event)
    const { content, sender, conversation, message_type } = event;
    if (message_type !== "outgoing") {
      console.log(`Ignoring non-outgoing message type: ${message_type}`);
      return; // Ignora si no es un mensaje saliente
    }
    const mapperAttributes = event?.changed_attributes?.map((a) => Object.keys(a)).flat(2)
    console.log('mapperAtri:', mapperAttributes)
    if (event?.event === 'conversation_updated' && mapperAttributes.includes('assignee_id')) {
      const phone = event?.meta?.sender?.phone_number.replace('+', '')
      const idAssigned = event?.changed_attributes[0]?.assignee_id?.current_value ?? null
      console.log("idAssigned:", idAssigned)

      if(idAssigned){
          client.dynamicBlacklist.add(phone)
      }else{
          client.dynamicBlacklist.remove(phone)
      }
      res.send('ok')
      return
  }
    const { name } = sender;
    console.log('conersario en handleMessage:', conversation)
    const { id: conversation_id, meta } = conversation;
    console.log("meta.sender.phone_number fo check:", meta.sender.phone_number)
    const  phone_number  = meta?.sender?.phone_number.replace('+', '');

    console.log(`Message created with content: ${content}, from: ${name} (${phone_number})`);

    if (phone_number) {
      const chatId = phone_number.includes('@c.us') ? phone_number : `${phone_number}@c.us`;
      await bot.getInstance().sendMessage(chatId, content);
      console.log(`Message sent to WhatsApp: ${phone_number}`);
    } else {
      console.log('Phone number is not available for sender.');
    }
  } catch (error) {
    console.error('Error in handleMessageCreatedInput:', error);
  }
};

module.exports = {
  createConversation,
  handleWebhook,
  createInbox
};
