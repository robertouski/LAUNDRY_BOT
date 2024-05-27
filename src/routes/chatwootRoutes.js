const express = require('express');
const router = express.Router();
const chatwootController = require('../controllers/chatwootController');

router.post('/conversations', chatwootController.createConversation);
router.post('/webhook', chatwootController.handleWebhook);
router.post('/inboxes', chatwootController.createInbox);


module.exports = router;