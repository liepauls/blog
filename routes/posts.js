const { Post } = require('../models')

const { UPLOAD_DESTINATION } = require('../config/config')

const fs      = require('fs')
const uploads = require('multer')({ dest: UPLOAD_DESTINATION })
const router  = require('express').Router()

router.get('/', async (request, response) => {
  const posts = await Post.findAll()

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

router.post('/', uploads.fields([{ name: 'post[titleImage]' }, { name: 'post[images]' }]), async (request, response) => {
  const { title, content, tags, urlSlug } = request.body.post

  try {
    const post = await Post.create({
      title,
      content,
      urlSlug,
      tags:       JSON.parse(tags),
      titleImage: request.files['post[titleImage]'][0].filename,
      images:     request.files['post[images]'].map(f => f.filename)
    })

    response.status(201)
    response.json(post)
  } catch (e) {
    Object.entries(request.files).forEach(([key, images]) => {
      images.forEach(img => fs.unlink(img.path, err => null))
    })

    response.status(422)
    response.json(e)
  }
})

router.put('/:id', async (request, response) => {
  const post = await Post.findByPk(request.params.id)

  if (post) {
    try {
      await post.update(request.body)

      response.json(post)
    } catch (e) {
      response.status(422)
      response.json(e)
    }
  } else {
    response.sendStatus(404)
  }
})

module.exports = { router }
