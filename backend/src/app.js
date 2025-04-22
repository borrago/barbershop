require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const { errors } = require('celebrate');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api', routes);
app.use(errors());

module.exports = app; 