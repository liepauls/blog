'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Posts', 'isPublished', {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Posts', 'isPublished')
  }
}
