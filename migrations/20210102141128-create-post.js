'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING(30000)
      },
      urlSlug: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tags: {
        defaultValue: [],
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      titleImage: {
        type: Sequelize.STRING
      },
      images: {
        defaultValue: [],
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Posts')
  }
}
