const express = require('express');
const router = express.Router();
const chatwootController = require('../controllers/chatwootController');

router.post('/conversations', chatwootController.createConversation);
router.post('/webhook', chatwootController.handleWebhook);

module.exports = router;