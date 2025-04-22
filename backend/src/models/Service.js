const { Model, DataTypes } = require('sequelize');

class Service extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        value: DataTypes.DECIMAL(10, 2),
        barbershop_id: DataTypes.INTEGER,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'services',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Barbershop, { foreignKey: 'barbershop_id', as: 'barbershop' });
    this.hasMany(models.AppointmentService, { foreignKey: 'service_id', as: 'appointment_services' });

    this.belongsToMany(models.Appointment, {
      through: models.AppointmentService,
      foreignKey: 'service_id',
      otherKey: 'appointment_id',
      as: 'appointments',
    });    
  }
}

module.exports = Service; 