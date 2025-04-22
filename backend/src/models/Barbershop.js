const { Model, DataTypes } = require('sequelize');

class Barbershop extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
        document: DataTypes.STRING,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'barbershops',
      }
    );
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: 'barbershop_id', as: 'users' });
    this.hasMany(models.Client, { foreignKey: 'barbershop_id', as: 'clients' });
    this.hasMany(models.Service, { foreignKey: 'barbershop_id', as: 'services' });
    this.hasMany(models.Appointment, { foreignKey: 'barbershop_id', as: 'appointments' });
  }
}

module.exports = Barbershop; 