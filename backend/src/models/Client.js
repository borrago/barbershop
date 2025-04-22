const { Model, DataTypes } = require('sequelize');

class Client extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
        birth_date: DataTypes.DATE,
        barbershop_id: DataTypes.INTEGER,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'clients',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Barbershop, { foreignKey: 'barbershop_id', as: 'barbershop' });
    this.hasMany(models.Appointment, { foreignKey: 'client_id', as: 'appointments' });
  }
}

module.exports = Client;

 