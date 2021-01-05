'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Posts', 'images')
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Posts', 'images', { type: Sequelize.DataTypes.STRING })
  }
}
