const { Model, DataTypes } = require('sequelize');

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        path: DataTypes.STRING,
        url: {
          type: DataTypes.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'files',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Barbershop, { foreignKey: 'barbershop_id', as: 'barbershop' });
  }
}

module.exports = File; 