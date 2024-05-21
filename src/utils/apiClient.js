const axios = require('axios');
const { CHATWOOT_API_TOKEN, CHATWOOT_API_URL } = require('../config');

const apiClient = axios.create({
  baseURL: CHATWOOT_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'api_access_token': CHATWOOT_API_TOKEN
  }
});

module.exports = apiClient;