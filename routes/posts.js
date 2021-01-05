const router = require('express').Router()

const { Post } = require('../models')
const { persistImage, parsePostParams, getUploads } = require('../helpers/postHelpers')

router.get('/', async (request, response) => {
  const posts = await Post.scope('published').findAll()

  response.json(posts)
})

router.get('/:slug', async (request, response) => {
  const post = await Post.findOne({ where: { urlSlug: request.params.slug } })

  if (post) {
    response.json(post)
  } else {
    response.sendStatus(404)
  }
})

router.post('/', getUploads(), async (request, response) => {
  try {
    const post = await Post.create(parsePostParams(request))

    response.status(201)
    response.json(post)
  } catch (e) {
    response.status(422)
    response.json(e)
  }
})

const perform = async (request, response, callback) => {
  const post = await Post.findByPk(request.params.id)

  if (post) {
    try {
      await callback(post)

      response.status(200)
      response.json(post)
    } catch (e) {
      response.status(422)
      response.json(e)
    }
  } else {
    response.sendStatus(404)
  }
}
router.put('/:id', getUploads(), async (request, response) => {
  perform(request, response, (post) => (
    post.update(parsePostParams(request))
  ))
})

router.put('/:id/publish', async (request, response) => {
  perform(request, response, (post) => (
    post.update({ isPublished: true })
  ))
})

router.put('/:id/unpublish', async (request, response) => {
  perform(request, response, (post) => (
    post.update({ isPublished: false })
  ))
})

router.delete('/:id', async (request, response) => {
  perform(request, response, (post) => (
    post.destroy()
  ))
})

module.exports = { router }
