// src/database/index.js (ou onde estiver este módulo)
const { Sequelize } = require('sequelize');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const common = {
  dialect: 'postgres',
  logging: false,
  retry: {
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /TimeoutError/,
    ],
    max: 3,
  },
  // Se precisar SSL (ex: PG gerenciado), descomente:
  // dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
};

const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, common)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST || 'postgres', // em Docker, use o nome do serviço
        port: Number(process.env.DB_PORT) || 5432,
        ...common,
      }
    );

module.exports = sequelize;
