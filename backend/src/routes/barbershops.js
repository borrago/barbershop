const express = require('express');
const router = express.Router();
const BarbershopController = require('../controllers/BarbershopController');

router.get('/', BarbershopController.index);
router.get('/:id', BarbershopController.show);
router.post('/', BarbershopController.store);
router.put('/:id', BarbershopController.update);
router.delete('/:id', BarbershopController.delete);

module.exports = router; 