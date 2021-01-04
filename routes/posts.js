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

  const { files }   = request
  const titleImage  = request.files['post[titleImage]'] && request.files['post[titleImage]'][0]?.filename
  const images      = request.files['post[images]']?.map(f => f.filename)
  let parsedContent = JSON.parse(content)
  let mappedImage     = -1

  parsedContent = parsedContent.map((c, i) => {
    if (c.type === 'image') {
      return { ...c, image: images[mappedImage += 1] }
    } else {
      return c
    }
  })

  try {
    const post = await Post.create({
      titleImage,
      images,
      content: parsedContent,
      title:   title ? title : null,
      urlSlug: urlSlug ? urlSlug : null,
      tags:    tags.split(', ')
    })

    response.status(201)
    response.json({})
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
