const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

const authRoutes = require('./auth');
const barbershopRoutes = require('./barbershops');
const userRoutes = require('./users');
const clientRoutes = require('./clients');
const serviceRoutes = require('./services');
const appointmentRoutes = require('./appointments');

router.use('/auth', authRoutes);
router.use('/barbershops', authMiddleware, barbershopRoutes);
router.use('/users', authMiddleware, userRoutes);
router.use('/clients', authMiddleware, clientRoutes);
router.use('/services', authMiddleware, serviceRoutes);
router.use('/appointments', authMiddleware, appointmentRoutes);

module.exports = router; 