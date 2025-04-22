const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: {
          type: DataTypes.STRING,
          unique: true,
        },
        birth_date: DataTypes.DATE,
        document: DataTypes.STRING,
        password: DataTypes.STRING,
        phone: DataTypes.STRING,
        role: DataTypes.ENUM('admin', 'user', 'client'),
        barbershop_id: DataTypes.INTEGER,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'users',
        hooks: {
          beforeSave: async (user) => {
            if (user.password) {
              user.password = await bcrypt.hash(user.password, 8);
            }
          },
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Barbershop, { foreignKey: 'barbershop_id', as: 'barbershop' });
    this.hasMany(models.Appointment, { foreignKey: 'user_id', as: 'appointments' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = User; 