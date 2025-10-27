// src/config/database.js (ou onde estiver este arquivo)
const { Sequelize } = require('sequelize');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const commonOpts = {
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
};

const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      ...commonOpts,
      // Se precisar de SSL (ex: cloud/managed PG), descomente:
      // dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    })
  : new Sequelize(
      process.env.DB_NAME || 'barbershop',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASS || 'postgres',
      {
        host: process.env.DB_HOST || 'postgres', // em Docker, use o nome do serviço (não 'localhost')
        port: Number(process.env.DB_PORT) || 5432,
        dialect: process.env.DB_DIALECT || 'postgres',
        ...commonOpts,
      }
    );

module.exports = sequelize;
