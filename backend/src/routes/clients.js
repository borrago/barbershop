const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');

router.get('/', ClientController.index);
router.get('/:id', ClientController.show);
router.post('/', ClientController.store);
router.put('/:id', ClientController.update);
router.delete('/:id', ClientController.delete);

module.exports = router; 