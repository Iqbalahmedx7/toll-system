const express = require('express'); 
const router = express.Router(); 
const interchangeController = require('../controllers/interchange.js'); 


router.get('/', interchangeController.getInterchanges); 

router.post('/', interchangeController.postInterchange); 

router.get('/:id', interchangeController.getInterchange); 

router.put('/:id', interchangeController.editInterchange); 

router.delete('/:id', interchangeController.deleteInterchange);

module.exports = router; 