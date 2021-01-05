'use strict'

const { Model } = require('sequelize')
const { UPLOAD_DESTINATION } = require('../config/config')

const validateUniqueness = require('./validators/uniqueness')

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        uniqueness: validateUniqueness(Post, 'title')
      }
    },
    content: {
      type: DataTypes.JSONB
    },
    urlSlug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
        uniqueness: validateUniqueness(Post, 'urlSlug')
      }
    },
    isPublished: {
      type: DataTypes.BOOLEAN
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    titleImage: {
      type: DataTypes.STRING
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
  }, {
    scopes: {
      published: {
        where: { isPublished: true },
        order: [['createdAt', 'DESC']]
      }
    },
    sequelize,
    modelName: 'Post'
  })

  return Post
}
