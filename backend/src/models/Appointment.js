const { Model, DataTypes } = require('sequelize');

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        appointment_date: DataTypes.DATE,
        total_value: DataTypes.DECIMAL(10, 2),
        client_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        barbershop_id: DataTypes.INTEGER,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'appointments',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Barbershop, { foreignKey: 'barbershop_id', as: 'barbershop' });
    this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.hasMany(models.AppointmentService, { foreignKey: 'appointment_id', as: 'appointment_services' });

    this.belongsToMany(models.Service, {
      through: models.AppointmentService,
      foreignKey: 'appointment_id',
      otherKey: 'service_id',
      as: 'services',
    });    
  }
}

module.exports = Appointment; 