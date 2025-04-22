const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');

router.get('/', ServiceController.index);
router.get('/:id', ServiceController.show);
router.post('/', ServiceController.store);
router.put('/:id', ServiceController.update);
router.delete('/:id', ServiceController.delete);

module.exports = router; 