'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Posts', 'publishedAt', {
      type: Sequelize.DataTypes.DATE,
      defaultValue: null
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Posts', 'publishedAt')
  }
}
