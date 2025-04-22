const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/', UserController.index);
router.get('/:id', UserController.show);
router.post('/', UserController.store);
router.post('/create', UserController.storeUser);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router; 