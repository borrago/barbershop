'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('users', 'birth_date', {
      type: DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'document', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'role', {
      type: DataTypes.ENUM('admin', 'user', 'client'),
      allowNull: false,
      defaultValue: 'user',
    });
    await queryInterface.addColumn('users', 'barbershop_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'barbershops', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'birth_date');
    await queryInterface.removeColumn('users', 'document');
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'barbershop_id');
  },
}; 