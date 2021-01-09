const fs      = require('fs')
const multer  = require('multer')
const uploads = multer({ storage: multer.memoryStorage() })

const Image = require('../models/concerns/image')

const parsePostParams = ({ files, body }) => {
  const { title, content, tags, urlSlug } = body.post

  const parsedContent = JSON.parse(content).map(block => {
    block.image = Image.persist(files.find(file => file.fieldname === block.uid))

    return block
  })

  return {
    titleImage: Image.persist(files.find(file => file.fieldname === 'post[titleImage]')),
    content:    parsedContent,
    title:      title ? title : null,
    urlSlug:    urlSlug ? urlSlug : null,
    tags:       tags.split(', ')
  }
}

const getUploads = () => uploads.any()

const serializePost = (post, options) => {
  const json = post.toJSON()
  const text = post.content.filter(c => c.text).map(c => c.text).join(' ')

  json.titleImage = post.titleImage.getSignedUrl()

  if (options?.includeContent) {
    json.content.forEach(js => {
      js.image = new Image(js.image).getSignedUrl()
    })
  } else {
    json.content = null
    json.preview = text

    if (json.preview.length > 200) {
      json.preview = json.preview.slice(0, 200)
      json.preview += '...'
    }
  }

  json.readTime = `${Math.ceil(text.split(' ').length / 200)} min`

  return json
}


module.exports = { parsePostParams, getUploads, serializePost }
