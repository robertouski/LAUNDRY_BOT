const axios = require('axios');
const { CHATWOOT_API_TOKEN } = require('../config');

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'api_access_token': CHATWOOT_API_TOKEN
  }
});

module.exports = apiClient;