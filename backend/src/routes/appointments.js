const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', AppointmentController.index);
router.post('/', AppointmentController.store);
router.put('/:id', AppointmentController.update);
router.delete('/:id', AppointmentController.delete);

module.exports = router; 