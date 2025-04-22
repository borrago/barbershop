const sequelize = require('./index');
const models = require('../models');

// Initialize models in the correct order based on dependencies
const modelOrder = [
  'Barbershop',
  'User',
  'Client',
  'Service',
  'Appointment',
  'AppointmentService'
];

// Initialize all models in order
modelOrder.forEach(modelName => {
  const model = models[modelName];
  if (model && model.init) {
    model.init(sequelize);
  }
});

// Run associations after all models are initialized
modelOrder.forEach(modelName => {
  const model = models[modelName];
  if (model && model.associate) {
    model.associate(models);
  }
});

// Sync all models with the database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized');
}).catch(err => {
  console.error('Error synchronizing database:', err);
});

module.exports = sequelize; 