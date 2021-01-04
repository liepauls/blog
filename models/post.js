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
    hooks: {
      afterDestroy: (instance, options) => {
        instance.images.forEach(img => fs.unlink(`../${UPLOAD_DESTINATION}${img}`, err => null))
        fs.unlink(`../${UPLOAD_DESTINATION}${instance.titleImage}`, err => null)
      }
    },
    sequelize,
    modelName: 'Post'
  })

  return Post
}
