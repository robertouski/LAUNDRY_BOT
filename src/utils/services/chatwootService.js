const apiClient = require('../apiClient');
const { CHATWOOT_ACCOUNT_ID, WEBSITE_URL } = require('../../config');

const getInboxes = async () => {
  try {
    const response = await apiClient.get(`/accounts/${CHATWOOT_ACCOUNT_ID}/inboxes`);
    return response.data.payload;
  } catch (error) {
    throw new Error(`Error fetching inboxes: ${error.response ? error.response.data : error.message}`);
  }
};

const getInboxIdByName = async (name) => {
  try {
    const inboxes = await getInboxes();
    const inbox = inboxes.find(inbox => inbox.name === name);
    if (inbox) {
      return inbox.id;
    } else {
      throw new Error(`Inbox with name ${name} not found`);
    }
  } catch (error) {
    throw new Error(`Error fetching inbox ID: ${error.message}`);
  }
};

const createContact = async (name, identifier) => {
  try {
    const response = await apiClient.post(`/accounts/${CHATWOOT_ACCOUNT_ID}/contacts`, {
      name,
      identifier
    });
    return response.data.payload.contact;
  } catch (error) {
    throw new Error(`Error creating contact: ${error.message}`);
  }
};
const createInbox = async (name) => {
  try {
    const inboxes = await getInboxes();

    const existingInbox = await inboxes.find(inbox => inbox.name === name);

    if (existingInbox) {
      console.log('Inbox already exists');
      return existingInbox;
    }

    console.log('Creating new inbox');
    const response = await apiClient.post(`/accounts/${CHATWOOT_ACCOUNT_ID}/inboxes`, {
      name,
      channel: {
        type: 'web_widget', // Ajusta el tipo de canal según sea necesario
        website_url: WEBSITE_URL // Ajusta la URL según sea necesario
      }
    });

    console.log('response:', response);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating inbox: ${error.message}`);
  }
};
const createConversation = async (inboxId, contact, messageContent) => {
  try {
    console.log('Entre a createConversation ')
    const response = await apiClient.post(`/accounts/${CHATWOOT_ACCOUNT_ID}/conversations`, {
      inbox_id: inboxId,
      contact,
      message: {
        content: messageContent
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error creating conversation: ${error.message}`);
  }
};






module.exports = {
  createConversation,
  createInbox,
  getInboxes,
  getInboxIdByName,
  createContact
};