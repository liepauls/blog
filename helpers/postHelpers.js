const fs      = require('fs')
const multer  = require('multer')
const uploads = multer({ storage: multer.memoryStorage() })
const cheerio = require('cheerio')

const Image    = require('../models/concerns/image')
const { Post } = require('../models')

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

  if (options?.includeContent) {
    json.content.forEach(js => {
      js.image = new Image(js.image).getUrl()
    })
  } else {
    json.content = null
  }

  json.titleImage = post.titleImage.getUrl()
  json.preview    = post.preview
  json.readTime   = `${post.readTime} min`

  return json
}

const findPost = (urlSlug) => (
  Post.findOne({ where: { urlSlug } })
)

const setMetaAndRender = (response, post) => {
  const document = cheerio.load(fs.readFileSync('./client/build/index.html', 'utf8'))

  document('title').text(post.title)
  document('meta[name=description]').attr('content', post.preview)
  document('meta[name=keywords]').attr('content', post.tags.join(', '))
  document('meta[property="og:title"]').attr('content', post.title)
  document('meta[property="og:description"]').attr('content', post.preview)
  document('meta[property="article:tag"]').attr('content', post.tags.join(', '))
  document('meta[property="og:image"]').attr('content', post.titleImage.getUrl())
  document('meta[property="article:published_time"]').attr('content', post.createdAt.toISOString())

  response.send(document.html())
}

module.exports = { parsePostParams, getUploads, serializePost, findPost, setMetaAndRender }
