const apiClient = require('../utils/apiClient');
const { CHATWOOT_API_URL, CHATWOOT_ACCOUNT_ID } = require('../config');

const createConversation = async (sourceId, inboxId, contact, message) => {
  try {
    const response = await apiClient.post(`${CHATWOOT_API_URL}/accounts/${CHATWOOT_ACCOUNT_ID}/conversations`, {
      source_id: sourceId,
      inbox_id: inboxId,
      contact,
      messages: [{ content: message }]
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error creating conversation: ${error.message}`);
  }
};

module.exports = {
  createConversation
};