'use strict'

const { Model } = require('sequelize')

const Image = require('./concerns/image')
const validateUniqueness = require('./validators/uniqueness')

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
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
      type: DataTypes.STRING,
      get() {
        const value = this.getDataValue('titleImage')

        if (value) {
          return new Image(value)
        }
      }
    }
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
