'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('appointments', 'status', {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    });
    await queryInterface.addColumn('appointments', 'notes', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('appointments', 'status');
    await queryInterface.removeColumn('appointments', 'notes');
  },
}; 