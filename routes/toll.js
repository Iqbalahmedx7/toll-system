const express = require('express'); 
const router = express.Router(); 
const tollController = require('../controllers/toll.js'); 

router.post('/', tollController.entry); 

router.post('/exit', tollController.exit); 

module.exports = router; 