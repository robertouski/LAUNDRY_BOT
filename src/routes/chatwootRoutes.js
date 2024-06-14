const express = require('express');
const router = express.Router();
const chatwootController = require('../controllers/chatwootController');

router.post('/webhook', chatwootController.handleWebhook);


module.exports = router;