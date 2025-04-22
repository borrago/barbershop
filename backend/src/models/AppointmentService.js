const { Model, DataTypes } = require('sequelize');

class AppointmentService extends Model {
  static init(sequelize) {
    super.init(
      {
        appointment_id: DataTypes.INTEGER,
        service_id: DataTypes.INTEGER,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'appointment_services',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Appointment, { foreignKey: 'appointment_id', as: 'appointment' });
    this.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
  }
}

module.exports = AppointmentService; 