const router = require('express').Router()

const { Post } = require('../models')
const { parsePostParams, getUploads, findPost, serializePost } = require('../helpers/postHelpers')

const unauthorized = ({ body }) => (
  process.env.NODE_ENV === 'production' && body.secret !== process.env.SECRET
)

const perform = async (request, response, callback) => {
  if (unauthorized(request)) {
    return response.sendStatus(401)
  }

  const post = await Post.findByPk(request.params.id)

  if (post) {
    try {
      await callback(post)

      response.status(200)
      response.json(serializePost(post, { includeContent: true }))
    } catch (e) {
      response.status(422)
      response.json(e)
    }
  } else {
    response.sendStatus(404)
  }
}

router.get('/', async (request, response) => {
  const posts = await Post.scope('published').findAll()

  response.json(posts.map(serializePost))
})

router.get('/:slug', async (request, response) => {
  const post = await findPost(request.params.slug)

  if (post) {
    response.json(serializePost(post, { includeContent: true }))
  } else {
    response.sendStatus(404)
  }
})

router.post('/', getUploads(), async (request, response) => {
  if (unauthorized(request)) {
    return response.sendStatus(401)
  }

  try {
    const post = await Post.create(parsePostParams(request))

    response.status(201)
    response.json(serializePost(post, { includeContent: true }))
  } catch (e) {
    response.status(422)
    response.json(e)
  }
})

router.put('/:id', getUploads(), async (request, response) => {
  perform(request, response, (post) => {
    const attributes     = parsePostParams(request)
    const existingBlocks = post.content.filter(block => block.type === 'image').map(block => block.uid)

    attributes.content = attributes.content.map(block => {
      if (block.type !== 'image') return block
      if (!existingBlocks.includes(block.uid)) return block
      if (block.image) return block

      block.image = post.content.find(b => b.uid === block.uid).image

      return block
    })

    post.update(attributes)
  })
})

router.put('/:id/publish', async (request, response) => {
  perform(request, response, (post) => (
    post.update({ isPublished: true, publishedAt: new Date() })
  ))
})

router.put('/:id/unpublish', async (request, response) => {
  perform(request, response, (post) => (
    post.update({ isPublished: false, publishedAt: null })
  ))
})

router.delete('/:id', async (request, response) => {
  perform(request, response, (post) => (
    post.destroy()
  ))
})

module.exports = { router }
