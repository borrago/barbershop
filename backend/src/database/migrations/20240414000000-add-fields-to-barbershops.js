'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('barbershops', 'phone', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('barbershops', 'email', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('barbershops', 'phone');
    await queryInterface.removeColumn('barbershops', 'email');
  },
};
