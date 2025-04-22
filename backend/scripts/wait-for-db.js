const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
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
  }
);

const waitForDB = async () => {
  console.log('Waiting for database to be ready...');
  let retries = 10;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log('Database is ready!');
      return true;
    } catch (error) {
      console.log(`Database not ready yet, retrying... (${retries} attempts left)`);
      retries--;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  console.error('Could not connect to database after 10 attempts');
  return false;
};

module.exports = waitForDB; 